'use client';

import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { cn } from '@/lib/utils';

// ClientLayout 組件：處理整體佈局，包括側邊欄和主內容區
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 控制側邊欄開關狀態
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 處理視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      // 在大螢幕（寬度 >= 1024px）上自動開啟側邊欄
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    // 初始檢查視窗大小
    handleResize();

    // 添加視窗大小變化的事件監聽器
    window.addEventListener('resize', handleResize);

    // 組件卸載時清理事件監聽器
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* 頁面頂部的 Header 組件 */}
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
      />
      {/* 側邊欄組件 */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      {/* 主內容區 */}
      <main className={cn(
        "pt-20 transition-all duration-300",
        // 根據側邊欄狀態動態調整左側內邊距
        isSidebarOpen ? "lg:pl-64" : "lg:pl-20"
      )}>
        {children}
      </main>
    </div>
  );
} 