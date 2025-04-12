// 引入必要的依賴
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import RootClientLayout from '@/components/layout/RootClientLayout';
import { Providers } from './providers';

// 設定 Inter 字體,只載入拉丁字集以優化效能
const inter = Inter({ subsets: ['latin'] });

// 定義網站的元數據，如標題、描述和圖標
export const metadata: Metadata = {
  title: 'EchoMind - 輔大專屬AI助手',
  description: '輔仁大學資管系專屬的AI助手，為您解答學業與生活問題',
  icons: {
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu6w1L1n_jpEO94b80gNhWHTvkpCtCHvui2Q&s',
  },
};

// 設定視口參數，控制在移動設備上的顯示方式
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // 防止用戶放大頁面
};

/**
 * 根佈局組件
 * 包含所有頁面共享的UI元素和提供者
 * @param {object} props - 組件屬性
 * @param {React.ReactNode} props.children - 子組件，代表頁面內容
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      {/* suppressHydrationWarning 防止客戶端與服務器端渲染不匹配的警告 */}
      <body className={`${inter.className} antialiased`}>
        {/* 應用全局字體和抗鋸齒效果 */}
        <Providers>
          {/* 全局提供者，包含主題和認證上下文 */}
          <RootClientLayout>
            {/* 客戶端根佈局，處理側邊欄和主要內容區域 */}
            {children}
          </RootClientLayout>
        </Providers>
      </body>
    </html>
  );
}
