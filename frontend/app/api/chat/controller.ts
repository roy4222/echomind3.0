/**
 * 聊天 API 控制器
 * 處理與 Groq API 的溝通和聊天完成請求
 */

import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { ChatMessage, ChatCompletionOptions, ChatResponse } from '@/lib/types/chat';

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
 * 初始化 Groq API 客戶端，若環境變數不存在則不初始化
 */
let groq: Groq | null = null;
try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  } else {
    console.warn('未設置 GROQ_API_KEY 環境變數，API 將使用模擬響應');
  }
} catch (error) {
  console.error('初始化 Groq API 客戶端失敗:', error);
}

/**
 * 處理聊天完成請求的主要函數
 * @param request - HTTP 請求物件
 * @returns 回應物件，包含成功或錯誤資訊
 */
export async function handleChatCompletion(request: Request) {
  try {
    // 解析請求內容
    const body = await request.json() as ChatCompletionOptions;
    const { messages, model, temperature, maxTokens, stream } = body;

    // 驗證必要參數
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json<ChatResponse>(
        { 
          success: false,
          error: {
            message: '無效的訊息格式',
            code: 'INVALID_FORMAT'
          }
        },
        { status: 400 }
      );
    }

    // 檢查 API 金鑰是否設置
    if (!groq) {
      console.warn('使用模擬響應替代 Groq API');
      
      // 建立模擬響應
      const mockResponse = {
        id: 'mock-response-id',
        object: 'chat.completion',
        created: Date.now(),
        model: model || DEFAULT_MODEL,
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: `這是一個模擬回應。實際部署時，請確保設置了 GROQ_API_KEY 環境變數。\n\n您的問題是：${messages[messages.length - 1]?.content || '未提供問題'}`
            },
            logprobs: null,
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: 100,
          completion_tokens: 150,
          total_tokens: 250
        }
      };
      
      // 回傳模擬結果
      return NextResponse.json<ChatResponse>({
        success: true,
        data: mockResponse,
      });
    }
    
    // 記錄環境信息（不包含敏感數據）
    console.log('Groq API 狀態:', { 
      hasKey: !!process.env.GROQ_API_KEY,
      environment: process.env.NODE_ENV
    });

    // 在訊息開頭加入系統提示詞
    const messagesWithSystemPrompt = [SYSTEM_PROMPT, ...messages];

    // 建立聊天完成請求
    const completion = await groq.chat.completions.create({
      messages: messagesWithSystemPrompt,
      model: model || DEFAULT_MODEL,
      temperature: temperature || DEFAULT_TEMPERATURE,
      max_tokens: maxTokens || DEFAULT_MAX_TOKENS,
      stream: stream || false,
    });

    // 回傳成功結果
    return NextResponse.json<ChatResponse>({
      success: true,
      data: completion,
    });

  } catch (error: unknown) {
    // 錯誤處理
    console.error('Groq API 錯誤:', error);
    
    const errorMessage = error instanceof Error ? error.message : '處理請求時發生錯誤';
    const errorCode = (error as Record<string, string>).code || 'UNKNOWN_ERROR';
    const errorStatus = (error as Record<string, number>).status || 500;

    return NextResponse.json<ChatResponse>(
      {
        success: false,
        error: {
          message: errorMessage,
          code: errorCode,
        },
      },
      { status: errorStatus }
    );
  }
} 