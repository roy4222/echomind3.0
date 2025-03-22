/**
 * 聊天訊息列表組件
 * 顯示聊天訊息並處理載入狀態的動畫效果
 */

import { type ChatMessage } from '@/lib/types/chat';
import { RefObject } from 'react';

interface MessageListProps {
  /** 聊天訊息陣列 */
  messages: ChatMessage[];
  /** 是否正在載入中 */
  isLoading: boolean;
  /** 用於滾動到最新訊息的 ref */
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

/**
 * 訊息列表組件
 * @param props - 組件屬性
 * @returns 訊息列表 JSX 元素
 */
export function MessageList({ messages, isLoading, messagesEndRef }: MessageListProps) {
  return (
    // 可滾動的訊息容器
    <div className="flex-1 space-y-6 overflow-y-auto">
      {/* 遍歷並渲染所有訊息 */}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            // 使用者訊息靠右對齊，AI 助手訊息靠左對齊
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-xl px-4 py-2 ${
              // 使用者訊息使用藍色背景，AI 助手訊息使用灰色背景
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
      {/* 載入中動畫 */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-xl bg-gray-100 px-4 py-2 dark:bg-gray-800">
            <div className="flex space-x-2">
              {/* 三個跳動的點點表示載入中 */}
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
      {/* 用於滾動到最新訊息的錨點 */}
      <div ref={messagesEndRef} />
    </div>
  );
} 