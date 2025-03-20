import Link from 'next/link';

// 定義 NotFound 組件，用於顯示 404 錯誤頁面
export default function NotFound() {
  return (
    // 外層容器，設置為全屏高度並居中內容
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      {/* 內容容器，使用 flex 布局並設置間距 */}
      <div className="flex flex-col items-center space-y-4">
        {/* 404 圖示容器 */}
        <div className="relative h-24 w-24">
          {/* SVG 圖標，顯示 X 形狀 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="96"
            height="96"
            viewBox="0 0 24 24"
            className="text-gray-400 dark:text-gray-500"
          >
            <path
              fill="currentColor"
              d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8m3.707-11.707a.999.999 0 0 0-1.414 0L12 10.586l-2.293-2.293a.999.999 0 1 0-1.414 1.414L10.586 12l-2.293 2.293a.999.999 0 1 0 1.414 1.414L12 13.414l2.293 2.293a.999.999 0 1 0 1.414-1.414L13.414 12l2.293-2.293a.999.999 0 0 0 0-1.414"
            />
          </svg>
        </div>

        {/* 錯誤代碼 */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          404
        </h1>
        {/* 錯誤標題 */}
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          頁面開發中
        </h2>
        {/* 錯誤描述 */}
        <p className="text-center text-gray-600 dark:text-gray-400">
          抱歉，您訪問的頁面正在開發中。
          <br />
          請稍後再試或返回首頁。
        </p>

        {/* 返回首頁按鈕 */}
        <Link
          href="/"
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
}
