/**
 * 引入聊天相關的型別定義
 */
import type { ChatMessage, ChatCompletionOptions, ChatResponse, GroqChatResponse } from '@/lib/types/chat';

/**
 * Groq 服務類別
 * 用於處理與 Groq API 的通訊
 */
class GroqService {
  /** 預設使用的語言模型 */
  private defaultModel: string = 'llama-3.1-8b-instant';

  /**
   * 發送聊天請求到 Groq API
   * @param options - 聊天配置選項
   * @param options.messages - 聊天訊息歷史
   * @param options.model - 使用的語言模型，預設為 llama-3.1-8b-instant
   * @param options.temperature - 溫度參數，控制回應的隨機性，預設為 0.7
   * @param options.maxTokens - 最大生成的 token 數量，預設為 2048
   * @param options.stream - 是否使用串流回應，預設為 false
   * @returns 回傳 API 的回應資料
   */
  async chat({
    messages,
    model = this.defaultModel,
    temperature = 0.7,
    maxTokens = 2048,
    stream = false,
  }: ChatCompletionOptions): Promise<GroqChatResponse> {
    try {
      try {
        // 嘗試發送 POST 請求到 API 端點
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages,
            model,
            temperature,
            maxTokens,
            stream,
          }),
        });

        // 檢查回應狀態
        if (!response.ok) {
          throw new Error('API 請求失敗');
        }

        // 解析回應資料
        const data = await response.json() as ChatResponse;
        
        // 檢查 API 回應是否成功
        if (!data.success) {
          throw new Error(data.error?.message || 'API 請求失敗');
        }

        return data.data as GroqChatResponse;
      } catch (apiError) {
        console.error('API 請求失敗，使用模擬回應。', apiError);
        
        // 使用模擬回應作為回退方案
        return this.getMockResponse(messages);
      }
    } catch (error) {
      console.error('聊天請求錯誤:', error);
      throw error;
    }
  }

  /**
   * 生成模擬回應
   * @param messages 使用者訊息
   * @returns 模擬的API回應
   */
  private getMockResponse(messages: ChatMessage[]): GroqChatResponse {
    // 獲取最後一條使用者訊息
    const lastUserMessage = messages[messages.length - 1].content || '';
    
    // 生成簡單的回應
    return {
      id: 'mock-' + Date.now(),
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: this.defaultModel,
      choices: [
        {
          message: {
            role: 'assistant',
            content: `您好！我是您的AI助手。我們目前正在離線模式，無法連線到API服務。您的訊息是：「${lastUserMessage}」，但我暫時無法提供完整的回答。請稍後再試，或確認網路連接正常。`,
          },
          index: 0,
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };
  }

  /**
   * 使用串流模式發送聊天請求
   * @param options - 聊天配置選項
   * @returns 回傳串流模式的聊天回應
   */
  async streamChat(options: ChatCompletionOptions) {
    return this.chat({ ...options, stream: true });
  }
}

// 建立單例實例
export const groqService = new GroqService();
