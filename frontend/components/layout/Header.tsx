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
    width="128" 
    height="128" 
    viewBox="0 0 32 32"
    className={className}
  >
    <g fill="currentColor">
      <path d="M12.959 12.258h6.017a3.027 3.027 0 0 0-3.014-3.015a3.01 3.01 0 0 0-3.003 3.015m1.258-3.701a.534.534 0 0 1-.537-.537v-.745c0-.298.239-.537.537-.537s.537.239.537.537v.745a.534.534 0 0 1-.537.537m2.958-.537c0 .298.239.537.537.537a.534.534 0 0 0 .537-.537v-.745a.534.534 0 0 0-.537-.537a.535.535 0 0 0-.537.537z"/>
      <path d="M24.244 9.711c-.336-3.657-4.12-7.356-8.155-7.356c-4.511 0-7.79 3.615-8.434 7.356c-.041.238-.146.729-.284 1.379l-.228 1.078C5.543 14 .653 20.796 2.579 22.723c.65.65 2.052.24 3.617-.604c.231.972.61 1.905 1.111 2.769a10.06 10.06 0 0 0-1.402 4.685a.933.933 0 0 0 .938.972h18.235a.933.933 0 0 0 .938-.972a10.06 10.06 0 0 0-1.387-4.66c.52-.88.912-1.83 1.145-2.81c1.578.854 2.993 1.273 3.647.62c1.978-1.978-3.232-9.09-4.685-10.691l-.044-.048c-.234-1.074-.415-1.915-.448-2.273M7.924 25.832c1.242 1.696 2.987 3.03 5.013 3.713h-6.03a9.1 9.1 0 0 1 1.018-3.713m11.068 3.713c2.022-.684 3.767-2.02 5.013-3.696a9.1 9.1 0 0 1 1.008 3.696zM21.45 14.14a7.9 7.9 0 0 1 2.618 5.876c0 4.408-3.626 7.982-8.1 7.982c-4.472 0-8.098-3.574-8.098-7.982a7.9 7.9 0 0 1 2.615-5.873c-.58-.922-.92-2.13-.92-3.677c0-3.102 3.073-5.921 5.163-5.921c.247 0 .35.287.465.608c.145.405.31.865.811.865c.49 0 .634-.44.763-.84c.108-.33.206-.633.485-.633c2.105 0 5.12 2.893 5.12 5.921c0 1.52-.333 2.736-.922 3.674"/>
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
