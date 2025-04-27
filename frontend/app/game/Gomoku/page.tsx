"use client";

import dynamic from 'next/dynamic';
import BackButton from "./src/components/BackButton";

// 動態導入App組件，關閉SSR以避免伺服器端渲染問題
const GomokuApp = dynamic(() => import('./src/App'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="text-2xl font-bold text-gray-600">載入中...</div>
    </div>
  )
});

export default function GomokuPage() {
  return (
    <div className="w-full relative">
      {/* 五子棋遊戲主體 */}
      <div className="w-full">
        <GomokuApp />
      </div>
      
      {/* 左上角返回按鈕 - 使用絕對定位 */}
      <div className="absolute top-4 left-4">
        <BackButton text="返回遊戲介紹" />
      </div>
    </div>
  );
} 