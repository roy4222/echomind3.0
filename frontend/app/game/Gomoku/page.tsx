"use client"; // 標記此組件為客戶端組件

// 引入必要的依賴
import dynamic from 'next/dynamic'; // 用於動態導入組件，為了減少初始加載時間
import BackButton from "./src/components/BackButton"; // 引入返回按鈕組件

// 動態導入五子棋遊戲的主要應用組件
// 使用dynamic import可以：
// 1. 減少初始bundle大小
// 2. 避免SSR相關問題， 因為使用Canva API但因為Canva API不支持SSR
// SSR是在伺服器端先渲染 React 組件產生完整的 HTML 傳給瀏覽器
// 3. 實現代碼分割
const GomokuApp = dynamic(() => import('./src/App'), {
  ssr: false, // 禁用伺服器端渲染
  loading: () => (
    // 載入過程中顯示的加載元素
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="text-2xl font-bold text-gray-600">載入中...</div>
    </div>
  )
});

// 五子棋遊戲頁面的主要組件
export default function GomokuPage() {
  return (
    // 容器元素，使用相對定位以配合子元素的絕對定位
    <div className="w-full relative">
      {/* 遊戲主體區域 */}
      <div className="w-full">
        <GomokuApp />
      </div>
      
      {/* 返回按鈕 - 使用絕對定位固定在左上角 */}
      <div className="absolute top-4 left-4">
        <BackButton text="返回遊戲介紹" />
      </div>
    </div>
  );
}