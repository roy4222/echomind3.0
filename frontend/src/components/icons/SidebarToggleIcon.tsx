import { FC, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

// 定義 SidebarToggleIcon 組件的 props 介面
interface SidebarToggleIconProps {
  isOpen?: boolean;  // 控制側邊欄是否開啟
  className?: string;  // 自定義 CSS 類名
}

// 導出 SidebarToggleIcon 組件
export const SidebarToggleIcon: FC<SidebarToggleIconProps> = ({ isOpen = false, className }) => {
  // 使用 next-themes 提供的 hook 來獲取主題相關資訊
  const { theme, systemTheme } = useTheme();
  // 用於追蹤組件是否已掛載的狀態
  const [mounted, setMounted] = useState(false);
  
  // 組件掛載後將 mounted 設為 true
  useEffect(() => {
    setMounted(true);
  }, []);

  // 在客戶端渲染之前返回一個基本的 SVG
  // 這樣可以避免 hydration 不匹配的問題
  if (!mounted) {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
        className={`w-6 h-6 ${className}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 根據 isOpen 狀態渲染不同的圖標路徑 */}
        {isOpen ? (
          <>
            {/* 開啟狀態的圖標路徑 */}
            <path d="M22 12c0-3.75 0-5.625-.955-6.939a5 5 0 0 0-1.106-1.106C18.625 3 16.749 3 13 3h-2c-3.75 0-5.625 0-6.939.955A5 5 0 0 0 2.955 5.06C2 6.375 2 8.251 2 12s0 5.625.955 6.939a5 5 0 0 0 1.106 1.106C5.375 21 7.251 21 11 21h2c3.75 0 5.625 0 6.939-.955a5 5 0 0 0 1.106-1.106C22 17.625 22 15.749 22 12m-7.5-8.5v17M19 7h-1.5m1.5 4h-1.5" />
            <path d="m8 10l1.227 1.057c.515.445.773.667.773.943s-.258.498-.773.943L8 14" />
          </>
        ) : (
          <>
            {/* 關閉狀態的圖標路徑 */}
            <path d="M2 12c0-3.75 0-5.625.955-6.939A5 5 0 0 1 4.06 3.955C5.375 3 7.251 3 11 3h2c3.75 0 5.625 0 6.939.955a5 5 0 0 1 1.106 1.106C22 6.375 22 8.251 22 12s0 5.625-.955 6.939a5 5 0 0 1-1.106 1.106C18.625 21 16.749 21 13 21h-2c-3.75 0-5.625 0-6.939-.955a5 5 0 0 1-1.106-1.106C2 17.625 2 15.749 2 12m7.5-8.5v17M5 7h1.5M5 11h1.5" />
            <path d="m17 10l-1.226 1.057c-.516.445-.774.667-.774.943s.258.498.774.943L17 14" />
          </>
        )}
      </svg>
    );
  }

  // 確定當前主題色
  const currentTheme = theme === 'system' ? systemTheme : theme;
  // 根據主題設置描邊顏色
  const strokeColor = currentTheme === 'dark' ? 'white' : 'black';

  // 返回最終的 SVG 圖標
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      className={`w-6 h-6 ${className}`}
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 根據 isOpen 狀態渲染不同的圖標路徑 */}
      {isOpen ? (
        <>
          {/* 開啟狀態的圖標路徑 */}
          <path d="M22 12c0-3.75 0-5.625-.955-6.939a5 5 0 0 0-1.106-1.106C18.625 3 16.749 3 13 3h-2c-3.75 0-5.625 0-6.939.955A5 5 0 0 0 2.955 5.06C2 6.375 2 8.251 2 12s0 5.625.955 6.939a5 5 0 0 0 1.106 1.106C5.375 21 7.251 21 11 21h2c3.75 0 5.625 0 6.939-.955a5 5 0 0 0 1.106-1.106C22 17.625 22 15.749 22 12m-7.5-8.5v17M19 7h-1.5m1.5 4h-1.5" />
          <path d="m8 10l1.227 1.057c.515.445.773.667.773.943s-.258.498-.773.943L8 14" />
        </>
      ) : (
        <>
          {/* 關閉狀態的圖標路徑 */}
          <path d="M2 12c0-3.75 0-5.625.955-6.939A5 5 0 0 1 4.06 3.955C5.375 3 7.251 3 11 3h2c3.75 0 5.625 0 6.939.955a5 5 0 0 1 1.106 1.106C22 6.375 22 8.251 22 12s0 5.625-.955 6.939a5 5 0 0 1-1.106 1.106C18.625 21 16.749 21 13 21h-2c-3.75 0-5.625 0-6.939-.955a5 5 0 0 1-1.106-1.106C2 17.625 2 15.749 2 12m7.5-8.5v17M5 7h1.5M5 11h1.5" />
          <path d="m17 10l-1.226 1.057c-.516.445-.774.667-.774.943s.258.498.774.943L17 14" />
        </>
      )}
    </svg>
  );
};
