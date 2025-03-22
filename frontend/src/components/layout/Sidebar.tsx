'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Settings,
  HelpCircle,
  X,
  Clock,
} from 'lucide-react';

// 定義側邊欄項目的介面
interface SidebarItem {
  icon: React.ComponentType<{ className?: string }> | (() => React.ReactNode);
  label: string;
  href: string;
}

// 定義側邊欄的 Props 介面
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// 模擬的聊天歷史記錄
const chatHistory = [
  { id: 1, title: "關於 AI 的討論", time: "3 小時前" },
  { id: 2, title: "如何學習程式設計", time: "昨天" },
  { id: 3, title: "探討未來科技趨勢", time: "2 天前" },
];

// 側邊欄導航項目
const sidebarItems: SidebarItem[] = [
  {
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="h-6 w-6"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9 12h3m3 0h-3m0 0V9m0 3v3m0 7c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.96 9.96 0 0 0 12 22"
        />
      </svg>
    ),
    label: '開啟新對話',
    href: '/',
  },
  {
    icon: () => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
        className="h-6 w-6"
      >
        <path 
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M22 12c0-5.523-4.477-10-10-10a9.97 9.97 0 0 0-7 2.859V3.75a.75.75 0 0 0-1.5 0v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 0-1.5H5.519a8.5 8.5 0 1 1 2.348 12.93l-.27-.15l-3.986 1.111l1.113-3.984l-.151-.27A8.46 8.46 0 0 1 3.5 12c0-.675.079-1.332.227-1.962c.08-.301.065-.888-.536-1.02c-.613-.134-.87.355-.935.719h.001A10 10 0 0 0 2 12a9.96 9.96 0 0 0 1.115 4.592l-1.068 3.823a1.25 1.25 0 0 0 1.54 1.54l3.826-1.067A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M11.25 8a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 0 0 0-1.5H12V8.75a.75.75 0 0 0-.75-.75"
        />
      </svg>
    ),
    label: '聊天歷史',
    href: '/#history',
  },
  {
    icon: MessageSquare,
    label: '匿名留言板',
    href: '/#anonymous',
  },
  {
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 20 20" className="h-6 w-6">
        <path fill="currentColor" d="M7.5 4a5.5 5.5 0 1 0 0 11h5a5.5 5.5 0 1 0 0-11zM6 7.5a.5.5 0 0 1 1 0V9h1.5a.5.5 0 0 1 0 1H7v1.5a.5.5 0 0 1-1 0V10H4.5a.5.5 0 0 1 0-1H6zm9 .5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-3 4a1 1 0 1 1 0-2a1 1 0 0 1 0 2"/>
      </svg>
    ),
    label: '小遊戲',
    href: '/#games',
  },
];

// 底部導航項目
const bottomItems: SidebarItem[] = [
  {
    icon: HelpCircle,
    label: '幫助',
    href: '/#help',
  },
  {
    icon: Settings,
    label: '設定',
    href: '/#settings',
  },
];

// Sidebar 組件
const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  // 使用 Next.js 的 usePathname hook 獲取當前路徑
  const pathname = usePathname();

  // 導航項目組件
  const NavItem: FC<{ item: SidebarItem }> = ({ item }) => {
    // 解構 item 中的 icon
    const Icon = item.icon;
    // 檢查當前路徑是否與項目的 href 相匹配
    const isActive = pathname === item.href;

    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
          // 根據活動狀態應用不同的樣式
          isActive && 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50',
          !isActive && 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50'
        )}
      >
        {/* 根據 Icon 的類型進行不同的渲染 */}
        {typeof Icon === 'function' ? 
          <Icon className="h-6 w-6" /> : 
          React.createElement(Icon, { className: "h-6 w-6" })}
        {/* 項目標籤，在側邊欄關閉時在大螢幕上隱藏 */}
        <span className={cn(
          "font-medium transition-all duration-300",
          !isOpen && "lg:hidden"
        )}>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* 遮罩層 - 僅在行動裝置上顯示 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* 側邊欄 */}
      <aside className={cn(
        "fixed top-20 bottom-0 left-0 z-50",
        "w-64 bg-white dark:bg-gray-900",
        "border-r border-gray-200 dark:border-gray-700",
        "transition-all duration-300 ease-in-out",
        "flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        !isOpen && "lg:w-20"
      )}>
        {/* 行動裝置關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* 主要導航區域 */}
        <nav className="flex-1 space-y-6 p-4 overflow-y-auto">
          {/* 主要功能選單 */}
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
          {/* 分隔線 */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
        

          {/* 聊天歷史記錄 */}
          <div className={cn(
            "space-y-2",
            !isOpen && "lg:hidden"
          )}>
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>最近對話</span>
              </div>
            </div>
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/#chat-${chat.id}`}
                  className="flex flex-col px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                    {chat.title}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {chat.time}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* 底部導航區域 */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-1">
          {bottomItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
