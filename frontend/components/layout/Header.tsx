'use client';

import { FC, useState } from 'react';
import { Moon, Sun, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { LoginIcon } from '../icons/LoginIcon';
import { SidebarToggleIcon } from '../icons/SidebarToggleIcon';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleClick = () => {
    onToggleSidebar();
    setIsActive(!isActive);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  // 如果正在載入，顯示載入狀態
  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
        <div className="flex h-full items-center justify-between px-4 lg:px-6">
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
              href="/chat?new=true" 
              className="flex items-center gap-2 text-xl lg:text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Logo className="h-8 w-8 lg:h-9 lg:w-9" />
              <span>EchoMind</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="animate-pulse h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md border-2 border-gray-200/50 dark:border-gray-700/50 shadow-sm rounded-b-2xl mx-2">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* 左側區域 */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleClick}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition-colors border border-gray-200/50 dark:border-gray-700/50",
              isActive ? "bg-gray-100/80 dark:bg-gray-800/80" : "hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
            )}
            aria-label="切換側邊欄"
          >
            <SidebarToggleIcon isOpen={isSidebarOpen} className="h-5 w-5" />
          </button>
          <Link 
            href="/?new=true" 
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
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-100/50 dark:text-gray-300 dark:hover:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>

          {/* 用戶頭像或登入按鈕區塊 */}
          {user ? (
            <div className="relative">
              {/* 頭像按鈕 - 點擊時切換下拉選單顯示狀態 */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border-2 border-gray-300/80 hover:border-blue-500 dark:border-gray-600/80 dark:hover:border-blue-400"
              >
                {/* 如果用戶有頭像照片則顯示照片,否則顯示預設圖示 */}
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || '用戶頭像'}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  // 預設頭像圖示容器
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {/* 預設頭像 SVG 圖示 */}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                    >
                      <path 
                        fill="currentColor" 
                        d="M13 3c3.88 0 7 3.14 7 7c0 2.8-1.63 5.19-4 6.31V21H9v-3H8c-1.11 0-2-.89-2-2v-3H4.5c-.42 0-.66-.5-.42-.81L6 9.66A7.003 7.003 0 0 1 13 3m0-2C8.41 1 4.61 4.42 4.06 8.9L2.5 11h-.03l-.02.03c-.55.76-.62 1.76-.19 2.59c.36.69 1 1.17 1.74 1.32V16c0 1.85 1.28 3.42 3 3.87V23h11v-5.5c2.5-1.67 4-4.44 4-7.5c0-4.97-4.04-9-9-9m4.33 8.3l-1.96.51l1.44 1.46c.35.34.35.92 0 1.27s-.93.35-1.27 0l-1.45-1.44l-.52 1.96c-.12.49-.61.76-1.07.64a.91.91 0 0 1-.66-1.11l.53-1.96l-1.96.53a.91.91 0 0 1-1.11-.66c-.12-.45.16-.95.64-1.07l1.96-.52l-1.44-1.45a.9.9 0 0 1 1.27-1.27l1.46 1.44l.51-1.96c.12-.49.62-.77 1.09-.64c.49.13.77.62.64 1.1L14.9 8.1l1.97-.53c.48-.13.97.15 1.1.64c.13.47-.15.97-.64 1.09"
                      />
                    </svg>
                  </div>
                )}
              </button>

              {/* 下拉選單 */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.displayName || '用戶'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-gray-700" />
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push('/profile');
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <UserIcon className="h-4 w-4" />
                    個人資料
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push('/settings');
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Settings className="h-4 w-4" />
                    設定
                  </button>
                  <div className="h-px bg-gray-200 dark:bg-gray-700" />
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4" />
                    登出
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className={cn(
                "flex items-center gap-2",
                "px-4 py-2 lg:px-6 lg:py-2.5",
                "bg-white/10 dark:bg-gray-800/30",
                "hover:bg-white/20 dark:hover:bg-gray-800/50",
                "border-2 border-gray-300/80 dark:border-gray-600/80",
                "hover:border-blue-500/80 dark:hover:border-blue-400/80",
                "text-gray-800 dark:text-gray-200",
                "rounded-xl backdrop-blur-sm",
                "transition-all duration-300 ease-in-out",
                "transform hover:scale-105 active:scale-95",
                "shadow-sm hover:shadow-md"
              )}
            >
              <LoginIcon className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="hidden sm:inline font-medium">登入</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
