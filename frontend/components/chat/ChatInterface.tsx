/**
 * 聊天介面主組件
 * 整合聊天相關功能，包括訊息列表、輸入框和歡迎畫面
 */

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { Greeting } from "@/components/chat/Greeting";
import { Sparkles, Search, Lightbulb } from 'lucide-react';
import { type ChatMessage } from '@/lib/types/chat';
import { chatClient } from '@/lib/services/chatClient';

export function ChatInterface() {
  // 狀態管理
  const [messages, setMessages] = useState<ChatMessage[]>([]); // 儲存聊天訊息
  const [isLoading, setIsLoading] = useState(false); // 載入狀態
  const [isChatStarted, setIsChatStarted] = useState(false); // 是否開始聊天
  const [error, setError] = useState<string | null>(null); // 錯誤訊息
  
  // 取得 URL 參數
  const searchParams = useSearchParams();
  
  // 監聽 URL 參數變化，當 new=true 時重置聊天
  useEffect(() => {
    const isNewChat = searchParams.get('new') === 'true';
    console.log('ChatInterface - URL參數:', Array.from(searchParams.entries()));
    console.log('ChatInterface - isNewChat:', isNewChat);
    console.log('ChatInterface - 當前聊天狀態:', {
      messagesCount: messages.length,
      isChatStarted,
      hasError: error !== null
    });
    
    if (isNewChat) {
      // 重置所有聊天狀態
      console.log('ChatInterface - 重置聊天狀態');
      setMessages([]);
      setIsChatStarted(false);
      setError(null);
    }
  }, [searchParams]);

  /**
   * 處理訊息提交
   * @param input - 使用者輸入的訊息
   * @param modelId - 選擇的模型 ID
   */
  const handleSubmit = async (input: string, modelId?: string) => {
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
      if (!isChatStarted) {
        console.log('ChatInterface - 將聊天狀態設為已開始');
        setIsChatStarted(true);
      }
      
      // 準備要傳送到API的訊息 (移除createdAt欄位)
      const apiMessages = updatedMessages.map(({ role, content }) => ({
        role,
        content
      }));
      
      console.log(`ChatInterface 接收到的模型 ID: "${modelId || '未提供'}"`);
      
      // 呼叫API (傳遞選擇的模型 ID)
      const response = await chatClient.sendMessage(apiMessages, modelId);
      
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

  /**
   * 渲染歡迎畫面
   * @returns 歡迎畫面 JSX 元素
   */
  const renderWelcomeScreen = () => {
    return (
      <>
        {/* 問候語組件 */}
        <Greeting />
        
        {/* 聊天輸入框 */}
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </>
    );
  };

  // 使用全頁面佈局，讓瀏覽器處理捲動
  return (
    <div className="h-screen w-full flex flex-col">
      {!isChatStarted ? (
        // 歡迎畫面
        <div className="flex-1 flex items-center justify-center px-4 bg-dot-pattern dark:bg-dot-pattern-dark">
          <div className="w-full max-w-3xl space-y-8 py-12">
            {renderWelcomeScreen()}
          </div>
        </div>
      ) : (
        <>
          {/* 訊息區域 - 讓瀏覽器處理捲動 */}
          <div className="flex-1 bg-dot-pattern dark:bg-dot-pattern-dark">
            <div className="w-full max-w-3xl mx-auto px-4 pt-4 pb-4">
              <ChatMessageList 
                messages={messages} 
                isLoading={isLoading} 
                error={error}
              />
            </div>
          </div>
          
          {/* 輸入區域 */}
          <div className="w-full border-t border-gray-200 bg-white py-3 dark:border-gray-800 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto px-4">
              <ChatInput 
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
} 