/**
 * 索引和添加資料相關邏輯
 */
import { generateEmbedding } from '../embedding';
import { VectorItem } from './types';
import { vectorLogger } from '../../utils/logger';
import { ExternalApiError } from '../../utils/errorHandler';
import { Env } from '../../index';

/**
 * Pinecone 索引服務
 * 提供向量資料的索引和管理功能
 */
export class PineconeIndexing {
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
   * 建立 Pinecone 索引服務
   * @param apiKey Pinecone API 金鑰
   * @param environment Pinecone 環境
   * @param indexName Pinecone 索引名稱
   * @param env 環境變數
   * @param fullApiUrl 完整的 Pinecone API URL (可選)
   */
  constructor(apiKey: string, environment: string, indexName: string, env?: Env, fullApiUrl?: string) {
    this.apiKey = apiKey;
    this.environment = environment;
    this.indexName = indexName;
    this.env = env;
    this.fullApiUrl = fullApiUrl;
  }
  
  /**
   * 添加 FAQ 到 Pinecone
   * @param item FAQ 資料
   * @returns 操作結果
   */
  async addFaq(item: VectorItem): Promise<boolean> {
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
    
    try {
      // 生成向量嵌入
      const embedding = await generateEmbedding(item.question, this.env);
      vectorLogger.info('生成 FAQ 向量嵌入成功', {
        id: item.id,
        embeddingLength: embedding.length,
        question: item.question.substring(0, 50) + (item.question.length > 50 ? '...' : '')
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
        faqId: item.id,
        category: item.category || 'general'
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
            id: item.id,
            values: embedding,
            metadata: {
              question: item.question,
              answer: item.answer,
              category: item.category || 'general',
              tags: item.tags || [],
              importance: item.importance || 1.0,
              ...item.metadata
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
      
      vectorLogger.info('FAQ 添加到 Pinecone 成功', { faqId: item.id });
      
      return true;
    } catch (error) {
      // 如果是 ExternalApiError，直接拋出
      if (error instanceof ExternalApiError) {
        throw error;
      }
      
      // 將其他錯誤包裝為 ExternalApiError
      vectorLogger.error('添加 FAQ 到 Pinecone 過程中發生錯誤', error);
      throw new ExternalApiError(
        `添加 FAQ 到 Pinecone 過程中發生錯誤: ${error instanceof Error ? error.message : String(error)}`,
        'Pinecone',
        500,
        true // 假設其他錯誤可以重試
      );
    }
  }
  
  /**
   * 批量添加 FAQ 到 Pinecone
   * @param items FAQ 資料陣列
   * @returns 操作結果
   */
  async addFaqs(items: VectorItem[]): Promise<boolean> {
    if (!items || items.length === 0) {
      return true;
    }
    
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
    
    try {
      // 構建 API URL
      let url: string;
      if (this.fullApiUrl) {
        // 使用完整的 API URL
        url = `${this.fullApiUrl.replace(/\/$/, '')}/vectors/upsert`;
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
      
      // 批量處理，每批最多 100 個項目
      const batchSize = 100;
      const batches = [];
      
      for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize));
      }
      
      vectorLogger.info('開始批量添加 FAQ 到 Pinecone', {
        totalItems: items.length,
        batchCount: batches.length,
        batchSize
      });
      
      // 逐批處理
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        
        // 生成向量嵌入
        const embeddings = await Promise.all(
          batch.map(item => generateEmbedding(item.question, this.env))
        );
        
        // 準備向量資料
        const vectors = batch.map((item, index) => ({
          id: item.id,
          values: embeddings[index],
          metadata: {
            question: item.question,
            answer: item.answer,
            category: item.category || 'general',
            tags: item.tags || [],
            importance: item.importance || 1.0,
            ...item.metadata
          }
        }));
        
        // 發送添加請求
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': this.apiKey
          },
          body: JSON.stringify({ vectors })
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
          
          throw new ExternalApiError(
            errorMessage,
            'Pinecone',
            statusCode,
            statusCode >= 500 || statusCode === 429,
            errorDetails
          );
        }
        
        vectorLogger.info(`批次 ${i + 1}/${batches.length} 添加成功`, {
          batchSize: batch.length
        });
      }
      
      vectorLogger.info('所有 FAQ 批量添加到 Pinecone 成功', {
        totalItems: items.length
      });
      
      return true;
    } catch (error) {
      // 如果是 ExternalApiError，直接拋出
      if (error instanceof ExternalApiError) {
        throw error;
      }
      
      // 將其他錯誤包裝為 ExternalApiError
      vectorLogger.error('批量添加 FAQ 到 Pinecone 過程中發生錯誤', error);
      throw new ExternalApiError(
        `批量添加 FAQ 到 Pinecone 過程中發生錯誤: ${error instanceof Error ? error.message : String(error)}`,
        'Pinecone',
        500,
        true
      );
    }
  }
  
  /**
   * 刪除 FAQ
   * @param id FAQ ID
   * @returns 操作結果
   */
  async deleteFaq(id: string): Promise<boolean> {
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
    
    try {
      // 構建 API URL
      let url: string;
      if (this.fullApiUrl) {
        // 使用完整的 API URL
        url = `${this.fullApiUrl.replace(/\/$/, '')}/vectors/delete`;
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
        url = `${baseUrl}/vectors/delete`;
      }
      
      vectorLogger.info('開始從 Pinecone 刪除 FAQ', { faqId: id });
      
      // 發送刪除請求
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': this.apiKey
        },
        body: JSON.stringify({
          ids: [id],
          namespace: ''
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
        
        throw new ExternalApiError(
          errorMessage,
          'Pinecone',
          statusCode,
          statusCode >= 500 || statusCode === 429,
          errorDetails
        );
      }
      
      vectorLogger.info('FAQ 從 Pinecone 刪除成功', { faqId: id });
      
      return true;
    } catch (error) {
      // 如果是 ExternalApiError，直接拋出
      if (error instanceof ExternalApiError) {
        throw error;
      }
      
      // 將其他錯誤包裝為 ExternalApiError
      vectorLogger.error('從 Pinecone 刪除 FAQ 過程中發生錯誤', error);
      throw new ExternalApiError(
        `從 Pinecone 刪除 FAQ 過程中發生錯誤: ${error instanceof Error ? error.message : String(error)}`,
        'Pinecone',
        500,
        true
      );
    }
  }
  
  /**
   * 更新 FAQ
   * @param item FAQ 資料
   * @returns 操作結果
   */
  async updateFaq(item: VectorItem): Promise<boolean> {
    // 更新就是重新添加，Pinecone 會自動覆蓋相同 ID 的向量
    return this.addFaq(item);
  }
}
