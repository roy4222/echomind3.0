/**
 * 聊天輸入框組件
 * 提供使用者輸入訊息並發送的介面
 */

import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  /** 提交訊息的回調函數 */
  onSubmit: (input: string) => Promise<void>;
  /** 是否正在載入中 */
  isLoading: boolean;
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  // 管理輸入框的值
  const [input, setInput] = useState('');

  /**
   * 處理表單提交
   * @param e - 表單事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 如果輸入為空或正在載入中則不處理
    if (!input.trim() || isLoading) return;
    
    await onSubmit(input);
    setInput(''); // 清空輸入框
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2 pt-4">
      <div className="relative flex-1">
        {/* 訊息輸入框 */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="繼續對話..."
          className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 pr-10 text-gray-900 shadow-sm backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:bg-gray-800"
          disabled={isLoading}
        />
        {/* 提示文字 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          按下 Enter 發送
        </div>
      </div>
      {/* 發送按鈕 */}
      <button
        type="submit"
        disabled={isLoading}
        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${
          isLoading
            ? 'bg-gray-400 dark:bg-gray-700'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-xl hover:shadow-blue-500/35'
        } text-white shadow-lg shadow-blue-500/25 transition-all duration-300 dark:from-blue-400 dark:to-blue-500`}
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
} 