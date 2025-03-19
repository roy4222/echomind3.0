'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  MessageSquare,
  Settings,
  HelpCircle,
  Bot,
  X
} from 'lucide-react';

// 定義側邊欄項目的介面
interface SidebarItem {
  icon: typeof Home;
  label: string;
  href: string;
}

// 定義側邊欄的 Props 介面
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// 側邊欄導航項目
const sidebarItems: SidebarItem[] = [
  {
    icon: Home,
    label: '首頁',
    href: '/',
  },
  {
    icon: MessageSquare,
    label: '匿名留言板',
    href: '/anonymous',
  },
  {
    icon: Home,
    label: '小遊戲',
    href: '/games',
  },
];

// 底部導航項目
const bottomItems: SidebarItem[] = [
  {
    icon: HelpCircle,
    label: '幫助',
    href: '/help',
  },
  {
    icon: Settings,
    label: '設定',
    href: '/settings',
  },
];

// Sidebar 組件
const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  // 導航項目組件
  const NavItem: FC<{ item: SidebarItem }> = ({ item }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          isActive && 'bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400',
          !isActive && 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50'
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span className={cn(
          "font-medium transition-all duration-300",
          !isOpen && "lg:hidden"
        )}>{item.label}</span>
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
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {sidebarItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
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
