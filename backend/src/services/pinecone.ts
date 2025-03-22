import { generateEmbedding } from './../services/embedding';
import type { FaqSearchResult } from './../types/chat';

/**
 * Pinecone 客戶端
 * 用於處理 FAQ 向量檢索
 */
export class PineconeClient {
  private apiKey: string;
  private environment: string;
  private indexName: string;
  
  /**
   * 建立 Pinecone 客戶端
   * @param apiKey Pinecone API 金鑰
   * @param environment Pinecone 環境
   * @param indexName Pinecone 索引名稱
   */
  constructor(apiKey: string, environment: string, indexName: string) {
    this.apiKey = apiKey;
    this.environment = environment;
    this.indexName = indexName;
  }
  
  /**
   * 搜尋相關 FAQ
   * @param query 查詢文本
   * @param limit 結果數量限制
   * @param threshold 相似度閾值
   * @returns FAQ 搜尋結果
   */
  async searchFaqs(query: string, limit: number = 5, threshold: number = 0.75): Promise<FaqSearchResult[]> {
    try {
      // 生成查詢的向量嵌入
      const embedding = await generateEmbedding(query);
      
      // 構建 API URL
      const baseUrl = `https://${this.indexName}-${this.environment}.svc.${this.environment}.pinecone.io`;
      const url = `${baseUrl}/query`;
      
      // 發送查詢請求
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
      
      // 檢查回應
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Pinecone API 錯誤: ${JSON.stringify(errorData)}`);
      }
      
      // 解析回應數據
      const data = await response.json();
      
      // 過濾並格式化結果
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
      
      return results;
    } catch (error) {
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
      // 生成問題的向量嵌入
      const embedding = await generateEmbedding(faq.question);
      
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
      
      // 檢查回應
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Pinecone API 錯誤: ${JSON.stringify(errorData)}`);
      }
      
      return true;
    } catch (error) {
      console.error('添加 FAQ 錯誤:', error);
      throw error;
    }
  }
} 