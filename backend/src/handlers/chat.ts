import { Env } from '../index';
import { corsHeaders, getCorsHeadersForRequest } from '../utils/cors';
import { verifyAuth } from '../middlewares/auth';
import type { ChatMessage, ChatCompletionOptions, GroqChatResponse } from './../types/chat';

/**
 * 處理聊天請求
 * @param request 請求對象
 * @param env 環境變數
 * @returns 回應對象
 */
export async function handleChat(request: Request, env: Env): Promise<Response> {
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
    const data = await request.json() as ChatCompletionOptions;
    
    // 檢查必要參數
    if (!data.messages || !Array.isArray(data.messages) || data.messages.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: { message: '缺少聊天訊息' } 
      }), { 
        status: 400, 
        headers 
      });
    }
    
    // 調用 Groq API
    const groqResponse = await callGroqApi(data, env);
    
    // 返回成功回應
    return new Response(JSON.stringify({
      success: true,
      data: groqResponse
    }), { 
      status: 200, 
      headers 
    });
    
  } catch (error) {
    console.error('聊天處理錯誤:', error);
    
    // 返回錯誤回應
    return new Response(JSON.stringify({
      success: false,
      error: {
        message: error instanceof Error ? error.message : '處理聊天請求時發生錯誤'
      }
    }), { 
      status: 500, 
      headers 
    });
  }
}

/**
 * 調用 Groq API 
 * @param options 聊天完成選項
 * @param env 環境變數
 * @returns Groq API 回應
 */
async function callGroqApi(
  { messages, model = 'llama-3.1-8b-instant', temperature = 0.7, maxTokens = 2048 }: ChatCompletionOptions,
  env: Env
): Promise<GroqChatResponse> {
  try {
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    
    // 檢查 API 金鑰
    if (!env.GROQ_API_KEY) {
      throw new Error('未設定 Groq API 金鑰');
    }
    
    // 發送請求到 Groq API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens
      })
    });
    
    // 檢查回應狀態
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API 錯誤: ${JSON.stringify(errorData)}`);
    }
    
    // 返回 Groq API 回應
    return await response.json() as GroqChatResponse;
    
  } catch (error) {
    console.error('Groq API 請求錯誤:', error);
    throw error;
  }
} 