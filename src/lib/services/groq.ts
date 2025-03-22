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
    
    // 簡單的關鍵詞回應機制
    let responseContent = '';
    
    if (lastUserMessage.includes('你好') || lastUserMessage.includes('嗨') || lastUserMessage.includes('哈囉')) {
      responseContent = '您好！很高興為您服務。我是輔仁大學資管系的AI助手EchoMind。有什麼我能幫助您的嗎？';
    } else if (lastUserMessage.includes('課程') || lastUserMessage.includes('學習') || lastUserMessage.includes('教學')) {
      responseContent = '輔仁大學資管系提供多樣化的課程，包括程式設計、資料庫管理、網路應用等。如果您有特定課程的問題，可以告訴我更多細節。';
    } else if (lastUserMessage.includes('專題') || lastUserMessage.includes('專案') || lastUserMessage.includes('project')) {
      responseContent = '資管系的專題是培養實務能力的重要環節。學生通常會在大三或大四時，組隊完成一個與資訊管理相關的專案，從需求分析、設計到實作都需要參與。';
    } else if (lastUserMessage.includes('就業') || lastUserMessage.includes('工作') || lastUserMessage.includes('職涯')) {
      responseContent = '資管系畢業生有多元的就業方向，包括：系統分析師、程式開發、資料分析師、專案管理、數位行銷等。根據近年調查，本系畢業生就業率相當高。';
    } else if (lastUserMessage.includes('老師') || lastUserMessage.includes('教授') || lastUserMessage.includes('師資')) {
      responseContent = '輔仁大學資管系擁有優秀的師資陣容，包括多位專精於不同領域的教授，如資料科學、人工智慧、電子商務、資訊安全等方面的專家。';
    } else {
      // 預設回應
      responseContent = `您好！我目前無法連線到API服務。您的訊息是：「${lastUserMessage}」，但我暫時無法提供完整的回答。若您有關於輔仁大學資管系的問題，可以用更具體的方式詢問，或者稍後再試。`;
    }
    
    // 生成回應
    return {
      id: 'mock-' + Date.now(),
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: this.defaultModel,
      choices: [
        {
          message: {
            role: 'assistant',
            content: responseContent,
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
