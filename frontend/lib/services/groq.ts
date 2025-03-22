import type { ChatMessage, ChatResponse, SimpleChatResponse } from '../types/chat';

/**
 * Groq 聊天服務
 */
export const groqService = {
  /**
   * 發送聊天訊息
   * @param messages - 聊天訊息陣列
   * @returns 包含 AI 回應的 Promise
   */
  async sendMessage(messages: ChatMessage[]): Promise<SimpleChatResponse> {
    try {
      // 建構包含聊天歷史的請求
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || '伺服器錯誤');
      }

      const data = await response.json() as ChatResponse;
      
      if (!data.success || !data.data) {
        throw new Error(data.error?.message || '無法獲取回應');
      }
      
      // 返回簡化的回應格式
      return { 
        text: data.data.choices[0].message.content,
        processingTime: data.data.usage ? data.data.usage.total_tokens : undefined
      };
    } catch (error) {
      console.error('聊天請求錯誤:', error);
      throw error;
    }
  }
}; 