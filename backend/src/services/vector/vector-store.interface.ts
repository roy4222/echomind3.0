/**
 * 向量儲存抽象介面
 */
import { FaqSearchResult, VectorItem, VectorCacheConfig, VectorSearchConfig } from './types';
import { Env } from '../../index';

/**
 * 向量儲存介面
 * 定義向量資料庫的基本操作
 */
export interface VectorStore {
  /**
   * 搜尋相關 FAQ
   * @param query 查詢文本
   * @param config 搜尋配置
   * @returns FAQ 搜尋結果
   */
  searchFaqs(query: string, config?: Partial<VectorSearchConfig>): Promise<FaqSearchResult[]>;
  
  /**
   * 添加 FAQ 到向量儲存
   * @param item FAQ 資料
   * @returns 操作結果
   */
  addFaq(item: VectorItem): Promise<boolean>;
  
  /**
   * 批量添加 FAQ 到向量儲存
   * @param items FAQ 資料陣列
   * @returns 操作結果
   */
  addFaqs(items: VectorItem[]): Promise<boolean>;
  
  /**
   * 刪除 FAQ
   * @param id FAQ ID
   * @returns 操作結果
   */
  deleteFaq(id: string): Promise<boolean>;
  
  /**
   * 更新 FAQ
   * @param item FAQ 資料
   * @returns 操作結果
   */
  updateFaq(item: VectorItem): Promise<boolean>;
  
  /**
   * 清理資源
   */
  cleanup(): void;
  
  /**
   * 清除查詢快取
   * @returns 清除的快取項目數量
   */
  clearQueryCache(): number;
  
  /**
   * 獲取快取統計資訊
   * @returns 快取統計資訊
   */
  getCacheStats(): { size: number, enabled: boolean, ttl: number, maxSize: number };
}

/**
 * 向量儲存工廠介面
 */
export interface VectorStoreFactory {
  /**
   * 建立向量儲存實例
   * @param env 環境變數
   * @param config 向量客戶端配置
   * @returns 向量儲存實例
   */
  create(env: Env, config?: Partial<VectorCacheConfig>): VectorStore;
}
