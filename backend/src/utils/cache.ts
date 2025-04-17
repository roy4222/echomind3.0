/**
 * 快取服務模組
 * 提供高效的內存和持久化快取功能，支援 TTL 和自動清理
 */

// 快取項目介面
interface CacheItem<T> {
  value: T;
  expiry: number | null; // null 表示永不過期
  lastAccessed: number;
}

// 快取選項介面
export interface CacheOptions {
  ttl?: number;          // 生存時間（毫秒），預設為 1 小時
  maxSize?: number;      // 最大項目數，預設為 1000
  cleanupThreshold?: number; // 清理門檻，超過此值就清理，預設為 100
}

/**
 * 內存快取服務
 * 提供高效的鍵值對存儲，支援 TTL 和 LRU 清理
 */
export class MemoryCache<T> {
  private cache: Map<string, CacheItem<T>> = new Map();
  private options: Required<CacheOptions>;
  private operationCount: number = 0;

  /**
   * 創建快取實例
   * @param options 快取配置選項
   */
  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl ?? 3600000, // 1 小時
      maxSize: options.maxSize ?? 1000,
      cleanupThreshold: options.cleanupThreshold ?? 100 // 每 100 次操作清理一次
    };
  }

  /**
   * 設置快取項目
   * @param key 快取鍵
   * @param value 快取值
   * @param ttl 可選：此項目的特定 TTL
   * @returns 是否成功設置
   */
  set(key: string, value: T, ttl?: number): boolean {
    // 每次操作增加計數器，定期執行清理
    this.operationCount++;
    if (this.operationCount >= this.options.cleanupThreshold) {
      this.cleanup();
      this.operationCount = 0;
    }
    
    // 檢查容量，如果達到限制，執行 LRU 清理
    if (this.cache.size >= this.options.maxSize) {
      this.evictLRU();
    }

    const now = Date.now();
    const expiry = ttl ? now + ttl : ttl === 0 ? null : now + this.options.ttl;

    this.cache.set(key, {
      value,
      expiry,
      lastAccessed: now
    });

    return true;
  }

  /**
   * 獲取快取項目
   * @param key 快取鍵
   * @returns 快取值，如果不存在或已過期則返回 null
   */
  get(key: string): T | null {
    // 每次操作增加計數器，定期執行清理
    this.operationCount++;
    if (this.operationCount >= this.options.cleanupThreshold) {
      this.cleanup();
      this.operationCount = 0;
    }
    
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // 檢查是否過期
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    // 更新最後訪問時間（用於 LRU）
    item.lastAccessed = Date.now();
    return item.value;
  }

  /**
   * 檢查快取項目是否存在且未過期
   * @param key 快取鍵
   * @returns 是否存在且有效
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // 檢查是否過期
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * 刪除快取項目
   * @param key 快取鍵
   * @returns 是否成功刪除
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * 清空所有快取
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 獲取所有有效的快取鍵
   * @returns 快取鍵數組
   */
  keys(): string[] {
    const now = Date.now();
    const validKeys: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (!item.expiry || item.expiry > now) {
        validKeys.push(key);
      }
    }

    return validKeys;
  }

  /**
   * 獲取快取項目數量
   * @returns 項目數量
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * 清理過期項目
   */
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry && item.expiry < now) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 根據 LRU 策略清除最早訪問的項目
   * @private
   */
  private evictLRU(): void {
    let oldest: string | null = null;
    let oldestTime = Date.now();

    // 找到最早訪問的項目
    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldest = key;
        oldestTime = item.lastAccessed;
      }
    }

    // 刪除最早訪問的項目
    if (oldest) {
      this.cache.delete(oldest);
    }
  }

  /**
   * 關閉快取，清理資源
   */
  shutdown(): void {
    // 清理快取
    this.clear();
  }
}

/**
 * 建立快取鍵，可將多個參數合併為單一鍵
 * @param parts 要合併的鍵部分
 * @returns 合併後的快取鍵
 */
export function createCacheKey(...parts: (string | number | boolean | object)[]): string {
  return parts.map(part => {
    if (part === null || part === undefined) {
      return '';
    } else if (typeof part === 'object') {
      return JSON.stringify(part);
    } else {
      return String(part);
    }
  }).join(':');
}

// 匯出共享快取實例
export const globalCache = new MemoryCache<any>();
