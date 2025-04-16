/**
 * 導入處理程序模組
 */
import { handleUpload } from './handlers/upload';
import { handleChat } from './handlers/chat';
import { handleFaq } from './handlers/faq';
import { corsHeaders, handleCors, getCorsHeadersForRequest } from './utils/cors';
import { createEnvironmentManager } from './utils/environment';
import { handleError } from './utils/errorHandler';
import { logger, apiLogger, LogLevel } from './utils/logger';
import type { ExecutionContext } from '@cloudflare/workers-types';

/**
 * 環境變數接口定義
 * 包含所有需要的API金鑰和配置參數
 */
export interface Env {
  // Pinecone 配置 - 用於向量資料庫
  PINECONE_API_KEY: string;        // Pinecone API 金鑰
  PINECONE_ENVIRONMENT: string;    // Pinecone 環境名稱
  PINECONE_INDEX?: string;         // 可選的索引名稱
  PINECONE_INDEX_NAME?: string;    // 可選的索引名稱 (替代方案)
  PINECONE_API_URL?: string;       // 可選的 API URL
  
  // Cohere 配置 - 用於文本嵌入
  COHERE_API_KEY: string;          // Cohere API 金鑰
  
  // Groq 相關 - 用於 AI 模型推理
  GROQ_API_KEY: string;            // Groq API 金鑰
  
  // R2 相關 - Cloudflare 的物件儲存服務
  R2_API_ENDPOINT: string;         // R2 API 端點
  R2_ACCESS_KEY_ID: string;        // R2 存取金鑰 ID
  R2_SECRET_ACCESS_KEY: string;    // R2 秘密存取金鑰
  R2_BUCKET: string;               // R2 儲存桶名稱
  R2_ENDPOINT: string;             // R2 端點 URL
  
  // Firebase 配置 - 用於資料庫和認證
  FIREBASE_PROJECT_ID: string;     // Firebase 專案 ID
  FIREBASE_CLIENT_EMAIL: string;   // Firebase 客戶端電子郵件
  FIREBASE_PRIVATE_KEY: string;    // Firebase 私鑰
  
  // 新增 Python API 配置 (可選) - 用於外部 Python 服務
  PYTHON_API_URL?: string;         // Python API 的 URL
}

/**
 * Cloudflare Worker 主入口點
 * 處理所有進入的 HTTP 請求並路由到適當的處理程序
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 記錄請求基本資訊，用於監控和除錯
    const startTime = Date.now();
    const requestId = crypto.randomUUID();
    const requestLogger = apiLogger.forRequest(requestId);
    
    // 記錄請求開始
    requestLogger.logRequestStart(request);
    
    try {
      // 建立環境變數管理器並驗證關鍵環境變數
      const envManager = createEnvironmentManager(env);
      
      // 處理 CORS 預檢請求 (OPTIONS 方法)
      if (request.method === 'OPTIONS') {
        requestLogger.debug('CORS 預檢請求');
        return handleCors(request);
      }

      // 解析 URL 以確定要使用的路由
      const url = new URL(request.url);
      requestLogger.info(`路由分發: ${url.pathname}`);
      
      // 路由分發邏輯 - 根據路徑將請求導向不同的處理程序
      let response: Response;
      
      if (url.pathname === '/api/chat') {
        // 驗證 Groq 環境變數
        envManager.validateGroq();
        
        // 處理聊天 API 請求
        requestLogger.info('處理聊天請求');
        response = await handleChat(request, env);
      }
      else if (url.pathname === '/api/faq') {
        // 驗證 Pinecone 和 Cohere 環境變數
        envManager.validatePinecone();
        envManager.validateCohere();
        
        // 處理常見問題 API 請求
        requestLogger.info('處理 FAQ 請求');
        response = await handleFaq(request, env);
      }
      else if (url.pathname === '/api/upload') {
        // 驗證 R2 環境變數
        envManager.validateR2();
        
        // 處理檔案上傳 API 請求
        requestLogger.info('處理上傳請求');
        response = await handleUpload(request, env);
      }
      // 健康檢查端點 - 用於監控系統狀態
      else if (url.pathname === '/api/health') {
        requestLogger.info('健康檢查');
        
        // 嘗試驗證所有環境變數，但不阻止健康檢查回應
        try {
          envManager.validateAll();
          response = new Response(JSON.stringify({ 
            status: 'ok',
            environmentStatus: 'ok' 
          }), {
            status: 200,
            headers: {
              ...getCorsHeadersForRequest(request),
              'Content-Type': 'application/json'
            }
          });
        } catch (error) {
          // 如果環境變數驗證失敗，返回警告狀態
          requestLogger.warn('健康檢查環境變數驗證失敗', error);
          response = new Response(JSON.stringify({ 
            status: 'warning',
            environmentStatus: 'incomplete',
            message: error instanceof Error ? error.message : '環境變數不完整'
          }), {
            status: 200,  // 仍然返回 200，但帶有警告信息
            headers: {
              ...getCorsHeadersForRequest(request),
              'Content-Type': 'application/json'
            }
          });
        }
      }
      // 處理未找到的路由
      else {
        requestLogger.warn(`未找到路由: ${url.pathname}`);
        response = new Response(JSON.stringify({ error: '路徑不存在' }), { 
          status: 404,
          headers: {
            ...getCorsHeadersForRequest(request),
            'Content-Type': 'application/json'
          }
        });
      }
      
      // 確保所有響應都包含 CORS 頭，以支援跨域請求
      const originalHeaders = response.headers;
      const corsHeaders = getCorsHeadersForRequest(request);
      
      const newHeaders = new Headers(originalHeaders);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      
      // 使用原始響應建立新的響應，但添加 CORS 頭
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
      
      // 記錄處理時間，用於性能監控
      const processingTime = Date.now() - startTime;
      requestLogger.logRequestEnd(newResponse, processingTime);
      
      return newResponse;
    } catch (error) {
      // 使用統一的錯誤處理工具處理異常
      const processingTime = Date.now() - startTime;
      requestLogger.error(`API 處理錯誤 (${processingTime}ms)`, error);
      
      return handleError(error, request, requestId);
    }
  }
}; 