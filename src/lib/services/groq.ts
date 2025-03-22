/**
 * 引入聊天相關的型別定義
 */
import type { ChatCompletionOptions, ChatResponse, GroqChatResponse } from '@/lib/types/chat';

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
      // 發送 POST 請求到 API 端點
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
    } catch (error) {
      console.error('聊天請求錯誤:', error);
      throw error;
    }
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
