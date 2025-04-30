/**
 * Pinecone 客戶端
 * 用於處理 FAQ 向量檢索的主要入口點
 */
import { Env } from '../../index';
import { VectorStore } from './vector-store.interface';
import { 
  FaqSearchResult, 
  VectorItem, 
  VectorCacheConfig, 
  DEFAULT_CACHE_CONFIG,
  VectorSearchConfig,
  DEFAULT_SEARCH_CONFIG,
  VectorClientConfig
} from './types';
import { PineconeSearch } from './search';
import { PineconeIndexing } from './indexing';
import { VectorCacheService } from './cache';
import { vectorLogger } from '../../utils/logger';
import { withRetry, serviceDegradation } from '../../utils/retry';
import { generateEmbedding } from '../embedding';

/**
 * Pinecone 客戶端
 * 實現 VectorStore 介面，提供向量搜尋和索引功能
 */
export class PineconeClient implements VectorStore {
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
   * 搜尋服務
   */
  private searchService: PineconeSearch;
  
  /**
   * 索引服務
   */
  private indexingService: PineconeIndexing;
  
  /**
   * 快取服務
   */
  private cacheService: VectorCacheService;
  
  /**
   * 快取配置
   */
  private cacheConfig: VectorCacheConfig;
  
  /**
   * 建立 Pinecone 客戶端
   * @param config 客戶端配置
   */
  constructor(config: VectorClientConfig) {
    // 驗證 API 金鑰是否存在
    if (!config.apiKey) {
      throw new Error('未設置 Pinecone API 金鑰');
    }
    
    // 直接使用完整 API URL (如果提供)
    this.fullApiUrl = config.fullApiUrl || config.env?.PINECONE_API_URL;
    
    // 如果未提供完整 URL，仍需檢查必要的環境參數
    if (!this.fullApiUrl) {
      // 檢查環境參數是否存在
      if (!config.environment) {
        throw new Error('未設置 Pinecone 環境');
      }
      
      // 檢查索引名稱，嘗試從環境變數中獲取
      let indexName = config.indexName;
      if (!indexName) {
        // 嘗試從 env 獲取索引名稱
        if (config.env?.PINECONE_INDEX) {
          indexName = config.env.PINECONE_INDEX;
        } else if (config.env?.PINECONE_INDEX_NAME) {
          indexName = config.env.PINECONE_INDEX_NAME;
        } else {
          throw new Error('未設置 Pinecone 索引名稱');
        }
      }
      this.indexName = indexName;
    } else {
      this.indexName = config.indexName || '';
    }
    
    // 設置實例屬性
    this.apiKey = config.apiKey;
    this.environment = config.environment;
    this.env = config.env;
    
    // 初始化快取配置
    this.cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...config.cacheConfig };
    
    // 初始化服務
    this.searchService = new PineconeSearch(
      this.apiKey,
      this.environment,
      this.indexName,
      this.env,
      this.fullApiUrl
    );
    
    this.indexingService = new PineconeIndexing(
      this.apiKey,
      this.environment,
      this.indexName,
      this.env,
      this.fullApiUrl
    );
    
    this.cacheService = new VectorCacheService(this.cacheConfig);
    
