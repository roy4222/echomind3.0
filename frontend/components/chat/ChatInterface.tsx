/**
 * 聊天介面主組件
 * 整合聊天相關功能，包括訊息列表、輸入框和歡迎畫面
 */

import { useState, useRef, useEffect } from 'react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { WelcomeScreen } from './WelcomeScreen';
import { type ChatMessage } from '@/lib/types/chat';
import { chatClient } from '@/lib/services/chatClient';

export function ChatInterface() {
  // 狀態管理
  const [messages, setMessages] = useState<ChatMessage[]>([]); // 儲存聊天訊息
  const [isLoading, setIsLoading] = useState(false); // 載入狀態
  const [isChatStarted, setIsChatStarted] = useState(false); // 是否開始聊天
  const [error, setError] = useState<string | null>(null); // 錯誤訊息

  /**
   * 處理訊息提交
   * @param input - 使用者輸入的訊息
   */
  const handleSubmit = async (input: string) => {
    if (!input.trim() || isLoading) return;

    try {
      // 重置錯誤狀態
      setError(null);
      
      // 開始載入
      setIsLoading(true);
      
      // 建立用戶訊息
      const userMessage: ChatMessage = {
        role: 'user',
        content: input.trim(),
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      
      // 更新訊息列表
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      if (!isChatStarted) setIsChatStarted(true);
      
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

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-hidden">
        <div className="relative flex h-full flex-col bg-dot-pattern dark:bg-dot-pattern-dark">
          <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4">
            <div className="w-full max-w-3xl space-y-8 py-12">
              {!isChatStarted ? (
                // 顯示歡迎畫面或聊天介面
                <WelcomeScreen onSubmit={handleSubmit} isLoading={isLoading} />
              ) : (
                <div className="flex flex-col h-[calc(100vh-10rem)] justify-between">
                  <div className="flex-1 overflow-y-auto pb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    <ChatMessageList 
                      messages={messages} 
                      isLoading={isLoading} 
                      error={error}
                    />
                  </div>
                  <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white py-3 px-1 shadow-sm backdrop-blur-sm transition-all dark:border-gray-800 dark:bg-gray-900/70 dark:backdrop-blur-md">
                    <ChatInput 
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 