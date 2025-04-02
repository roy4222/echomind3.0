/**
 * 導入處理程序模組
 */
import { handleUpload } from './handlers/upload';
import { handleChat } from './handlers/chat';
import { handleFaq } from './handlers/faq';
import { handleVectorSearch } from './handlers/vector-search';
import { corsHeaders, handleCors, getCorsHeadersForRequest } from './utils/cors';
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
    console.log(`🔵 [${requestId}] 接收請求:`, {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('User-Agent'),
      origin: request.headers.get('Origin'),
      referer: request.headers.get('Referer'),
      contentType: request.headers.get('Content-Type'),
      timestamp: new Date().toISOString()
    });
    
    try {
      // 處理 CORS 預檢請求 (OPTIONS 方法)
      if (request.method === 'OPTIONS') {
        console.log(`⚪ [${requestId}] CORS 預檢請求`);
        return handleCors(request);
      }

      // 解析 URL 以確定要使用的路由
      const url = new URL(request.url);
      console.log(`🔍 [${requestId}] 路由分發: ${url.pathname}`);
      
      // 路由分發邏輯 - 根據路徑將請求導向不同的處理程序
      let response: Response;
      
      if (url.pathname === '/api/chat') {
        // 處理聊天 API 請求
        console.log(`💬 [${requestId}] 處理聊天請求`);
        response = await handleChat(request, env);
      }
      else if (url.pathname === '/api/faq') {
        // 處理常見問題 API 請求
        console.log(`❓ [${requestId}] 處理 FAQ 請求`);
        response = await handleFaq(request, env);
      }
      else if (url.pathname === '/api/upload') {
        // 處理檔案上傳 API 請求
        console.log(`📤 [${requestId}] 處理上傳請求`);
        response = await handleUpload(request, env);
      }
      // 處理替代上傳路徑
      else if (url.pathname === '/upload') {
        console.log(`📤 [${requestId}] 處理上傳請求 (直接路徑)`);
        response = await handleUpload(request, env);
      }
      // 處理向量搜索 API 請求
      else if (url.pathname === '/api/vector-search') {
        console.log(`🔍 [${requestId}] 處理向量搜索請求`);
        response = await handleVectorSearch(request, env);
      }
      // 健康檢查端點 - 用於監控系統狀態
      else if (url.pathname === '/api/health') {
        console.log(`💓 [${requestId}] 健康檢查`);
        response = new Response(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: {
            ...getCorsHeadersForRequest(request),
            'Content-Type': 'application/json'
          }
        });
      }
      // 處理未找到的路由
      else {
        console.log(`⚠️ [${requestId}] 未找到路由: ${url.pathname}`);
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
      console.log(`🟢 [${requestId}] 請求完成: ${newResponse.status}, 耗時 ${processingTime}ms`);
      
      return newResponse;
    } catch (error) {
      // 錯誤處理邏輯 - 捕獲並記錄所有未處理的異常
      const processingTime = Date.now() - startTime;
      console.error(`🔴 [${requestId}] API 處理錯誤 (${processingTime}ms):`, error);
      console.error('錯誤詳情:', error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : '未知錯誤類型');
      
      // 返回標準化的錯誤響應
      return new Response(JSON.stringify({
        error: error instanceof Error ? error.message : '伺服器內部錯誤',
        requestId: requestId  // 包含請求 ID 以便追蹤
      }), { 
        status: 500,
        headers: {
          ...getCorsHeadersForRequest(request),
          'Content-Type': 'application/json'
        }
      });
    }
  }
}; 