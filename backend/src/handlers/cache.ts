/**
 * 快取管理處理器
 * 用於查看和控制系統快取
 */
import { Env } from '../index';
import { globalCache } from '../utils/cache';
import { createPineconeClient } from '../services/vector';
import { GroqService } from '../services/groq';
import { createRequestHandler, createResponse } from '../utils/requestHandler';

/**
 * 清除所有快取
 * @param request 請求對象
 * @param env 環境變數
 * @returns 回應對象
 */
export const clearAllCaches = createRequestHandler(
  async (request: Request, env: Env): Promise<Response> => {
    // 清除全局快取
    const globalCacheSize = globalCache.size();
    globalCache.clear();
    
    // 檢查必要的環境變數
    if (!env.PINECONE_API_KEY || !env.PINECONE_ENVIRONMENT || !env.PINECONE_INDEX) {
      return createResponse({
        success: true,
        message: '部分快取已清除，Pinecone 配置不完整',
        stats: {
          globalCache: globalCacheSize,
          totalCleared: globalCacheSize
        }
      });
    }
    
    // 初始化服務以便清除其快取
    const pinecone = createPineconeClient(env);
    
    const groq = new GroqService(env);
    
    // 清除各服務的快取
    const pineconeCleared = pinecone.clearQueryCache();
    const groqCleared = groq.clearResponseCache();
    
    // 返回清除結果
    return createResponse({
      success: true,
      message: '所有快取已清除',
      stats: {
        globalCache: globalCacheSize,
        pineconeCache: pineconeCleared,
        groqCache: groqCleared,
        totalCleared: globalCacheSize + pineconeCleared + groqCleared
      }
    });
  }
);

/**
 * 獲取快取統計資訊
 * @param request 請求對象
 * @param env 環境變數
 * @returns 回應對象
 */
export const getCacheStats = createRequestHandler(
  async (request: Request, env: Env): Promise<Response> => {
    // 獲取全局快取統計資訊
    const globalCacheSize = globalCache.size();
    const globalCacheKeys = globalCache.keys();
    
    // 準備回應數據
    const stats: any = {
      globalCache: {
        size: globalCacheSize,
        keys: globalCacheKeys.slice(0, 20) // 只顯示前 20 個鍵以防止過大回應
      },
      totalSize: globalCacheSize
    };
    
    // 檢查是否可以獲取 Pinecone 統計資訊
    if (env.PINECONE_API_KEY && env.PINECONE_ENVIRONMENT && env.PINECONE_INDEX) {
      // 初始化服務以獲取快取統計資訊
      const pinecone = createPineconeClient(env);
      
      // 獲取 Pinecone 快取統計資訊
      stats.pineconeCache = pinecone.getCacheStats();
    } else {
      stats.pineconeCache = { status: 'unconfigured' };
    }
    
    // 檢查是否可以獲取 Groq 統計資訊
    if (env.GROQ_API_KEY) {
      const groq = new GroqService(env);
      stats.groqCache = groq.getCacheStats();
    } else {
      stats.groqCache = { status: 'unconfigured' };
    }
    
    // 返回快取統計資訊
    return createResponse(stats);
  }
);
