'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChatInput } from './input';

/**
 * 問候語組件
 * 根據當前時間顯示適當的問候語
 */
export const Greeting = () => {
  // 用於存儲問候語的狀態
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // 根據當前時間獲取適當的問候語
    const getGreeting = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        return '早安';
      } else if (hour == 12) {
        return '中午好';
      } else if (hour > 12 && hour < 18) {
        return '下午好';
      } else if (hour >= 18 && hour < 22) {
        return '晚上好';
      } else {
        return '永遠是深夜有多好';
      }
    };

    // 設置問候語
    setGreeting(getGreeting());
  }, []); // 空依賴陣列表示僅在組件掛載時執行一次

  return (
    // 使用 Framer Motion 創建動畫容器
    <motion.div
      initial={{ opacity: 0, y: 20 }} // 初始狀態：不可見且向下偏移
      animate={{ opacity: 1, y: 0 }} // 動畫到：完全可見且回到原位
      transition={{ duration: 0.8, ease: "easeOut" }} // 動畫持續時間和緩動函數
      className="text-center"
    >
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
        {/* 問候語文本，使用漸變背景色 */}
        <motion.span
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: "100% 50%" }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[size:200%]"
        >
          {greeting}
        </motion.span>
        {/* "歡迎使用 EchoMind" 文本，帶有延遲出現的動畫 */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-2 block"
        >
          歡迎使用 EchoMind
        </motion.span>
      </h1>
      {/* 副標題，帶有淡入動畫 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-4 text-lg text-gray-600 dark:text-gray-300"
      >
        您的輔大資管好幫手，隨時為您服務
      </motion.p>
    </motion.div>
  );
};

/**
 * 歡迎畫面組件介面
 */
interface WelcomeScreenProps {
  /** 提交訊息的回調函數 */
  onSubmit: (input: string, modelId?: string, image?: string, startChat?: boolean) => Promise<void>;
  /** 是否正在載入中 */
  isLoading: boolean;
}

/**
 * 歡迎畫面組件
 * 顯示在聊天開始前的問候語和輸入框
 * @param props - 組件屬性
 * @returns 歡迎畫面 JSX 元素
 */
export function WelcomeScreen({ onSubmit, isLoading }: WelcomeScreenProps) {
  return (
    <div className="space-y-6">
      <Greeting />
      <ChatInput onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
}