    // 記錄初始化信息，但不顯示完整 API 密鑰
    vectorLogger.info('初始化 Pinecone 客戶端', {
      environment: this.environment,
      indexName: this.indexName,
      apiKey: this.apiKey ? `${this.apiKey.substring(0, 4)}...${this.apiKey.substring(this.apiKey.length - 4)}` : '未提供',
      fullApiUrl: this.fullApiUrl || '未提供'
    });
  }
  
  /**
   * 清理資源
   */
  cleanup(): void {
    // 清理快取資源
    this.cacheService.cleanup();
    vectorLogger.debug('清理 Pinecone 客戶端資源');
  }
  
  /**
   * 清除查詢快取
   * @returns 清除的快取項目數量
   */
  clearQueryCache(): number {
    return this.cacheService.clear();
  }
  
  /**
   * 獲取快取統計資訊
   * @returns 快取統計資訊
   */
  getCacheStats(): { size: number, enabled: boolean, ttl: number, maxSize: number } {
    return this.cacheService.getStats();
  }
  
  /**
   * 搜尋相關 FAQ
   * @param query 查詢文本
   * @param config 搜尋配置
   * @returns FAQ 搜尋結果
   */
  async searchFaqs(query: string, config?: Partial<VectorSearchConfig>): Promise<FaqSearchResult[]> {
    // 檢查必要的配置
    if (!this.apiKey) {
      throw new Error('未設置 Pinecone API 金鑰');
    }
    
    // 合併搜尋配置
    const searchConfig: VectorSearchConfig = {
      ...DEFAULT_SEARCH_CONFIG,
      ...config
    };
    
    // 查詢預處理，提取關鍵詞
    const processedQuery = this.searchService.preprocessQuery(query);
    
    // 嘗試從快取中獲取結果
    const cachedResult = this.cacheService.get(query, searchConfig.limit, searchConfig.threshold);
    if (cachedResult) {
      return cachedResult;
    }
    
    // 將搜尋邏輯封裝為函數，以方便重試
    const performSearch = async (): Promise<FaqSearchResult[]> => {
      // 生成查詢文本的向量嵌入
      const embedding = await generateEmbedding(query, this.env);
      
      // 執行向量搜尋
      const results = await this.searchService.executeVectorSearch(query, embedding, searchConfig);
      
      // 將結果存入快取
      this.cacheService.set(query, searchConfig.limit, searchConfig.threshold, results);
      
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
   * @param item FAQ 資料
   * @returns 操作結果
   */
  async addFaq(item: VectorItem): Promise<boolean> {
    // 將添加 FAQ 的邏輯封裝為函數，以方便重試
    const performAddFaq = async (): Promise<boolean> => {
      return this.indexingService.addFaq(item);
    };
    
    try {
      // 使用重試機制調用添加 FAQ 函數
      return await withRetry(performAddFaq, {
        maxRetries: 3,
        initialDelay: 500,
        maxDelay: 5000,
        logPrefix: 'Pinecone'
      });
    } catch (error) {
      // 報告服務失敗
      serviceDegradation.reportFailure('Pinecone', error instanceof Error ? error : new Error(String(error)));
      
      // 記錄錯誤
      vectorLogger.error('添加 FAQ 到 Pinecone 過程中發生錯誤', error);
      
      // 拋出錯誤
      throw error;
    }
  }
  
  /**
   * 批量添加 FAQ 到 Pinecone
   * @param items FAQ 資料陣列
   * @returns 操作結果
   */
  async addFaqs(items: VectorItem[]): Promise<boolean> {
    // 將批量添加 FAQ 的邏輯封裝為函數，以方便重試
    const performAddFaqs = async (): Promise<boolean> => {
      return this.indexingService.addFaqs(items);
    };
    
    try {
      // 使用重試機制調用批量添加 FAQ 函數
      return await withRetry(performAddFaqs, {
        maxRetries: 3,
        initialDelay: 500,
        maxDelay: 5000,
        logPrefix: 'Pinecone'
      });
    } catch (error) {
      // 報告服務失敗
      serviceDegradation.reportFailure('Pinecone', error instanceof Error ? error : new Error(String(error)));
      
      // 記錄錯誤
      vectorLogger.error('批量添加 FAQ 到 Pinecone 過程中發生錯誤', error);
      
      // 拋出錯誤
      throw error;
    }
  }
  
  /**
   * 刪除 FAQ
   * @param id FAQ ID
   * @returns 操作結果
   */
  async deleteFaq(id: string): Promise<boolean> {
    // 將刪除 FAQ 的邏輯封裝為函數，以方便重試
    const performDeleteFaq = async (): Promise<boolean> => {
      return this.indexingService.deleteFaq(id);
    };
    
    try {
      // 使用重試機制調用刪除 FAQ 函數
      return await withRetry(performDeleteFaq, {
        maxRetries: 3,
        initialDelay: 500,
        maxDelay: 5000,
        logPrefix: 'Pinecone'
      });
    } catch (error) {
      // 報告服務失敗
      serviceDegradation.reportFailure('Pinecone', error instanceof Error ? error : new Error(String(error)));
      
      // 記錄錯誤
      vectorLogger.error('從 Pinecone 刪除 FAQ 過程中發生錯誤', error);
      
      // 拋出錯誤
      throw error;
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

/**
 * 建立 Pinecone 客戶端
 * @param env 環境變數
 * @param config 客戶端配置
 * @returns Pinecone 客戶端實例
 */
export function createPineconeClient(env: Env, config?: Partial<VectorClientConfig>): PineconeClient {
  // 從環境變數中獲取 API 金鑰
  const apiKey = config?.apiKey || env.PINECONE_API_KEY;
  
  // 從環境變數中獲取環境名稱
  const environment = config?.environment || env.PINECONE_ENVIRONMENT;
  
  // 從環境變數中獲取索引名稱
  let indexName = config?.indexName;
  if (!indexName) {
    if (env.PINECONE_INDEX) {
      indexName = env.PINECONE_INDEX;
    } else if (env.PINECONE_INDEX_NAME) {
      indexName = env.PINECONE_INDEX_NAME;
    }
  }
  
  // 從環境變數中獲取完整 API URL
  const fullApiUrl = config?.fullApiUrl || env.PINECONE_API_URL;
  
  // 建立客戶端配置
  const clientConfig: VectorClientConfig = {
    apiKey: apiKey || '',
    environment: environment || '',
    indexName: indexName || '',
    env,
    fullApiUrl,
    cacheConfig: config?.cacheConfig
  };
  
  // 建立並返回客戶端實例
  return new PineconeClient(clientConfig);
}
