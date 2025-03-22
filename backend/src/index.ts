import { handleUpload } from './handlers/upload';
import { handleChat } from './handlers/chat';
import { handleFaq } from './handlers/faq';
import { corsHeaders, handleCors, getCorsHeadersForRequest } from './utils/cors';
import type { ExecutionContext } from '@cloudflare/workers-types';

// 定義環境變數類型
export interface Env {
  // Pinecone 相關
  PINECONE_API_KEY: string;
  PINECONE_ENVIRONMENT: string;
  PINECONE_INDEX: string;
  
  // Groq 相關
  GROQ_API_KEY: string;
  
  // R2 相關
  R2_API_ENDPOINT: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET: string;
  R2_ENDPOINT: string;
  
  // Firebase 相關
  FIREBASE_PROJECT_ID: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_PRIVATE_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 記錄請求基本資訊
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
      // 處理 CORS 預檢請求
      if (request.method === 'OPTIONS') {
        console.log(`⚪ [${requestId}] CORS 預檢請求`);
        return handleCors(request);
      }

      const url = new URL(request.url);
      console.log(`🔍 [${requestId}] 路由分發: ${url.pathname}`);
      
      // 路由分發
      let response: Response;
      
      if (url.pathname === '/api/chat') {
        console.log(`💬 [${requestId}] 處理聊天請求`);
        response = await handleChat(request, env);
      }
      else if (url.pathname === '/api/faq') {
        console.log(`❓ [${requestId}] 處理 FAQ 請求`);
        response = await handleFaq(request, env);
      }
      else if (url.pathname === '/api/upload') {
        console.log(`📤 [${requestId}] 處理上傳請求`);
        response = await handleUpload(request, env);
      }
      // 健康檢查端點
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
      // 未找到路由
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
      
      // 記錄處理時間
      const processingTime = Date.now() - startTime;
      console.log(`🟢 [${requestId}] 請求完成: ${response.status}, 耗時 ${processingTime}ms`);
      
      return response;
    } catch (error) {
      // 錯誤處理
      const processingTime = Date.now() - startTime;
      console.error(`🔴 [${requestId}] API 處理錯誤 (${processingTime}ms):`, error);
      console.error('錯誤詳情:', error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : '未知錯誤類型');
      
      return new Response(JSON.stringify({
        error: error instanceof Error ? error.message : '伺服器內部錯誤',
        requestId: requestId
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