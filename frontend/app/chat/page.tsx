'use client';

import { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/components/chat/WelcomeScreen';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/lib/types/chat';
import { chatClient } from '@/lib/services/chatClient';

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
      
      // 呼叫API
      const response = await chatClient.sendMessage(updatedMessages);
      
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
    <main className="container mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-8">
        {/* 如果沒有訊息，顯示歡迎畫面 */}
        {messages.length === 0 ? (
          <WelcomeScreen onSubmit={handleSubmit} isLoading={isLoading} />
        ) : (
          <div className="space-y-8">
            {/* 訊息列表 */}
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-3xl rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {/* 錯誤訊息 */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-500 dark:border-red-800 dark:bg-red-900/50 dark:text-red-400">
                  {error}
                </div>
              )}
              
              {/* 載入指示器 */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-3xl rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-800">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500 [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500 [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 聊天輸入框 */}
            <div className="sticky bottom-4">
              <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 