import { Env } from '../index';
import { corsHeaders, getCorsHeadersForRequest } from '../utils/cors';
import { PineconeClient } from '../services/pinecone';
import type { FaqSearchResult } from './../types/chat';

/**
 * 處理 FAQ 查詢請求
 * @param request 請求對象
 * @param env 環境變數
 * @returns 回應對象
 */
export async function handleFaq(request: Request, env: Env): Promise<Response> {
  // 添加 CORS 標頭
  const headers = { ...getCorsHeadersForRequest(request), 'Content-Type': 'application/json' };
  
  try {
    // 驗證請求方法
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: { message: '方法不允許' } 
      }), { 
        status: 405, 
        headers 
      });
    }
    
    // 解析請求數據
    const { query, limit = 5, threshold = 0.75 } = await request.json() as {
      query: string;
      limit?: number;
      threshold?: number;
    };
    
    // 檢查必要參數
    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: { message: '請提供有效的查詢' } 
      }), { 
        status: 400, 
        headers 
      });
    }
    
    // 創建 Pinecone 客戶端
    const pinecone = new PineconeClient(
      env.PINECONE_API_KEY,
      env.PINECONE_ENVIRONMENT,
      env.PINECONE_INDEX
    );
    
    // 調用 Pinecone 進行 FAQ 檢索
    const results = await pinecone.searchFaqs(query, limit, threshold);
    
    // 返回成功回應
    return new Response(JSON.stringify({
      success: true,
      results
    }), { 
      status: 200, 
      headers 
    });
    
  } catch (error) {
    console.error('FAQ 查詢處理錯誤:', error);
    
    // 返回錯誤回應
    return new Response(JSON.stringify({
      success: false,
      error: {
        message: error instanceof Error ? error.message : '處理 FAQ 查詢時發生錯誤'
      }
    }), { 
      status: 500, 
      headers 
    });
  }
} 