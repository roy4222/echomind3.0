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
  
  /**
   * 使用 sigmoid 函數校準相關性分數
   * @param score 原始分數
   * @returns 校準後的分數 (0-1 範圍)
   */
  private calibrateScore(score: number): number {
    // 參數調整
    const scaleFactor = 8.0; // 控制 sigmoid 函數的陡陡度
    const midPoint = 0.5;    // 控制 sigmoid 函數的中點
    
    // 使用 sigmoid 函數進行分數校準
    // sigmoid(x) = 1 / (1 + e^(-k * (x - midPoint)))
    const calibrated = 1.0 / (1.0 + Math.exp(-scaleFactor * (score - midPoint)));
    
    // 調整範圍使分數分布更均勻
    // 將 sigmoid 函數轉換為 0.1-0.9 的範圍，避免極端值
    const minOutput = 0.1;
    const maxOutput = 0.95;
    const scaledOutput = minOutput + calibrated * (maxOutput - minOutput);
    
    vectorLogger.debug('分數校準', {
      originalScore: score,
      calibratedScore: calibrated,
      finalScore: scaledOutput
    });
    
    return scaledOutput;
  }
  
  /**
   * 整合相似的 FAQ 結果
   * @param results 原始 FAQ 搜尋結果
   * @returns 整合後的結果
   */
  private integrateSimilarFaqs(results: FaqSearchResult[]): FaqSearchResult[] {
    if (results.length <= 1) {
      return results;
    }
    
    // 評估整合的閾值 - 問題相似度至少要達到這個相似度才考慮整合
    const INTEGRATION_THRESHOLD = 0.65;
    const MAX_RESULTS_TO_INTEGRATE = 5; // 限制整合的最大數量
    
    // 存儲已經被整合的結果 ID
    const integratedIds = new Set<string>();
    
    // 存儲整合後的結果
    const integratedResults: FaqSearchResult[] = [];
    
    // 先根據分數排序，確保我們先處理更相關的結果
    const sortedResults = [...results].sort((a: FaqSearchResult, b: FaqSearchResult) => b.score - a.score);
    
    for (let i = 0; i < sortedResults.length; i++) {
      const currentFaq = sortedResults[i];
      
      // 如果當前 FAQs 已經被整合到其他結果中，則跳過
      if (integratedIds.has(currentFaq.id)) {
        continue;
      }
      
      // 初始化新的整合結果
      const integratedFaq: FaqSearchResult = {
        ...currentFaq,
        integrated: false,
        integratedFrom: []
      };
      
      let integratedCount = 0;
      
      // 尋找可以整合的其他相似 FAQ
      for (let j = i + 1; j < sortedResults.length; j++) {
        // 限制整合數量
        if (integratedCount >= MAX_RESULTS_TO_INTEGRATE) {
          break;
        }
        
        const otherFaq = sortedResults[j];
        
        // 如果已經被整合，則跳過
        if (integratedIds.has(otherFaq.id)) {
          continue;
        }
        
        // 計算問題相似度 - 簡單的詞彙重疊分析
        const similarity = this.calculateQuestionSimilarity(currentFaq.question, otherFaq.question);
        
        // 也可以根據分類和標籤判斷相關性
        let categoryMatch = false;
        if (currentFaq.category && otherFaq.category && 
            currentFaq.category === otherFaq.category) {
          categoryMatch = true;
        }
        
        // 如果相似度超過閾值或分類相匹配，進行整合
        if (similarity > INTEGRATION_THRESHOLD || categoryMatch) {
          // 結合答案，移除重復內容
          // 注意：這裡我們可以實現更先進的文本組合邏輯
          const integratedAnswer = this.combineAnswers(integratedFaq.answer, otherFaq.answer);
          
          // 更新整合結果
          integratedFaq.answer = integratedAnswer;
          integratedFaq.integrated = true;
          
          // 記錄整合來源
          if (!integratedFaq.integratedFrom) {
            integratedFaq.integratedFrom = [];
          }
          integratedFaq.integratedFrom.push(otherFaq.id);
          
          // 記錄已整合的 ID
          integratedIds.add(otherFaq.id);
          integratedCount++;
          
          vectorLogger.debug('整合相似 FAQs', {
            primaryId: currentFaq.id,
            integratedId: otherFaq.id,
            similarity: similarity,
            categoryMatch: categoryMatch
          });
        }
      }
      
      // 將整合的結果添加到結果列表
      integratedResults.push(integratedFaq);
    }
    
    vectorLogger.info('FAQ 整合完成', {
      originalResults: results.length,
      integratedResults: integratedResults.length,
      reductionRate: (results.length - integratedResults.length) / results.length
    });
    
    return integratedResults;
  }
  
  /**
   * 計算兩個問題的相似度
   * @param question1 第一個問題
   * @param question2 第二個問題
   * @returns 相似度分數 (0-1)
   */
  private calculateQuestionSimilarity(question1: string, question2: string): number {
    // 將問題轉換為小寫並分詞
    const words1 = question1.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    const words2 = question2.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    
    // 計算共同詞彙
    const commonWords = words1.filter(word => words2.includes(word));
    
    // 計算 Jaccard 相似度
    const union = new Set([...words1, ...words2]);
    const jaccardSimilarity = union.size > 0 ? commonWords.length / union.size : 0;
    
    // 計算字元相同比例 (對於中文特別有用)
    // 將兩個問題轉換為字元數組
    const chars1 = [...question1.toLowerCase()];
    const chars2 = [...question2.toLowerCase()];
    
    // 尋找共同字元
    const commonChars = chars1.filter(char => chars2.includes(char));
    
    // 計算字元相似度 (Dice 係數)
    const charSimilarity = (chars1.length + chars2.length) > 0 ? 
        (2 * commonChars.length) / (chars1.length + chars2.length) : 0;
    
    // 結合兩種相似度，給予詞彙相似度更高的權重
    const combinedSimilarity = (jaccardSimilarity * 0.7) + (charSimilarity * 0.3);
    
    return combinedSimilarity;
  }
  
  /**
   * 將兩個答案組合成一個更完整的答案
   * @param primaryAnswer 主要答案
   * @param secondaryAnswer 次要答案
   * @returns 組合後的答案
   */
  private combineAnswers(primaryAnswer: string, secondaryAnswer: string): string {
    // 如果兩個答案完全相同，直接返回主要答案
    if (primaryAnswer === secondaryAnswer) {
      return primaryAnswer;
    }
    
    // 如果主要答案包含次要答案，返回主要答案
    if (primaryAnswer.includes(secondaryAnswer)) {
      return primaryAnswer;
    }
    
    // 如果次要答案包含主要答案，返回次要答案
    if (secondaryAnswer.includes(primaryAnswer)) {
      return secondaryAnswer;
    }
    
    // 拆分答案為句子
    const primarySentences = primaryAnswer.split(/[.，,.!！？?]\s*/).filter(s => s.trim());
    const secondarySentences = secondaryAnswer.split(/[.，,.!！？?]\s*/).filter(s => s.trim());
    
    // 管理防止重複句子
    const uniqueSentences = new Set<string>(primarySentences);
    
    // 添加非重複的次要句子
    for (const sentence of secondarySentences) {
      let isDuplicate = false;
      
      // 檢查是否包含相似句子
      for (const existingSentence of uniqueSentences) {
        // 使用精確字串匹配或計算相似度
        if (existingSentence.includes(sentence) || 
            sentence.includes(existingSentence) ||
            this.calculateStringSimilarity(existingSentence, sentence) > 0.7) {
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        uniqueSentences.add(sentence);
      }
    }
    
    // 將精選的句子重新組合為答案
    return Array.from(uniqueSentences).join('. ') + '.';
  }
  
  /**
   * 計算兩個字串的相似度
   * @param str1 第一個字串
   * @param str2 第二個字串
   * @returns 相似度分數 (0-1)
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    // 如果字串相同，直接返回 1.0
    if (str1 === str2) return 1.0;
    
    // 如果其中一個字串為空，返回 0
    if (!str1 || !str2) return 0.0;
    
    // 轉換為小寫並去除過多空白
    const s1 = str1.toLowerCase().trim().replace(/\s+/g, ' ');
    const s2 = str2.toLowerCase().trim().replace(/\s+/g, ' ');
    
    // 計算 Levenshtein 距離 (編輯距離)
    const len1 = s1.length;
    const len2 = s2.length;
    
    // 初始化距離矩陣
    const dp: number[][] = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    
    // 基本情況初始化
    for (let i = 0; i <= len1; i++) dp[i][0] = i;
    for (let j = 0; j <= len2; j++) dp[0][j] = j;
    
    // 動態規劃計算
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // 刪除
          dp[i][j - 1] + 1,      // 插入
          dp[i - 1][j - 1] + cost // 替換
        );
      }
    }
    
    // 計算正規化的相似度分數
    const maxLen = Math.max(len1, len2);
    if (maxLen === 0) return 1.0; // 兩個均為空字串
    
    // 將編輯距離轉換為相似度分數
    return 1.0 - (dp[len1][len2] / maxLen);
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
          // 獲取問題和分類信息
          const questionLower = (match.metadata.question || '').toLowerCase();
          const category = match.metadata.category || 'general';
          const tags = match.metadata.tags || [];
          const importance = match.metadata.importance || 1.0;
          
          // 1. 改進的文本相似度計算
          const queryLower = query.toLowerCase();
          const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);
          
          // 計算精確詞彙匹配率
          let wordMatchCount = 0;
          for (const word of queryWords) {
            if (questionLower.includes(word)) {
              wordMatchCount++;
            }
          }
          
          const wordMatchRatio = queryWords.length > 0 ? wordMatchCount / queryWords.length : 0;
          
          // 2. 加權因子計算
          // 精確文本匹配加權: 0.4
          // 語義相似度加權: 0.5
          // 重要性加權: 0.1 
          const textMatchWeight = 0.4;
          const semanticWeight = 0.5;
          const importanceWeight = 0.1;
          
          // 計算各組成部分的分數
          let textMatchScore = 0;
          
          // 檢查是否有完全匹配
          if (questionLower === queryLower) {
            textMatchScore = 1.0; // 完全匹配給予最高分
          } 
          // 檢查是否包含完整查詢
          else if (questionLower.includes(queryLower)) {
            textMatchScore = 0.8; // 包含整個查詢字串給予高分
          }
          // 檢查詞彙匹配率
          else {
            textMatchScore = wordMatchRatio * 0.6; // 基於詞彙匹配率給分
          }
          
          // 使用原始向量相似度作為語義相似度
          const semanticScore = match.score;
          
          // 計算標籤相關性分數
          let tagBoost = 1.0;
          // 檢查查詢與標籤的相關性
          for (const tag of tags) {
            if (queryLower.includes(tag.toLowerCase())) {
              tagBoost += 0.1; // 每個匹配的標籤增加 0.1 的提升
            }
          }
          
          // 3. 最終加權相似度計算
          const weightedScore = (
            textMatchScore * textMatchWeight +
            semanticScore * semanticWeight +
            (importance * importanceWeight)
          ) * tagBoost;
          
          // 4. 相關性分數校準 (使用 sigmoid 函數)
          const scaledScore = this.calibrateScore(weightedScore);
          
          // 創建結果對象
          const result: FaqSearchResult = {
            id: match.id,
            question: match.metadata.question || '',
            answer: match.metadata.answer || '',
            category: category,
            tags: tags,
            importance: importance,
            metadata: match.metadata,
            score: scaledScore,
            originalScore: match.score, // 保存原始分數用於調試
            textMatchScore: textMatchScore, // 保存文本匹配分數
            semanticScore: semanticScore, // 保存語義相似度分數
            tagBoost: tagBoost // 保存標籤提升因子
          };
          results.push(result);
        }
        
        // 5. 進行內容整合，合併相似問題的答案
        const mergedResults = this.integrateSimilarFaqs(results);
        
        // 根據最終分數重新排序結果
        mergedResults.sort((a, b) => b.score - a.score);
        
        // 截取到用戶要求的限制數量
        if (mergedResults.length > limit) {
          mergedResults.splice(limit);
        }
        
        // 將整合後的結果賦值回 results
        results.length = 0;
        results.push(...mergedResults);
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