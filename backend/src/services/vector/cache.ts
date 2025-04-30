/**
 * 向量搜尋快取邏輯
 */
import { MemoryCache, createCacheKey } from '../../utils/cache';
import { FaqSearchResult, VectorCacheConfig, DEFAULT_CACHE_CONFIG } from './types';
import { vectorLogger } from '../../utils/logger';

/**
 * 向量搜尋快取服務
 * 提供向量搜尋結果的快取功能
 */
export class VectorCacheService {
  /**
   * 查詢結果快取
   */
  private queryCache: MemoryCache<FaqSearchResult[]>;
  
  /**
   * 快取配置
   */
  private cacheConfig: VectorCacheConfig;
  
  /**
   * 建立向量快取服務
   * @param cacheConfig 快取配置
   */
  constructor(cacheConfig?: Partial<VectorCacheConfig>) {
    // 初始化快取配置
    this.cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...cacheConfig };
    
    // 初始化快取
    this.queryCache = new MemoryCache<FaqSearchResult[]>({
      ttl: this.cacheConfig.ttl,
      maxSize: this.cacheConfig.maxSize
    });
    
    vectorLogger.debug('初始化向量快取服務', {
      enabled: this.cacheConfig.enabled,
      ttl: this.cacheConfig.ttl,
      maxSize: this.cacheConfig.maxSize
    });
  }
  
  /**
   * 從快取中獲取結果
   * @param query 查詢文本
   * @param limit 結果數量限制
   * @param threshold 相似度閾值
   * @returns 快取的結果，如果未命中則返回 null
   */
  get(query: string, limit: number, threshold: number): FaqSearchResult[] | null {
    if (!this.cacheConfig.enabled) {
      return null;
    }
    
    const cacheKey = createCacheKey('pinecone-search', query, limit, threshold);
    const cachedResult = this.queryCache.get(cacheKey);
    
    if (cachedResult) {
      vectorLogger.info('從快取獲取向量查詢結果', {
        query: query.substring(0, 50) + (query.length > 50 ? '...' : ''),
        limit,
        cacheHit: true
      });
      return cachedResult;
    }
    
    return null;
  }
  
  /**
   * 將結果存入快取
   * @param query 查詢文本
   * @param limit 結果數量限制
   * @param threshold 相似度閾值
   * @param results 搜尋結果
   */
  set(query: string, limit: number, threshold: number, results: FaqSearchResult[]): void {
    if (!this.cacheConfig.enabled) {
      return;
    }
    
    const cacheKey = createCacheKey('pinecone-search', query, limit, threshold);
    this.queryCache.set(cacheKey, results);
    
    vectorLogger.debug('向量查詢結果已快取', { 
      cacheKey,
      resultsCount: results.length,
      query: query.substring(0, 50) + (query.length > 50 ? '...' : '')
    });
  }
  
  /**
   * 清除快取
   * @returns 清除的快取項目數量
   */
  clear(): number {
    const size = this.queryCache.size();
    this.queryCache.clear();
    vectorLogger.info('已清除向量查詢快取', { clearedItems: size });
    return size;
  }
  
  /**
   * 獲取快取統計資訊
   * @returns 快取統計資訊
   */
  getStats(): { size: number, enabled: boolean, ttl: number, maxSize: number } {
    return {
      size: this.queryCache.size(),
      enabled: this.cacheConfig.enabled,
      ttl: this.cacheConfig.ttl,
      maxSize: this.cacheConfig.maxSize
    };
  }
  
  /**
   * 清理資源
   */
  cleanup(): void {
    this.queryCache.shutdown();
    vectorLogger.debug('清理向量快取服務資源');
  }
}
