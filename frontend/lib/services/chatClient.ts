import type { ChatMessage, ChatCompletionOptions, ChatResponse, SimpleChatResponse } from '@/lib/types/chat';

/**
 * 聊天客戶端服務
 * 處理與聊天 API 的溝通
 */
export class ChatClientService {
  /**
   * 發送聊天請求 (完整回應)
   * @param options 聊天選項
   * @returns 完整聊天回應
   */
  async chat(options: ChatCompletionOptions): Promise<ChatResponse> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || '伺服器錯誤');
      }

      return await response.json() as ChatResponse;
    } catch (error) {
      console.error('聊天請求錯誤:', error);
      
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : '聊天服務暫時不可用'
        }
      };
    }
  }

  /**
   * 發送聊天訊息 (簡化回應)
   * @param messages 聊天訊息陣列
   * @returns 簡化的聊天回應
   */
  async sendMessage(messages: ChatMessage[]): Promise<SimpleChatResponse> {
    try {
      const response = await this.chat({ messages });
      
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || '無法獲取回應');
      }
      
      // 返回簡化的回應格式
      return { 
        text: response.data.choices[0].message.content,
        processingTime: response.data.usage ? response.data.usage.total_tokens : undefined
      };
    } catch (error) {
      console.error('聊天請求錯誤:', error);
      throw error;
    }
  }
  
  /**
   * 發送FAQ查詢請求
   * @param query 用戶查詢
   * @param limit 返回結果數量限制
   * @returns FAQ搜尋結果
   */
  async searchFaq(query: string, limit: number = 5): Promise<any> {
    try {
      const response = await fetch('/api/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          limit
        }),
      });

      if (!response.ok) {
        throw new Error(`FAQ查詢失敗: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('FAQ查詢失敗:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'FAQ服務暫時不可用'
        }
      };
    }
  }
}

// 建立並匯出默認的聊天客戶端服務實例
export const chatClient = new ChatClientService(); 