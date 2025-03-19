'use client';

import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { cn } from '@/lib/utils';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 處理視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      // 在大螢幕上自動開啟側邊欄
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    // 初始檢查
    handleResize();

    // 添加事件監聽
    window.addEventListener('resize', handleResize);

    // 清理事件監聽
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <main className={cn(
        "pt-20 transition-all duration-300",
        isSidebarOpen ? "lg:pl-64" : "lg:pl-20"
      )}>
        {children}
      </main>
    </div>
  );
} 