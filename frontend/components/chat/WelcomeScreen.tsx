/**
 * 歡迎畫面組件
 * 顯示問候語、聊天輸入框和功能按鈕
 */

import { Greeting } from "@/components/chat/Greeting";
import { Sparkles, Search, Lightbulb } from 'lucide-react';
import { ChatInput } from './ChatInput';

interface WelcomeScreenProps {
  /** 提交訊息的回調函數 */
  onSubmit: (input: string) => Promise<void>;
  /** 是否正在載入中 */
  isLoading: boolean;
}

/**
 * 歡迎畫面組件
 * @param props - 組件屬性
 * @returns 歡迎畫面 JSX 元素
 */
export function WelcomeScreen({ onSubmit, isLoading }: WelcomeScreenProps) {
  return (
    <>
      {/* 問候語組件 */}
      <Greeting />
      
      {/* 聊天輸入框 */}
      <ChatInput onSubmit={onSubmit} isLoading={isLoading} />

      {/* 功能按鈕列表 */}
      <div className="flex flex-wrap justify-center gap-3">
        {/* 搜尋知識庫按鈕 */}
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/50 px-4 py-2.5 text-sm text-gray-600 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800">
          <Search className="h-4 w-4" />
          <span>搜尋知識庫</span>
        </button>
        {/* 生成圖片按鈕 */}
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/50 px-4 py-2.5 text-sm text-gray-600 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800">
          <Sparkles className="h-4 w-4" />
          <span>生成圖片</span>
        </button>
        {/* 智能助手按鈕 */}
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/50 px-4 py-2.5 text-sm text-gray-600 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800">
          <Lightbulb className="h-4 w-4" />
          <span>智能助手</span>
        </button>
      </div>
    </>
  );
} 