/**
 * 聊天介面主組件
 * 整合聊天相關功能，包括訊息列表、輸入框和歡迎畫面
 */

import { useState, useRef, useEffect } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { WelcomeScreen } from './WelcomeScreen';
import { type ChatMessage } from '@/lib/types/chat';
import { chatClient } from '@/lib/services/chatClient';

export function ChatInterface() {
  // 狀態管理
  const [messages, setMessages] = useState<ChatMessage[]>([]); // 儲存聊天訊息
  const [isLoading, setIsLoading] = useState(false); // 載入狀態
  const [isChatStarted, setIsChatStarted] = useState(false); // 是否開始聊天
  const messagesEndRef = useRef<HTMLDivElement>(null); // 用於自動滾動到最新訊息

  /**
   * 滾動到訊息列表底部
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 當訊息更新時自動滾動到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * 處理訊息提交
   * @param input - 使用者輸入的訊息
   */
  const handleSubmit = async (input: string) => {
    if (!input.trim() || isLoading) return;

    // 建立使用者訊息物件
    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
    };

    // 更新訊息列表和狀態
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    if (!isChatStarted) setIsChatStarted(true);

    try {
      // 發送請求到聊天 API
      const chatMessages = [...messages, userMessage];
      const response = await chatClient.sendMessage(chatMessages);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.text,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // 錯誤處理
      console.error('聊天發生錯誤:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，處理您的請求時發生錯誤。請稍後再試。',
      }]);
    } finally {
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
                  <MessageList 
                    messages={messages} 
                    isLoading={isLoading} 
                    messagesEndRef={messagesEndRef}
                  />
                  <ChatInput 
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 