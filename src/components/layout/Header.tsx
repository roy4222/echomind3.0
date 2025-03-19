'use client';

import { FC, useEffect, useState } from 'react';
import { Menu, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { LoginIcon } from '../icons/LoginIcon'

// Logo 組件
const Logo: FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 48 48"
    className={className}
  >
    <g fill="none">
      <path 
        stroke="currentColor" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="4" 
        d="M12 8c-3.052 4.517-5.987 5.81-8 5c.543 1.833 4.443 4.375 6.927 5.838c1.07.63 1.383 2.065.638 3.059C10.202 23.717 8.315 26.289 8 27C.954 39.79 16.482 44.648 24 44c22.144-1.908 21.355-19.197 18-26c-8.052 13.994-20.481 5.915-20 3s3.792-2.335 5-7C29.013 4.768 16.374.399 12 8"
      />
      <path 
        stroke="currentColor" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="4" 
        d="M19 31c2.5 3.5 10 7 16 2"
      />
      <circle cx="17" cy="12" r="2" fill="currentColor"/>
    </g>
  </svg>
);

// 定義 Header 元件的 Props 介面
interface HeaderProps {
  toggleSidebar: () => void;
}

// Header 元件 - 網站的頂部導航欄
const Header: FC<HeaderProps> = ({ toggleSidebar }) => {
  // 使用 next-themes 提供的主題功能
  const { theme, setTheme } = useTheme();
  // 用於處理 hydration 問題的狀態
  const [mounted, setMounted] = useState(false);

  // 在元件掛載後設置 mounted 為 true
  useEffect(() => {
    setMounted(true);
  }, []);

  // 在客戶端渲染前顯示的預設 header
  if (!mounted) {
    return (
      <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/75 dark:border-gray-700 dark:bg-gray-900/75 backdrop-blur">
        <div className="flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
            <Link 
              href="/" 
              className="flex items-center gap-3 text-2xl font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Logo className="h-8 w-8" />
              <span>EchoMind</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10" />
          </div>
        </div>
      </header>
    );
  }

  // 完整的 header 元件渲染
  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/75 dark:border-gray-700 dark:bg-gray-900/75 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-6">
        {/* 左側區域：選單按鈕和網站標題 */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleSidebar}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          <Link 
            href="/" 
            className="flex items-center gap-3 text-2xl font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Logo className="h-8 w-8" />
            <span>EchoMind</span>
          </Link>
        </div>

        {/* 右側區域：主題切換、設定和登入按鈕 */}
        <div className="flex items-center gap-3">
          {/* 主題切換按鈕 */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label={theme === 'dark' ? '切換至淺色模式' : '切換至深色模式'}
          >
            {theme === 'dark' ? (
              <Sun className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          {/* 登入按鈕 */}
          <Link 
            href="/login" 
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 dark:hover:from-amber-500 dark:hover:via-orange-500 dark:hover:to-rose-500 text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg hover:shadow-orange-500/20 dark:hover:shadow-orange-400/20 text-lg"
          >
            <LoginIcon className="h-6 w-6" />
            <span>登入</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
