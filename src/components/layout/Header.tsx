'use client';

import { FC, useEffect, useState } from 'react';
import { Menu, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { LoginIcon } from '../icons/LoginIcon'

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
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <Link href="/" className="text-xl font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              EchoMind
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9" />
          </div>
        </div>
      </header>
    );
  }

  // 完整的 header 元件渲染
  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/75 dark:border-gray-700 dark:bg-gray-900/75 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4">
        {/* 左側區域：選單按鈕和網站標題 */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <Link href="/" className="text-xl font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            EchoMind
          </Link>
        </div>

        {/* 右側區域：主題切換、設定和登入按鈕 */}
        <div className="flex items-center gap-2">
          {/* 主題切換按鈕 */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label={theme === 'dark' ? '切換至淺色模式' : '切換至深色模式'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          {/* 登入按鈕 */}
          <Link 
            href="/login" 
            className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 dark:hover:from-indigo-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg hover:shadow-purple-500/20 dark:hover:shadow-purple-400/20"
          >
            <LoginIcon className="h-5 w-5" />
            <span>登入</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
