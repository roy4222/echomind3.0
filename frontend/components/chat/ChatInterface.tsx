/**
 * 聊天介面主組件
 * 整合聊天相關功能，包括訊息列表、輸入框和歡迎畫面
 */

import { useState, useRef, useEffect } from 'react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { Greeting } from "@/components/chat/Greeting";
import { Sparkles, Search, Lightbulb } from 'lucide-react';
import { type ChatMessage } from '@/lib/types/chat';
import { chatClient } from '@/lib/services/chatClient';
import { chatHistoryService } from '@/lib/services/chatHistory';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/lib/utils/auth';

interface ChatInterfaceProps {
  chatId?: string | null;
  isNewChat?: boolean;
  onResetUrl?: () => void;
}

export function ChatInterface({ 
  chatId: initialChatId = null,
  isNewChat = false,
  onResetUrl
}: ChatInterfaceProps) {
  // 狀態管理
  const [messages, setMessages] = useState<ChatMessage[]>([]); // 儲存聊天訊息
  const [isLoading, setIsLoading] = useState(false); // 載入狀態
  const [isChatStarted, setIsChatStarted] = useState(false); // 是否開始聊天
  const [error, setError] = useState<string | null>(null); // 錯誤訊息
  const [currentModelId, setCurrentModelId] = useState<string>('default'); // 當前使用的模型
  const [chatId, setChatId] = useState<string | null>(initialChatId); // 聊天ID
  
  // 取得當前使用者
  const { user } = useAuth();
  
  // 當使用者變更時，設定聊天歷史服務的使用者 ID
  useEffect(() => {
    if (user) {
      authService.setUserId(user.uid);
    } else {
      authService.setUserId(null);
    }
  }, [user]);
  
  // 監聽 URL 參數變化，處理新聊天和載入聊天
  useEffect(() => {
    // 重置 URL 參數
    if (onResetUrl) {
      onResetUrl();
    }
    
    // 如果 URL 中有 new=true，重置聊天
    if (isNewChat) {
      setMessages([]);
      setIsChatStarted(false);
      setChatId(null);
      setError(null);
      return;
    }
    
    // 如果有指定的聊天 ID，載入該聊天記錄
    if (initialChatId && user) {
      const loadChat = async () => {
        setIsLoading(true);
        try {
          const chat = await chatHistoryService.getChat(initialChatId);
          if (chat) {
            setMessages(chat.messages);
            setCurrentModelId(chat.modelId || 'default');
            setChatId(initialChatId);
            if (chat.messages.length > 0) {
              setIsChatStarted(true);
            }
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
  }, [initialChatId, isNewChat, user, onResetUrl]);

  /**
   * 處理訊息提交
   * @param input - 使用者輸入的訊息
   * @param modelId - 選擇的模型 ID
   * @param image - 上傳的圖片 (base64 格式)
   */
  const handleSubmit = async (input: string, modelId?: string, image?: string) => {
    if (!input.trim() && !image) return;
    if (isLoading) return;

    try {
      // 更新當前選擇的模型 ID (如果提供了新的模型 ID)
      let useModelId = currentModelId;
      if (modelId) {
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
        content: input.trim(),
        id: Date.now().toString(),
        createdAt: Date.now(),
        image: image, // 添加圖片屬性
      };
      
      // 更新訊息列表
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      if (!isChatStarted) {
        setIsChatStarted(true);
      }
      
      // 準備要傳送到API的訊息 (移除createdAt欄位)
      const apiMessages = updatedMessages.map(({ role, content }) => ({
        role,
        content
      }));
      
      // 呼叫API (傳遞選擇的模型 ID 和圖片)
      const response = await chatClient.sendMessage(apiMessages, useModelId, image);
      
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
                window.history.replaceState({}, '', `/?id=${newChatId}`);
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

  /**
   * 處理直接添加消息到聊天
   * 用於向量搜索等需要繞過常規流程的情況
   * @param message - 聊天消息
   */
  const handleSendMessage = (message: ChatMessage) => {
    // 添加消息到聊天
    setMessages(prev => [...prev, message]);
    
    // 如果是第一條消息，設置聊天已開始
    if (!isChatStarted) {
      setIsChatStarted(true);
    }
    
    // 如果是用戶消息且有聊天ID，異步儲存聊天記錄
    if (user && chatId && message.role === 'user') {
      setTimeout(async () => {
        try {
          await chatHistoryService.updateChat(chatId, [...messages, message], undefined, currentModelId);
        } catch (error) {
          console.error('更新聊天記錄失敗:', error);
        }
      }, 0);
    }
    
    // 如果是用戶的第一條消息，創建新聊天記錄
    if (user && messages.length === 0 && !chatId && message.role === 'user') {
      setTimeout(async () => {
        try {
          // 使用消息內容作為標題
          const title = message.content.length > 30 
            ? message.content.substring(0, 30) + '...' 
            : message.content;
          const newChatId = await chatHistoryService.createChat([message], title, currentModelId);
          if (newChatId) {
            setChatId(newChatId);
            // 更新 URL，但不刷新頁面
            window.history.replaceState({}, '', `/?id=${newChatId}`);
          }
        } catch (error) {
          console.error('自動創建聊天記錄失敗:', error);
        }
      }, 0);
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
        <ChatInput 
          onSubmit={handleSubmit} 
          onSendMessage={handleSendMessage}
          isLoading={isLoading} 
        />
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
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
} 