/**
 * 聊天輸入框組件
 * 提供使用者輸入訊息並發送的介面
 */

import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  /** 提交訊息的回調函數 */
  onSubmit: (input: string) => Promise<void>;
  /** 是否正在載入中 */
  isLoading: boolean;
}

/**
 * 聊天輸入框組件
 * @param props - 組件屬性
 * @returns 聊天輸入框 JSX 元素
 */
export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  // 輸入值狀態
  const [inputValue, setInputValue] = useState('');

  /**
   * 表單提交處理函數
   * @param e - 表單事件
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // 檢查輸入是否為空
    if (!inputValue.trim() || isLoading) return;
    
    try {
      // 提交訊息
      await onSubmit(inputValue);
      // 清空輸入框
      setInputValue('');
    } catch (error) {
      console.error('提交訊息失敗:', error);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative mt-4 flex w-full items-center"
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="輸入您的問題..."
        disabled={isLoading}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-12 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
      />
      <button
        type="submit"
        disabled={isLoading || !inputValue.trim()}
        className="absolute right-2 rounded-md p-2 text-gray-400 transition-colors hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:text-blue-400"
      >
        <Send className="h-5 w-5" />
      </button>
      {/* 警告標語 - 置中顯示 */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
        請注意: AI 可能會產生錯誤資訊，建議您查證回覆內容的準確性。
      </div>
    </form>
  );
} 