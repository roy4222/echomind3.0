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
 * 模型參數映射表
 * 提供不同模型的配置參數和顯示名稱
 */
const MODEL_MAPPING = {
  default: {
    name: 'llama-3.1-8b-instant',
    displayName: 'Llama 3.1 8B Instant',
    temperature: 0.7,
    maxTokens: 2048
  },
  advanced: {
    name: 'deepseek-r1-distill-llama-70b',
    displayName: 'Deepseek R1 Distill Llama 70B',
    temperature: 0.5,
    maxTokens: 4096
  },
  creative: {
    name: 'qwen-2.5-32b',
    displayName: 'Qwen 2.5 32B',
    temperature: 0.9,
    maxTokens: 3072
  },
  maverick: {
    name: 'meta-llama/llama-4-maverick-17b-128e-instruct',
    displayName: 'Llama 4 Maverick 17B',
    temperature: 0.7,
    maxTokens: 4096
  }
};

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
  { messages, model = DEFAULT_MODEL, temperature = DEFAULT_TEMPERATURE, maxTokens = DEFAULT_MAX_TOKENS, image }: ChatCompletionOptions,
  env: Env
): Promise<GroqChatResponse> {
  try {
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    
    // 根據前端選擇的模型 ID 映射到實際模型名稱和參數
    let actualModel = DEFAULT_MODEL;
    let actualTemperature = temperature;
    let actualMaxTokens = maxTokens;
    let modelDisplayName = '預設模型';
    
    // 使用映射表處理模型選擇
    if (model in MODEL_MAPPING) {
      const modelConfig = MODEL_MAPPING[model as keyof typeof MODEL_MAPPING];
      actualModel = modelConfig.name;
      modelDisplayName = modelConfig.displayName;
      
      // 如果沒有明確傳入溫度和最大 tokens，則使用對應模型的建議值
      if (temperature === DEFAULT_TEMPERATURE) {
        actualTemperature = modelConfig.temperature;
      }
      if (maxTokens === DEFAULT_MAX_TOKENS) {
        actualMaxTokens = modelConfig.maxTokens;
      }
      
      console.log(`🔄 切換到模型: ${modelDisplayName} (ID: ${model})`);
      console.log(`📝 模型參數: 溫度=${actualTemperature}, 最大Tokens=${actualMaxTokens}`);
    } else if (model.includes('llama') || model.includes('deepseek') || model.includes('qwen')) {
      // 如果傳入的是完整模型名稱，直接使用
      actualModel = model;
      modelDisplayName = model;
      console.log(`🔄 使用直接指定的模型: ${model}`);
    } else {
      console.log(`⚠️ 未知模型 ID: ${model}，使用預設模型: ${DEFAULT_MODEL}`);
    }
    
    console.log('📊 Groq API 請求詳情:', {
      modelId: model,
      actualModel: actualModel,
      modelName: modelDisplayName,
      messagesCount: messages.length,
      temperature: actualTemperature,
      maxTokens: actualMaxTokens,
      hasImage: !!image
    });
    
    // 檢查 API 金鑰
    if (!env.GROQ_API_KEY) {
      console.error('❌ 缺少 Groq API 金鑰');
      throw new Error('未設定 Groq API 金鑰');
    }
    
    // 在訊息開頭加入系統提示詞
    const messagesWithSystemPrompt = [SYSTEM_PROMPT, ...messages];
    console.log('🔄 添加系統提示詞，最終訊息數量:', messagesWithSystemPrompt.length);
    
    // 準備請求體
    const requestBody: any = {
      model: actualModel,  // 使用映射後的模型名稱
      messages: messagesWithSystemPrompt,
      temperature: actualTemperature,
      max_tokens: actualMaxTokens
    };

    // 如果是 maverick 模型且有圖片，添加圖片到請求中
    if (model === 'maverick' && image) {
      console.log('🖼️ 檢測到圖片上傳，添加到 maverick 模型請求中');
      
      // 修改最後一條用戶訊息，添加圖片
      const lastUserMessageIndex = requestBody.messages.findIndex(
        (msg: ChatMessage) => msg.role === 'user'
      );
      
      if (lastUserMessageIndex !== -1) {
        const lastUserMessage = requestBody.messages[lastUserMessageIndex];
        
        // 將最後一條用戶訊息轉換為多模態格式
        requestBody.messages[lastUserMessageIndex] = {
          role: 'user',
          content: [
            { type: 'text', text: lastUserMessage.content },
            { 
              type: 'image_url', 
              image_url: {
                url: image
              }
            }
          ]
        };
        
        console.log('✅ 已將圖片添加到用戶訊息中');
      } else {
        console.log('⚠️ 未找到用戶訊息，無法添加圖片');
      }
    }
    
    // 發送請求到 Groq API
    console.log(`🌐 發送請求到 Groq API (模型: ${modelDisplayName})...`);
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.GROQ_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
    const endTime = Date.now();
    console.log(`⏱️ Groq API 請求耗時: ${endTime - startTime}ms (模型: ${modelDisplayName})`);
    
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
    console.log(`✅ 模型 ${modelDisplayName} 回應成功:`, {
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