import { Greeting } from "@/components/ui/Greeting";
import { Sparkles, Send, Search, Lightbulb } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-hidden">
        <div className="relative flex h-full flex-col bg-dot-pattern dark:bg-dot-pattern-dark">
          {/* 主要內容區域 */}
          <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4">
            <div className="w-full max-w-3xl space-y-8 py-12">
              <Greeting />
              
              {/* 搜尋框 */}
              <div className="flex w-full items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="詢問任何問題..."
                    className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 pr-10 text-gray-900 shadow-sm backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:bg-gray-800"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    按下 Enter 發送
                  </div>
                </div>
                <button className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/35 dark:from-blue-400 dark:to-blue-500">
                  <Send className="h-5 w-5" />
                </button>
              </div>

              {/* 快速操作按鈕 */}
              <div className="flex flex-wrap justify-center gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/50 px-4 py-2.5 text-sm text-gray-600 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800">
                  <Search className="h-4 w-4" />
                  <span>搜尋知識庫</span>
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/50 px-4 py-2.5 text-sm text-gray-600 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800">
                  <Sparkles className="h-4 w-4" />
                  <span>生成圖片</span>
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/50 px-4 py-2.5 text-sm text-gray-600 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800">
                  <Lightbulb className="h-4 w-4" />
                  <span>智能助手</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}