'use client';

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ClientLayout from "@/components/layout/ClientLayout";
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { initializeAuthListener } from '@/lib/utils/auth';

interface RootClientLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function RootClientLayout({ children, className }: RootClientLayoutProps) {
  useEffect(() => {
    // 初始化認證監聽器
    const unsubscribe = initializeAuthListener((user) => {
      // 用戶狀態改變時的回調
      console.log('認證狀態更新:', user ? '已登入' : '未登入');
    });

    // 清理函數
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClientLayout>
        {children}
      </ClientLayout>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
} 