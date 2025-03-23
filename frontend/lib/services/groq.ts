import type { ChatMessage, ChatResponse, SimpleChatResponse } from '../types/chat';

// Workers API 網址
const WORKER_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://echomind-api.roy422roy.workers.dev';

/**
 * Groq 聊天服務
 */
export const groqService = {
  /**
   * 發送聊天訊息
   * @param messages - 聊天訊息陣列
   * @param modelId - 選擇的模型ID (default, advanced, creative)
   * @returns 包含 AI 回應的 Promise
   */
  async sendMessage(
    messages: ChatMessage[], 
    modelId: string = 'default'
  ): Promise<SimpleChatResponse> {
    try {
      // 直接調用 Cloudflare Workers API
      const response = await fetch(`${WORKER_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages,
          model: modelId  // 傳遞模型 ID
        }),
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