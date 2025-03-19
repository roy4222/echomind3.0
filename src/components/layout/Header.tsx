'use client';

import { FC, useState } from 'react';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { LoginIcon } from '../icons/LoginIcon';
import { SidebarToggleIcon } from '../icons/SidebarToggleIcon';

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

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Header: FC<HeaderProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  const { theme, setTheme } = useTheme();
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    onToggleSidebar();
    setIsActive(!isActive);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* 左側區域 */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleClick}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors",
              isActive ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            aria-label="切換側邊欄"
          >
            <SidebarToggleIcon isOpen={isSidebarOpen} className="h-5 w-5" />
          </button>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xl lg:text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Logo className="h-8 w-8 lg:h-9 lg:w-9" />
            <span>EchoMind</span>
          </Link>
        </div>

        {/* 右側區域 */}
        <div className="flex items-center gap-3">
          {/* 主題切換按鈕 */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>

          {/* 登入按鈕 */}
          <Link 
            href="/login" 
            className={cn(
              "flex items-center gap-2",
              "px-4 py-2 lg:px-6 lg:py-2.5",
              "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500",
              "hover:from-amber-600 hover:via-orange-600 hover:to-rose-600",
              "dark:from-amber-400 dark:via-orange-400 dark:to-rose-400",
              "dark:hover:from-amber-500 dark:hover:via-orange-500 dark:hover:to-rose-500",
              "text-white rounded-lg",
              "transition-all duration-300 ease-in-out",
              "transform hover:scale-105 active:scale-95",
              "shadow-md hover:shadow-lg",
              "hover:shadow-orange-500/20 dark:hover:shadow-orange-400/20"
            )}
          >
            <LoginIcon className="h-5 w-5 lg:h-6 lg:w-6" />
            <span className="hidden sm:inline font-medium">登入</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
