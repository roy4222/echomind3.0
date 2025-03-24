'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WelcomeScreen } from '@/components/chat/WelcomeScreen';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/lib/types/chat';
import { chatClient } from '@/lib/services/chatClient';
import { ChatMessageList } from '@/components/chat/ChatMessageList';
import { chatHistoryService } from '@/lib/services/chatHistory';
import { useAuth } from '@/contexts/AuthContext';

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
  
  // 記住當前選擇的模型 ID
  const [currentModelId, setCurrentModelId] = useState<string>('default');
  
  // 當前聊天 ID
  const [chatId, setChatId] = useState<string>('');
  
  // 取得路由和參數
  const router = useRouter();
  const searchParams = useSearchParams();

  // 取得當前使用者
  const { user } = useAuth();
  
  // 當使用者變更時，設定聊天歷史服務的使用者 ID
  useEffect(() => {
    if (user) {
      chatHistoryService.setUserId(user.uid);
    } else {
      chatHistoryService.setUserId(null);
    }
  }, [user]);
  
  // 檢查 URL 中是否有指定的聊天 ID
  useEffect(() => {
    const loadChatId = searchParams.get('id');
    
    // 如果 URL 中有 new=true，重置聊天
    if (searchParams.get('new') === 'true') {
      setChatId('');
      setMessages([]);
      return;
    }
    
    // 如果有指定的聊天 ID，載入該聊天記錄
    if (loadChatId && user) {
      const loadChat = async () => {
        setIsLoading(true);
        try {
          const chat = await chatHistoryService.getChat(loadChatId);
          if (chat) {
            setMessages(chat.messages);
            setCurrentModelId(chat.modelId);
            setChatId(loadChatId);
          } else {
            console.error('找不到指定的聊天記錄');
          }
        } catch (error) {
          console.error('載入聊天記錄失敗:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadChat();
    }
  }, [searchParams, user]);
  
  /**
   * 處理用戶提交的訊息
   * @param input 用戶輸入的訊息
   * @param modelId 選擇的模型ID
   */
  const handleSubmit = async (input: string, modelId?: string) => {
    try {
      console.log(`接收到提交請求 - 輸入: ${input.substring(0, 20)}..., 模型ID: ${modelId || '未提供'}`);
      
      // 更新當前選擇的模型 ID (如果提供了新的模型 ID)
      let useModelId = currentModelId;
      if (modelId) {
        console.log(`更新模型 ID: ${currentModelId} -> ${modelId}`);
        setCurrentModelId(modelId);
        useModelId = modelId;
      }
      
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
      
      console.log(`--> 實際使用模型 ID: "${useModelId}"`);
      
      // 呼叫API (傳遞模型選擇)
      const response = await chatClient.sendMessage(apiMessages, useModelId);
      
      // 從回應中提取助手訊息
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.text,
        id: (Date.now() + 1).toString(),
        createdAt: Date.now(),
      };
      
      // 更新訊息列表，包含AI回應
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      
      // 使用非阻塞方式儲存聊天記錄
      if (user) {
        // 若是第一條訊息且用戶已登入，自動創建聊天記錄
        if (messages.length === 0 && !chatId) {
          // 使用 setTimeout 將 Firebase 操作移到下一個事件循環，不阻塞 UI
          setTimeout(async () => {
            try {
              // 使用訊息內容作為標題
              const title = input.length > 30 ? input.substring(0, 30) + '...' : input;
              const newChatId = await chatHistoryService.createChat(finalMessages, title, useModelId);
              if (newChatId) {
                setChatId(newChatId);
                // 更新 URL，但不刷新頁面
                window.history.replaceState({}, '', `/chat?id=${newChatId}`);
              }
            } catch (error) {
              console.error('自動創建聊天記錄失敗:', error);
              // 不阻止聊天流程繼續
            }
          }, 0);
        } 
        // 如果已有聊天ID，自動更新聊天記錄
        else if (chatId) {
          // 使用 setTimeout 將 Firebase 操作移到下一個事件循環，不阻塞 UI
          setTimeout(async () => {
            try {
              await chatHistoryService.updateChat(chatId, finalMessages, undefined, useModelId);
            } catch (error) {
              console.error('更新聊天記錄失敗:', error);
            }
          }, 0);
        }
      }
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