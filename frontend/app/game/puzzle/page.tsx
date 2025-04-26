'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function HomePage() {
  // 狀態管理
  const [selectedTheme, setSelectedTheme] = useState('') // 儲存使用者選擇的主題
  const [difficulty, setDifficulty] = useState(4) // 儲存難度等級，預設為 4x4
  const [animation, setAnimation] = useState(false) // 控制頁面載入動畫

  // 頁面載入動畫效果
  // 初次渲染時將 animation 設為 true，觸發淡入動畫
  useEffect(() => {
    setAnimation(true)
  }, [])

  // 拼圖主題資料
  const themes = [
    { id: '1', name: 're0 愛蜜莉雅', image: '/images/1.png' },
    { id: '2', name: '間諜家家酒', image: '/images/4.png' },
    { id: '3', name: '敗北女角太多了', image: '/images/3.png' },
    { id: '4', name: '孤獨搖滾', image: '/images/2.png' }
  ]

  // 難度選項設定
  const difficulties = [
    { value: 3, label: '簡單 (3 x 3)' },
    { value: 4, label: '普通 (4 x 4)' },
    { value: 5, label: '困難 (5 x 5)' },
    { value: 6, label: '專家 (6 x 6)' }
  ]

  return (
    // 主容器：全寬，只有垂直方向上的間距，使用動畫效果
    <div className={`w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 min-h-screen transition-all duration-700 ${animation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      {/* 頁面標題：懸停時變色效果，精確控制陰影 */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md py-6 mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200 transition-all duration-500 hover:scale-105">拼圖遊戲</h1>
      </div>
      
      {/* 主題選擇區塊 - 中央內容區域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">選擇主題</h2>
        {/* 主題網格：在小螢幕顯示 2 欄，中等以上顯示 4 欄 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* 遍歷並渲染每個主題選項 */}
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              // 條件式類名：選中時套用深灰色邊框和背景，未選中時有 hover 效果
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-white dark:bg-gray-700 ${
                selectedTheme === theme.id ? 'border-gray-800 dark:border-gray-400 shadow-md bg-gray-50 dark:bg-gray-600' : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              {/* 圖片容器：固定高度並處理溢出 */}
              <div className="relative w-full h-64 mb-4 overflow-hidden rounded-md shadow-sm">
                {/* Next.js 最佳化的圖片元件，懸停時放大效果 */}
                <Image 
                  src={theme.image} 
                  alt={theme.name} 
                  fill 
                  style={{objectFit: 'cover'}} 
                  sizes="(max-width: 768px) 100vw, 25vw"
                  priority // 優先載入可見圖片
                  className="transition-transform duration-500 hover:scale-110"
                />
              </div>
              {/* 主題名稱 */}
              <p className="text-center font-medium text-gray-800 dark:text-gray-200 text-lg">{theme.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* 難度選擇區塊 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl shadow-md py-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">選擇難度</h2>
        {/* 彈性布局，在中心對齊並添加間距 */}
        <div className="flex flex-wrap justify-center gap-4">
          {/* 遍歷並渲染每個難度選項 */}
          {difficulties.map((diffItem) => (
            <button
              key={diffItem.value}
              onClick={() => setDifficulty(diffItem.value)}
              // 條件式類名：選中時套用深灰色背景和放大效果，未選中時顯示邊框和 hover 效果
              className={`px-5 py-3 rounded-full transition-all duration-300 ${
                difficulty === diffItem.value 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold shadow-md transform scale-105' 
                  : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 hover:border-gray-400 dark:hover:border-gray-400'
              }`}
            >
              {diffItem.label}
            </button>
          ))}
        </div>
      </div>

      {/* 開始遊戲按鈕區塊 */}
      <div className="flex flex-col items-center gap-4 mb-16">
        {/* Next.js Link 元件，用於頁面導航，傳遞主題和難度參數 */}
        <Link
          href={`/game/puzzle/app/game?theme=${selectedTheme}&difficulty=${difficulty}`}
          // 條件式類名：根據是否選中主題應用不同樣式
          className={`px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 transform ${
            selectedTheme 
              ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:from-gray-800 hover:to-gray-900' 
              : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
          aria-disabled={!selectedTheme} // 無障礙屬性，指示按鈕是否可用
        >
          {/* 動態文字：根據是否選擇主題顯示不同提示 */}
          {selectedTheme ? (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              開始遊戲
            </span>
          ) : '請先選擇主題'}
        </Link>
      </div>
      
      {/* 頁腳 */}
      <footer className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-inner py-4 text-center text-gray-600 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} 拼圖遊戲 - 使用 Next.js 開發</p>
        </div>
      </footer>
    </div>
  )
}