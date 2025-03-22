import { Env } from '../index';
import { corsHeaders, getCorsHeadersForRequest } from '../utils/cors';
import { verifyAuth } from '../middlewares/auth';
import type { ChatMessage, ChatCompletionOptions, GroqChatResponse } from './../types/chat';

/**
 * 系統提示詞設定
 * 定義 AI 助手的角色和行為準則
 */
const SYSTEM_PROMPT: ChatMessage = {
  role: 'system',
  content: `你是輔仁大學資訊管理學系的 AI 助手，名叫 EchoMind。
  - 使用繁體中文回答
  - 回答要簡潔但專業
  - 對學生要友善有耐心
  - 不確定的事情要誠實說不知道
  - 需要時可以使用 Markdown 格式美化回答
  - 專注於資管相關的學術、課程、就業諮詢
  - 避免討論政治、宗教等敏感話題`
};

/**
 * 預設配置參數
 */
const DEFAULT_MODEL = 'llama-3.1-8b-instant';  // 預設使用的語言模型
const DEFAULT_TEMPERATURE = 0.7;                // 預設的溫度參數
const DEFAULT_MAX_TOKENS = 2048;               // 預設的最大 token 數

/**
 * 處理聊天請求
 * @param request 請求對象
 * @param env 環境變數
 * @returns 回應對象
 */
export async function handleChat(request: Request, env: Env): Promise<Response> {
  console.log('=== 收到聊天請求 ===');
  console.log('請求 URL:', request.url);
  console.log('請求方法:', request.method);
  console.log('請求來源:', request.headers.get('Origin'));
  console.log('Worker 環境變數檢查:', {
    hasGroqApiKey: !!env.GROQ_API_KEY,
    apiKeyLength: env.GROQ_API_KEY ? env.GROQ_API_KEY.length : 0,
  });
  
  // 添加 CORS 標頭
  const headers = { ...getCorsHeadersForRequest(request), 'Content-Type': 'application/json' };
  
  try {
    // 驗證請求方法
    if (request.method !== 'POST') {
      console.log('❌ 請求失敗: 方法不允許 -', request.method);
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
    console.log('📝 請求內容摘要:', {
      messagesCount: data.messages?.length || 0,
      requestedModel: data.model || DEFAULT_MODEL,
      temperature: data.temperature || DEFAULT_TEMPERATURE,
      maxTokens: data.maxTokens || DEFAULT_MAX_TOKENS,
      firstUserMessage: data.messages?.[0]?.content?.substring(0, 50) + '...' || '無內容'
    });
    
    // 檢查必要參數
    if (!data.messages || !Array.isArray(data.messages) || data.messages.length === 0) {
      console.log('❌ 請求失敗: 缺少聊天訊息');
      return new Response(JSON.stringify({ 
        success: false, 
        error: { message: '缺少聊天訊息' } 
      }), { 
        status: 400, 
        headers 
      });
    }
    
    console.log('🔄 開始調用 Groq API...');
    // 調用 Groq API
    const groqResponse = await callGroqApi(data, env);
    
    console.log('✅ Groq API 調用成功');
    console.log('回應摘要:', {
      model: groqResponse.model,
      totalTokens: groqResponse.usage?.total_tokens || 0,
      responseTime: new Date().toISOString(), // 使用當前時間代替
      firstResponseWords: groqResponse.choices[0]?.message?.content?.substring(0, 50) + '...' || '無內容'
    });
    
    // 返回成功回應
    return new Response(JSON.stringify({
      success: true,
      data: groqResponse
    }), { 
      status: 200, 
      headers 
    });
    
  } catch (error) {
    console.error('❌ 聊天處理錯誤:', error);
    console.error('錯誤詳情:', error instanceof Error ? {
      message: error.message,
      stack: error.stack
    } : '未知錯誤類型');
    
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
  { messages, model = DEFAULT_MODEL, temperature = DEFAULT_TEMPERATURE, maxTokens = DEFAULT_MAX_TOKENS }: ChatCompletionOptions,
  env: Env
): Promise<GroqChatResponse> {
  try {
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    
    console.log('📊 Groq API 請求詳情:', {
      model: model,
      messagesCount: messages.length,
      temperature: temperature,
      maxTokens: maxTokens
    });
    
    // 檢查 API 金鑰
    if (!env.GROQ_API_KEY) {
      console.error('❌ 缺少 Groq API 金鑰');
      throw new Error('未設定 Groq API 金鑰');
    }
    
    // 在訊息開頭加入系統提示詞
    const messagesWithSystemPrompt = [SYSTEM_PROMPT, ...messages];
    console.log('🔄 添加系統提示詞，最終訊息數量:', messagesWithSystemPrompt.length);
    
    // 發送請求到 Groq API
    console.log('🌐 發送請求到 Groq API...');
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: messagesWithSystemPrompt,
        temperature,
        max_tokens: maxTokens
      })
    });
    const endTime = Date.now();
    console.log(`⏱️ Groq API 請求耗時: ${endTime - startTime}ms`);
    
    // 檢查回應狀態
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Groq API 回應錯誤:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      throw new Error(`Groq API 錯誤: ${JSON.stringify(errorData)}`);
    }
    
    // 解析回應
    const responseData = await response.json() as GroqChatResponse;
    console.log('✅ Groq API 回應成功:', {
      model: responseData.model,
      usage: responseData.usage,
      responseCharCount: responseData.choices[0]?.message?.content?.length || 0
    });
    
    // 返回 Groq API 回應
    return responseData;
    
  } catch (error) {
    console.error('❌ Groq API 請求錯誤:', error);
    console.error('錯誤詳情:', error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : '未知錯誤類型');
    throw error;
  }
} 