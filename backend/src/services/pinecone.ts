/**
 * 導入必要的模組和類型
 */
import { generateEmbedding } from './../services/embedding';
import type { FaqSearchResult } from './../types/chat';
import { Env } from '../index';

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
    console.log('初始化 Pinecone 客戶端:', {
      环境: environment,
      索引名稱: indexName,
      API密鑰: apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : '未提供',
      完整URL: this.fullApiUrl || '未提供'
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
    try {
      // 檢查必要的配置
      if (!this.apiKey) {
        throw new Error('未設置 Pinecone API 金鑰');
      }
      
      // 生成查詢文本的向量嵌入
      const embedding = await generateEmbedding(query, this.env);
      
      // 決定使用哪個 API URL
      let url: string;
      if (this.fullApiUrl) {
        // 使用完整的 API URL
        url = `${this.fullApiUrl.replace(/\/$/, '')}/query`;
        console.log(`使用完整 Pinecone API URL: ${url}`);
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
        
        console.log(`使用組合的 Pinecone API URL: ${url}`, {
          索引: this.indexName,
          環境: this.environment
        });
      }
      
      console.log(`開始查詢 Pinecone: "${query}" (limit=${limit}, threshold=${threshold})`);
      
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
        let errorMessage = `Pinecone API 錯誤: HTTP ${response.status}`;
        try {
          // 嘗試解析錯誤回應為 JSON
          const errorData = await response.json();
          errorMessage += ` - ${JSON.stringify(errorData)}`;
        } catch (e) {
          // 如果無法解析 JSON，則獲取文本內容
          errorMessage += ` - ${await response.text()}`;
        }
        throw new Error(errorMessage);
      }
      
      // 解析回應為 JSON
      const data = await response.json();
      
      // 記錄原始回應
      console.log(`Pinecone 原始回應:`, {
        總結果數: data.matches?.length || 0,
        命名空間: data.namespace
      });
      
      // 記錄第一個結果的詳細資訊（如果有）
      if (data.matches?.length > 0) {
        console.log(`第一個結果:`, {
          id: data.matches[0].id,
          score: data.matches[0].score,
          metadata: data.matches[0].metadata ? Object.keys(data.matches[0].metadata) : '無'
        });
      } else {
        console.log(`沒有找到匹配的結果`);
      }
      
      // 過濾並映射結果，只保留相似度高於閾值的結果
      const results = data.matches
        .filter((match: any) => match.score >= threshold)
        .map((match: any) => ({
          id: match.id,
          question: match.metadata.question,
          answer: match.metadata.answer,
          score: match.score,
          category: match.metadata.category,
          tags: match.metadata.tags || []
        }));
      
      console.log(`過濾後返回 ${results.length} 個結果 (閾值=${threshold})`);
      
      return results;
    } catch (error) {
      // 記錄並重新拋出錯誤
      console.error('Pinecone 搜尋錯誤:', error);
      throw error;
    }
  }
  
  /**
   * 添加 FAQ 到 Pinecone
   * @param faq FAQ 數據
   * @returns 操作結果
   */
  async addFaq(faq: { id: string; question: string; answer: string; category?: string; tags?: string[] }): Promise<boolean> {
    try {
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
      
      // 生成問題的向量嵌入
      const embedding = await generateEmbedding(faq.question, this.env);
      
      // 構建 API URL
      const baseUrl = `https://${this.indexName}-${this.environment}.svc.${this.environment}.pinecone.io`;
      const url = `${baseUrl}/vectors/upsert`;
      
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
        const errorData = await response.json();
        throw new Error(`Pinecone API 錯誤: ${JSON.stringify(errorData)}`);
      }
      
      return true;
    } catch (error) {
      // 記錄並重新拋出錯誤
      console.error('添加 FAQ 錯誤:', error);
      throw error;
    }
  }
} 