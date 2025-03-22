'use client'; // 標記此組件為客戶端組件

// 導入必要的組件和函數
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ClientLayout from "@/components/layout/ClientLayout";
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { initializeAuthListener } from '@/lib/utils/auth';
import { AuthProvider } from '@/contexts/AuthContext';

/**
 * RootClientLayout 組件的 Props 介面定義
 * @interface RootClientLayoutProps
 * @property {React.ReactNode} children - 子組件
 */
interface RootClientLayoutProps {
  children: React.ReactNode;
}

/**
 * 根客戶端布局組件
 * 提供主題、認證狀態和通知功能的全局配置
 * @param {RootClientLayoutProps} props - 組件屬性
 * @returns {JSX.Element} 渲染的組件
 */
export default function RootClientLayout({ children }: RootClientLayoutProps) {
  useEffect(() => {
    // 初始化認證監聽器，監聽用戶登入狀態變化
    const unsubscribe = initializeAuthListener((user) => {
      // 用戶狀態改變時的回調函數
      console.log('認證狀態更新:', user ? '已登入' : '未登入');
    });

    // 組件卸載時清理認證監聽器
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
      <AuthProvider>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Toaster richColors position="top-right" /> {/* 全局通知組件 */}
      </AuthProvider>
    </ThemeProvider>
  );
} 