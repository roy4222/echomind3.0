/**
 * 向量搜尋相關型別定義
 */
import { Env } from '../../index';

/**
 * 向量快取配置介面
 */
export interface VectorCacheConfig {
  /** 是否啟用快取 */
  enabled: boolean;
  /** 快取存活時間 (毫秒) */
  ttl: number;
  /** 最大快取項目數量 */
  maxSize: number;
}

/**
 * FAQ 搜尋結果介面
 */
export interface FaqSearchResult {
  /** FAQ 唯一識別碼 */
  id: string;
  /** FAQ 問題 */
  question: string;
  /** FAQ 答案 */
  answer: string;
  /** FAQ 分類 */
  category?: string;
  /** FAQ 標籤 */
  tags?: string[];
  /** FAQ 重要性 */
  importance?: number;
  /** 相關性分數 */
  score: number;
  /** 原始相關性分數 */
  originalScore?: number;
  /** 文字匹配分數 */
  textMatchScore?: number;
  /** 語義相似度分數 */
  semanticScore?: number;
  /** 標籤提升因子 */
  tagBoost?: number;
  /** 其他元數據 */
  metadata?: Record<string, any>;
  /** 是否為整合結果 */
  integrated?: boolean;
  /** 整合來源 ID 列表 */
  integratedFrom?: string[];
}

/**
 * 向量項目介面
 */
export interface VectorItem {
  /** 項目唯一識別碼 */
  id: string;
  /** 項目問題 */
  question: string;
  /** 項目答案 */
  answer: string;
  /** 項目分類 */
  category?: string;
  /** 項目標籤 */
  tags?: string[];
  /** 項目重要性 */
  importance?: number;
  /** 其他元數據 */
  metadata?: Record<string, any>;
}

/**
 * Pinecone 匹配項介面
 */
export interface PineconeMatch {
  /** 匹配項 ID */
  id: string;
  /** 匹配分數 */
  score: number;
  /** 匹配項元數據 */
  metadata: Record<string, any>;
  /** 向量值 (可選) */
  values?: number[];
}

/**
 * 向量搜尋配置
 */
export interface VectorSearchConfig {
  /** 結果數量限制 */
  limit: number;
  /** 相似度閾值 */
  threshold: number;
  /** 是否啟用問題分解 */
  enableQuestionDecomposition?: boolean;
  /** 是否啟用二階段搜尋 */
  enableTwoStageSearch?: boolean;
}

/**
 * 默認向量快取配置
 */
export const DEFAULT_CACHE_CONFIG: VectorCacheConfig = {
  enabled: true,
  ttl: 30 * 60 * 1000, // 30 分鐘
  maxSize: 1000
};

/**
 * 默認向量搜尋配置
 */
export const DEFAULT_SEARCH_CONFIG: VectorSearchConfig = {
  limit: 5,
  threshold: 0.1,
  enableQuestionDecomposition: false,
  enableTwoStageSearch: false
};

/**
 * 向量客戶端配置
 */
export interface VectorClientConfig {
  /** API 金鑰 */
  apiKey: string;
  /** 環境名稱 */
  environment: string;
  /** 索引名稱 */
  indexName: string;
  /** 環境變數 */
  env?: Env;
  /** 完整 API URL (可選) */
  fullApiUrl?: string;
  /** 快取配置 */
  cacheConfig?: Partial<VectorCacheConfig>;
}
