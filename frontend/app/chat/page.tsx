'use client';

import { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/components/chat/WelcomeScreen';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/lib/types/chat';
import { chatClient } from '@/lib/services/chatClient';
import { ChatMessageList } from '@/components/chat/ChatMessageList';

/**
 * 聊天頁面組件
 * 提供與AI聊天的介面
 */
export default function ChatPage() {
  // 聊天訊息狀態
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // 載入狀態
  const [isLoading, setIsLoading] = useState(false);
  
  // 錯誤訊息
  const [error, setError] = useState<string | null>(null);
  
  /**
   * 處理用戶提交的訊息
   * @param input 用戶輸入的訊息
   */
  const handleSubmit = async (input: string) => {
    try {
      // 重置錯誤狀態
      setError(null);
      
      // 開始載入
      setIsLoading(true);
      
      // 建立用戶訊息
      const userMessage: ChatMessage = {
        role: 'user',
        content: input,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      
      // 更新訊息列表
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      // 準備要傳送到API的訊息 (移除createdAt欄位)
      const apiMessages = updatedMessages.map(({ role, content }) => ({
        role,
        content
      }));
      
      // 呼叫API
      const response = await chatClient.sendMessage(apiMessages);
      
      // 從回應中提取助手訊息
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.text,
        id: (Date.now() + 1).toString(),
        createdAt: Date.now(),
      };
      
      // 更新訊息列表
      setMessages([...updatedMessages, assistantMessage]);
    } catch (err) {
      // 處理錯誤
      console.error('聊天請求錯誤:', err);
      setError(err instanceof Error ? err.message : '發生未知錯誤');
    } finally {
      // 結束載入
      setIsLoading(false);
    }
  };
  
  // 渲染歡迎畫面或聊天介面
  return (
    <main className="container mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-6 overflow-hidden">
        {/* 如果沒有訊息，顯示歡迎畫面 */}
        {messages.length === 0 ? (
          <WelcomeScreen onSubmit={handleSubmit} isLoading={isLoading} />
        ) : (
          <div className="flex h-[calc(100vh-10rem)] flex-col">
            {/* 訊息列表區域 */}
            <div className="flex-1 overflow-y-auto pb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <ChatMessageList 
                messages={messages} 
                isLoading={isLoading} 
                error={error} 
              />
            </div>
            
            {/* 聊天輸入框 */}
            <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white py-3 px-1 shadow-sm backdrop-blur-sm transition-all dark:border-gray-800 dark:bg-gray-900/70 dark:backdrop-blur-md">
              <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 