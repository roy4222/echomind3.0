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
    // 處理 CORS 預檢請求
    if (request.method === 'OPTIONS') {
      return handleCors(request);
    }

    const url = new URL(request.url);
    
    // 路由分發
    try {
      if (url.pathname === '/api/chat') {
        return handleChat(request, env);
      }
      
      if (url.pathname === '/api/faq') {
        return handleFaq(request, env);
      }
      
      if (url.pathname === '/api/upload') {
        return handleUpload(request, env);
      }

      // 健康檢查端點
      if (url.pathname === '/api/health') {
        return new Response(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: {
            ...getCorsHeadersForRequest(request),
            'Content-Type': 'application/json'
          }
        });
      }

      // 未找到路由
      return new Response(JSON.stringify({ error: '路徑不存在' }), { 
        status: 404,
        headers: {
          ...getCorsHeadersForRequest(request),
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      // 錯誤處理
      console.error('API 錯誤:', error);
      return new Response(JSON.stringify({
        error: error instanceof Error ? error.message : '伺服器內部錯誤'
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