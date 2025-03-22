import { apiService } from './api';
import type { ChatMessage, ChatCompletionOptions, ChatResponse } from '@/lib/types/chat';

/**
 * 聊天服務
 * 處理與後端 AI 服務的通訊
 */
export class ChatService {
  /**
   * 發送聊天請求
   * @param messages 聊天訊息歷史
   * @param options 選項配置
   * @returns 聊天回應
   */
  async sendMessage(
    messages: ChatMessage[],
    options?: Partial<Omit<ChatCompletionOptions, 'messages'>>
  ): Promise<ChatResponse> {
    try {
      const response = await apiService.post<ChatResponse>('/api/chat', {
        messages,
        ...options
      });
      
      return response;
    } catch (error) {
      console.error('聊天請求失敗:', error);
      
      // 當API請求失敗時，返回一個模擬回應
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : '聊天服務暫時不可用'
        }
      };
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
      return await apiService.post('/api/faq', {
        query,
        limit
      });
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

// 建立並匯出默認的聊天服務實例
export const chatService = new ChatService(); 