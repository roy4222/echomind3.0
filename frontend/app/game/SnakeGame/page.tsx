"use client";

import dynamic from 'next/dynamic';

// 動態導入App組件，關閉SSR以避免伺服器端渲染問題
const SnakeGameApp = dynamic(() => import('./src/App'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="text-2xl font-bold text-gray-600">載入中...</div>
    </div>
  )
});

export default function SnakeGamePage() {
  return <SnakeGameApp />;
} 