'use client';

import { useState, useEffect } from 'react';

/**
 * 問候語組件
 * 根據時間顯示不同的問候語
 */
export function Greeting() {
  // 保存問候語的狀態
  const [greeting, setGreeting] = useState('');
  
  // 在組件掛載時設置問候語
  useEffect(() => {
    setGreeting(getGreeting());
  }, []);
  
  // 根據當前時間獲取適當的問候語
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return '早安！';
    } else if (hour >= 12 && hour < 18) {
      return '午安！';
    } else {
      return '晚安！';
    }
  };
  
  return (
    <div className="mb-8 text-center">
      <h1 className="mb-2 text-3xl font-bold">{greeting}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        有什麼可以幫助您的嗎？
      </p>
    </div>
  );
}