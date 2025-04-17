/**
 * 導入必要的模組和類型
 */
import { generateEmbedding } from './../services/embedding';
import type { FaqSearchResult } from './../types/chat';
import { Env } from '../index';
import { vectorLogger, LogLevel } from '../utils/logger';
import { ExternalApiError } from '../utils/errorHandler';
import { withRetry, serviceDegradation } from '../utils/retry';
import { MemoryCache, createCacheKey } from '../utils/cache';

/**
 * Pinecone 客戶端快取配置
 */
export interface PineconeCacheConfig {
  /** 是否啟用快取 */
  enabled: boolean;
  /** 快取存活時間 (毫秒) */
  ttl: number;
  /** 最大快取項目數量 */
  maxSize: number;
}

/**
 * Pinecone 客戶端默認快取配置
 */
const DEFAULT_CACHE_CONFIG: PineconeCacheConfig = {
  enabled: true,
  ttl: 30 * 60 * 1000, // 30 分鐘
  maxSize: 1000
};

/**
 * Pinecone 客戶端
 * 用於處理 FAQ 向量檢索
 */
export class PineconeClient {
  /**
   * Pinecone API 金鑰
   */
  private apiKey: string;
  
  /**
   * Pinecone 環境名稱
   */
  private environment: string;
  
  /**
   * Pinecone 索引名稱
   */
  private indexName: string;
  
  /**
   * 環境變數配置
   */
  private env?: Env;
  
  /**
   * 完整 API URL (可選)
   */
  private fullApiUrl?: string;
  
  /**
   * 查詢結果快取
   */
  private queryCache: MemoryCache<FaqSearchResult[]>;
  
  /**
   * 快取配置
   */
  private cacheConfig: PineconeCacheConfig;
  
  /**
   * 建立 Pinecone 客戶端
   * @param apiKey Pinecone API 金鑰
   * @param environment Pinecone 環境
   * @param indexName Pinecone 索引名稱
   * @param env 環境變數
   * @param fullApiUrl 完整的 Pinecone API URL (可選)
   */
  constructor(apiKey: string, environment: string, indexName: string, env?: Env, fullApiUrl?: string, cacheConfig?: Partial<PineconeCacheConfig>) {
    // 驗證 API 金鑰是否存在
    if (!apiKey) {
      throw new Error('未設置 Pinecone API 金鑰');
    }
    
    // 直接使用完整 API URL (如果提供)
    this.fullApiUrl = fullApiUrl || env?.PINECONE_API_URL;
    
    // 如果未提供完整 URL，仍需檢查必要的環境參數
    if (!this.fullApiUrl) {
      // 檢查環境參數是否存在
      if (!environment) {
        throw new Error('未設置 Pinecone 環境');
      }
      
      // 檢查索引名稱，嘗試從環境變數中獲取
      if (!indexName) {
        // 嘗試從 env 獲取索引名稱
        if (env?.PINECONE_INDEX) {
          indexName = env.PINECONE_INDEX;
        } else if (env?.PINECONE_INDEX_NAME) {
          indexName = env.PINECONE_INDEX_NAME;
        } else {
          throw new Error('未設置 Pinecone 索引名稱');
        }
      }
    }
    
    // 設置實例屬性
    this.apiKey = apiKey;
    this.environment = environment;
    this.indexName = indexName;
    this.env = env;
    
    // 初始化快取配置
    this.cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...cacheConfig };
    
    // 初始化快取
    this.queryCache = new MemoryCache<FaqSearchResult[]>({
      ttl: this.cacheConfig.ttl,
      maxSize: this.cacheConfig.maxSize
    });
    
