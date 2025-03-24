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

export const metadata: Metadata = {
  title: 'EchoMind - 輔大專屬AI助手',
  description: '輔仁大學資管系專屬的AI助手，為您解答學業與生活問題',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <RootClientLayout>
            {children}
          </RootClientLayout>
        </Providers>
      </body>
    </html>
  );
}
