/**
 * 導入必要的模組和類型
 */
import { generateEmbedding } from './../services/embedding';
import type { FaqSearchResult } from './../types/chat';
import { Env } from '../index';
import { vectorLogger, LogLevel } from '../utils/logger';
import { ExternalApiError } from '../utils/errorHandler';
import { withRetry, serviceDegradation } from '../utils/retry';

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
   * 建立 Pinecone 客戶端
   * @param apiKey Pinecone API 金鑰
   * @param environment Pinecone 環境
   * @param indexName Pinecone 索引名稱
   * @param env 環境變數
   * @param fullApiUrl 完整的 Pinecone API URL (可選)
   */
  constructor(apiKey: string, environment: string, indexName: string, env?: Env, fullApiUrl?: string) {
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
    
    // 記錄初始化信息，但不顯示完整 API 密鑰
    vectorLogger.info('初始化 Pinecone 客戶端', {
      environment,
      indexName,
      apiKey: apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : '未提供',
      fullApiUrl: this.fullApiUrl || '未提供'
    });
  }
  
  /**
   * 搜尋相關 FAQ
   * @param query 查詢文本
   * @param limit 結果數量限制
   * @param threshold 相似度閾值
   * @returns FAQ 搜尋結果
   */
  async searchFaqs(query: string, limit: number = 5, threshold: number = 0.1): Promise<FaqSearchResult[]> {
    // 檢查必要的配置
    if (!this.apiKey) {
      throw new Error('未設置 Pinecone API 金鑰');
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
      
      // 發送請求到 Pinecone
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': this.apiKey
        },
        body: JSON.stringify({
          vector: embedding,
          topK: limit,
          includeMetadata: true,
          includeValues: false
        })
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
          metadata: data.matches[0].metadata ? Object.keys(data.matches[0].metadata) : '無'
        });
      } else {
        vectorLogger.debug(`沒有找到匹配的結果`);
      }
      
      // 檢查是否有匹配結果
      if (!data.matches || !Array.isArray(data.matches)) {
        // 如果沒有匹配結果，返回空數組
        return [];
      }
      
      // 過濾並映射結果，只保留相似度高於閾值的結果
      const filteredResults = data.matches
        .filter((match: any) => match.score >= threshold)
        .map((match: any) => ({
          id: match.id,
          question: match.metadata?.question || '',
          answer: match.metadata?.answer || '',
          score: match.score,
          category: match.metadata?.category || '',
          tags: match.metadata?.tags || []
        }));
      
      vectorLogger.debug(`結果過濾: 在相似度閾值 ${threshold} 之上的有 ${filteredResults.length} 個結果`);
      
      return filteredResults;
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