    // 記錄初始化信息，但不顯示完整 API 密鑰
    vectorLogger.info('初始化 Pinecone 客戶端', {
      environment,
      indexName,
      apiKey: apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : '未提供',
      fullApiUrl: this.fullApiUrl || '未提供'
    });
  }
  
  /**
   * 清理資源
   */
  cleanup(): void {
    // 清理快取資源
    this.queryCache.shutdown();
    vectorLogger.debug('清理 Pinecone 客戶端資源');
  }
  
  /**
   * 清除查詢快取
   * @returns 清除的快取項目數量
   */
  clearQueryCache(): number {
    const size = this.queryCache.size();
    this.queryCache.clear();
    vectorLogger.info('已清除 Pinecone 查詢快取', { clearedItems: size });
    return size;
  }
  
  /**
   * 獲取快取統計資訊
   * @returns 快取統計資訊
   */
  getCacheStats(): { size: number, enabled: boolean, ttl: number, maxSize: number } {
    return {
      size: this.queryCache.size(),
      enabled: this.cacheConfig.enabled,
      ttl: this.cacheConfig.ttl,
      maxSize: this.cacheConfig.maxSize
    };
  }
  
  /**
   * 搜尋相關 FAQ
   * @param query 查詢文本
   * @param limit 結果數量限制
   * @param threshold 相似度閾值
   * @returns FAQ 搜尋結果
   */
  /**
   * 處理查詢預處理，提取關鍵詞
   * @param query 原始查詢文本
   * @returns 處理後的查詢文本
   */
  private preprocessQuery(query: string): string {
    // 簡單的停用詞列表 (可擴充)
    const stopwords = ['的', '了', '和', '與', '在', '是', '我', '有', '這', '那', '怎麼', '如何', '請問', '可以', '嗎'];
    
    // 移除標點符號
    let processedQuery = query.replace(/[.,。，、！？!?;；:：()（）{}「」""]/g, ' ');
    
    // 分詞並移除停用詞 (簡易版)
    let words = processedQuery.split(/\s+/).filter(word => word.length > 0);
    words = words.filter(word => !stopwords.includes(word));
    
    // 如果過濾後的詞太少，回退到原始查詢
    if (words.length < 2) {
      vectorLogger.debug('預處理後關鍵詞太少，使用原始查詢', { 
        originalQuery: query, 
        processedWords: words 
      });
      return query;
    }
    
    // 重組查詢
    const processedQueryText = words.join(' ');
    
    vectorLogger.debug('查詢預處理完成', { 
      originalQuery: query, 
      processedQuery: processedQueryText,
      keywordsExtracted: words
    });
    
    return processedQueryText;
  }
  
  /**
   * 動態計算相似度閾值
   * @param query 查詢文本
   * @param baseThreshold 基礎閾值
   * @returns 調整後的閾值
   */
  private calculateDynamicThreshold(query: string, baseThreshold: number): number {
    // 基於查詢長度的動態閾值調整
    const queryLength = query.length;
    let dynamicThreshold = baseThreshold;
    
    // 短查詢需要更高的閾值來減少誤匹配
    if (queryLength < 5) {
      dynamicThreshold = baseThreshold * 1.5;
    } 
    // 中等長度查詢使用基礎閾值
    else if (queryLength >= 5 && queryLength <= 20) {
      dynamicThreshold = baseThreshold;
    } 
    // 長查詢降低閾值以獲取更多相關結果
    else {
      // 最低不低於基礎閾值的 70%
      dynamicThreshold = Math.max(baseThreshold * 0.7, 0.07);
    }
    
    vectorLogger.debug('計算動態閾值', { 
      originalThreshold: baseThreshold, 
      dynamicThreshold: dynamicThreshold,
      queryLength: queryLength
    });
    
    return dynamicThreshold;
  }

  async searchFaqs(query: string, limit: number = 5, threshold: number = 0.1): Promise<FaqSearchResult[]> {
    // 檢查必要的配置
    if (!this.apiKey) {
      throw new Error('未設置 Pinecone API 金鑰');
    }
    
    // 查詢預處理，提取關鍵詞
    const processedQuery = this.preprocessQuery(query);
    
    // 計算動態閾值
    const dynamicThreshold = this.calculateDynamicThreshold(processedQuery, threshold);
    
    // 建立快取鍵 (使用原始查詢，確保快取一致性)
    const cacheKey = createCacheKey('pinecone-search', query, limit, threshold);
    
    // 如果啟用快取，嘗試從快取中獲取結果
    if (this.cacheConfig.enabled) {
      const cachedResult = this.queryCache.get(cacheKey);
      if (cachedResult) {
        vectorLogger.info('從快取獲取 Pinecone 查詢結果', {
          query: query.substring(0, 50) + (query.length > 50 ? '...' : ''),
          processedQuery: processedQuery !== query ? processedQuery : '同原始查詢',
          limit,
          cacheHit: true
        });
        return cachedResult;
      }
    }

    // 將搜尋邏輯封裝為函數，以方便重試
    const performSearch = async (): Promise<FaqSearchResult[]> => {
      // 生成查詢文本的向量嵌入
      const embedding = await generateEmbedding(query, this.env);
      
      // Pinecone 索引 URL - 直接使用完整URL或組合
      let url: string;
      if (this.fullApiUrl) {
        // 使用完整的 API URL
        url = `${this.fullApiUrl.replace(/\/$/, '')}/query`;
        vectorLogger.debug(`使用完整 Pinecone API URL: ${url}`);
      } else {
        // 創建 Pinecone API URL - 處理不同環境的 URL 格式
        let baseUrl: string;
        if (this.environment === 'gcp-starter') {
          // GCP-Starter 環境使用不同的 URL 格式
          baseUrl = `https://${this.indexName}.svc.${this.environment}.pinecone.io`;
        } else {
          // 標準環境格式
          baseUrl = `https://${this.indexName}-${this.environment}.svc.${this.environment}.pinecone.io`;
        }
        url = `${baseUrl}/query`;
        
        vectorLogger.debug(`使用組合的 Pinecone API URL: ${url}`, {
          indexName: this.indexName,
          environment: this.environment
        });
      }
      
      vectorLogger.info('開始查詢 Pinecone', {
        query,
        limit,
        threshold
      });
      
      // 準備向量搜尋參數
      const searchParams = {
        vector: embedding,
        topK: Math.min(limit * 2, 20), // 獲取更多候選項，以便進行後處理篩選
        includeMetadata: true,
        includeValues: false,
        namespace: '', // 確保在未指定命名空間時使用默認空間
        filter: {}, // 可以根據實際需求添加過濾條件
        sparseVector: undefined // 用於混合搜索，目前未使用
      };
      
      vectorLogger.debug('Pinecone 搜索參數配置', {
        topK: searchParams.topK,
        originalLimit: limit,
        dynamicThreshold
      });
      
      // 發送請求到 Pinecone
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': this.apiKey
        },
        body: JSON.stringify(searchParams)
      });
      
      // 檢查回應狀態
      if (!response.ok) {
        let errorDetails: any;
        const statusCode = response.status;
        let errorMessage = `Pinecone API 錯誤: HTTP ${statusCode}`;

        try {
          // 嘗試解析錯誤回應為 JSON
          const responseBody = await response.json();
          errorDetails = responseBody;
          vectorLogger.error('收到 Pinecone 錯誤回應詳情', responseBody);
          errorMessage += ` - ${responseBody.message || '未知錯誤'}`;
        } catch (jsonError) {
          vectorLogger.error('Pinecone 回應解析錯誤', jsonError);
          const textResponse = await response.text();
          errorDetails = { rawResponse: textResponse };
          errorMessage += ` - ${textResponse}`;
        }
        
        // 判斷是否應該重試
        // 5xx 是服務器錯誤，429 是請求超出限制，這兩種情況可以重試
        const retryable = statusCode >= 500 || statusCode === 429;
        
        throw new ExternalApiError(
          errorMessage,
          'Pinecone',
          statusCode,
          retryable,
          errorDetails
        );
      }
      
      // 解析回應數據
      const data = await response.json();
      vectorLogger.info('收到 Pinecone 回應', {
        matchesCount: data.matches?.length || 0,
        namespace: data.namespace
      });
      
      // 報告服務成功
      serviceDegradation.reportSuccess('Pinecone');
      
      // 記錄第一個結果的詳細資訊（如果有）
      if (data.matches?.length > 0) {
        vectorLogger.debug(`第一個結果:`, {
          id: data.matches[0].id,
          score: data.matches[0].score,
          metadata: data.matches[0].metadata
        });
      } else {
        vectorLogger.debug(`沒有找到匹配的結果`);
      }
      
      // 處理結果
      const results: FaqSearchResult[] = [];
      
      if (data.matches && data.matches.length > 0) {
        // 定義 Pinecone 匹配項介面
        interface PineconeMatch {
          id: string;
          score: number;
          metadata: Record<string, any>;
          values?: number[];
        }
        
        // 首先收集所有符合動態閾值的匹配項
        const validMatches = data.matches.filter((match: PineconeMatch) => match.score >= dynamicThreshold);
        
        // 記錄篩選結果
        vectorLogger.debug('動態閾值篩選結果', {
          totalMatches: data.matches.length,
          matchesAboveThreshold: validMatches.length,
          dynamicThreshold,
          originalThreshold: threshold
        });
        
        // 對結果進行後處理和增強
        for (const match of validMatches as PineconeMatch[]) {
          // 計算文本相似度增強因子 (簡單示例)
          let textSimilarityBoost = 1.0;
          const queryLower = query.toLowerCase();
          const questionLower = (match.metadata.question || '').toLowerCase();
          
          // 如果問題中包含原始查詢的關鍵詞，增加分數
          if (queryLower.length > 3 && questionLower.includes(queryLower)) {
            textSimilarityBoost = 1.2;
          }
          
          // 最終分數是向量相似度與文本相似度增強的組合
          const finalScore = match.score * textSimilarityBoost;
          
          // 創建結果對象
          const result: FaqSearchResult = {
            id: match.id,
            question: match.metadata.question || '',
            answer: match.metadata.answer || '',
            metadata: match.metadata,
            score: finalScore,
            originalScore: match.score // 保存原始分數用於調試
          };
          results.push(result);
        }
        
        // 根據最終分數重新排序結果
        results.sort((a, b) => b.score - a.score);
        
        // 截取到用戶要求的限制數量
        if (results.length > limit) {
          results.splice(limit);
        }
      }
      
      // 如果啟用快取，將結果存入快取
      if (this.cacheConfig.enabled) {
        this.queryCache.set(cacheKey, results);
        vectorLogger.debug('Pinecone 查詢結果已快取', { 
          cacheKey,
          resultsCount: results.length,
          processedQuery: processedQuery !== query ? processedQuery : '同原始查詢',
          dynamicThreshold
        });
      }
      
      return results;
    };
    
    try {
      // 使用重試機制調用搜尋函數
      return await withRetry(performSearch, {
        maxRetries: 3,
        initialDelay: 500,
        maxDelay: 5000,
        logPrefix: 'Pinecone'
      });
    } catch (error) {
      // 報告服務失敗
      serviceDegradation.reportFailure('Pinecone', error instanceof Error ? error : new Error(String(error)));
      
      // 記錄錯誤
      vectorLogger.error('在 Pinecone 搜索過程中發生錯誤，返回空結果', error);
      
      // 降級策略：如果錯誤，返回空結果
      return [];
    }
  }
  
  /**
   * 添加 FAQ 到 Pinecone
   * @param faq FAQ 數據
   * @returns 操作結果
   */
  async addFaq(faq: { id: string; question: string; answer: string; category?: string; tags?: string[] }): Promise<boolean> {
    // 檢查必要的配置
    if (!this.apiKey) {
      throw new Error('未設置 Pinecone API 金鑰');
    }
    
    if (!this.environment) {
      throw new Error('未設置 Pinecone 環境');
    }
    
    if (!this.indexName) {
      throw new Error('未設置 Pinecone 索引名稱');
    }
    
    // 將添加 FAQ 的邏輯封裝為函數，以方便重試
    const performAddFaq = async (): Promise<boolean> => {
      try {
        // 生成向量嵌入
        const embedding = await generateEmbedding(faq.question, this.env);
        vectorLogger.info('生成 FAQ 向量嵌入成功', {
          id: faq.id,
          embeddingLength: embedding.length,
          question: faq.question.substring(0, 50) + (faq.question.length > 50 ? '...' : '')
        });
        
        // 構建 API URL
        let url: string;
        if (this.fullApiUrl) {
          // 使用完整的 API URL
          url = `${this.fullApiUrl.replace(/\/$/, '')}/vectors/upsert`;
          vectorLogger.debug(`使用完整 Pinecone API URL: ${url}`);
        } else {
          // 使用組合 URL
          let baseUrl: string;
          if (this.environment === 'gcp-starter') {
            // GCP-Starter 環境使用不同的 URL 格式
            baseUrl = `https://${this.indexName}.svc.${this.environment}.pinecone.io`;
          } else {
            // 標準環境格式
            baseUrl = `https://${this.indexName}-${this.environment}.svc.${this.environment}.pinecone.io`;
          }
          url = `${baseUrl}/vectors/upsert`;
        }
        
        vectorLogger.info('開始向 Pinecone 添加 FAQ', {
          faqId: faq.id,
          category: faq.category || 'general'
        });
        
        // 發送添加請求
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': this.apiKey
          },
          body: JSON.stringify({
            vectors: [{
              id: faq.id,
              values: embedding,
              metadata: {
                question: faq.question,
                answer: faq.answer,
                category: faq.category || 'general',
                tags: faq.tags || []
              }
            }]
          })
        });
        
        // 檢查回應狀態
        if (!response.ok) {
          let errorDetails: any;
          const statusCode = response.status;
          let errorMessage = `Pinecone API 錯誤: HTTP ${statusCode}`;
          
          try {
            // 嘗試解析錯誤回應為 JSON
            const errorData = await response.json();
            errorDetails = errorData;
            vectorLogger.error('收到 Pinecone 錯誤回應詳情', errorData);
            errorMessage += ` - ${JSON.stringify(errorData)}`;
          } catch (jsonError) {
            // 如果無法解析為 JSON，則使用原始文本
            const textResponse = await response.text();
            errorDetails = { rawResponse: textResponse };
            errorMessage += ` - ${textResponse}`;
          }
          
          // 判斷是否應該重試
          // 5xx 是服務器錯誤，429 是請求超出限制，這兩種情況可以重試
          const retryable = statusCode >= 500 || statusCode === 429;
          
          throw new ExternalApiError(
            errorMessage,
            'Pinecone',
            statusCode,
            retryable,
            errorDetails
          );
        }
        
        // 報告服務成功
        serviceDegradation.reportSuccess('Pinecone');
        vectorLogger.info('FAQ 添加到 Pinecone 成功', { faqId: faq.id });
        
        return true;
      } catch (error) {
        // 如果是 ExternalApiError，直接拋出以觸發重試
        if (error instanceof ExternalApiError) {
          throw error;
        }
        
        // 將其他錯誤包裝為 ExternalApiError
        vectorLogger.error('添加 FAQ 到 Pinecone 過程中發生態類錯誤', error);
        throw new ExternalApiError(
          `添加 FAQ 到 Pinecone 過程中發生錯誤: ${error instanceof Error ? error.message : String(error)}`,
          'Pinecone',
          500,
          true // 假設其他錯誤可以重試
        );
      }
    };
    
    try {
      // 使用重試機制調用添加 FAQ 函數
      return await withRetry(performAddFaq, {
        maxRetries: 3,
        initialDelay: 500,
        maxDelay: 5000,
        logPrefix: 'Pinecone-AddFaq'
      });
    } catch (error) {
      // 報告服務失敗
      serviceDegradation.reportFailure('Pinecone', error instanceof Error ? error : new Error(String(error)));
      
      // 記錄錯誤
      vectorLogger.error('在添加 FAQ 到 Pinecone 過程中失敗，所有重試都失敗', error);
      
      // 返回失敗結果
      return false;
    }
  }
}