"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import BackButton from "../typing/components/BackButton";

// 導入類型和常量
import { themeSets } from "./components/types";

// 導入組件
import ThemeSelector from "./components/ThemeSelector";
import WoodFishClickArea from "./components/WoodFishClickArea";
import Counter from "./components/Counter";
import AnimationStyles from "./components/AnimationStyles";

/**
 * 木魚頁面主組件
 * 提供敲擊木魚計數、主題切換等功能
 */
export default function Home() {
  // 狀態管理
  const [count, setCount] = useState(0); // 計數器
  const [isAnimating, setIsAnimating] = useState(false); // 動畫狀態
  const [floatingNumbers, setFloatingNumbers] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]); // 浮動數字陣列
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null); // 音效物件
  const [currentSet, setCurrentSet] = useState(themeSets[1]); // 當前主題
  const [mounted, setMounted] = useState(false); // 確保客戶端渲染
  const { theme, resolvedTheme } = useTheme(); // 獲取系統主題

  // 確保僅在客戶端渲染後才獲取主題資訊
  useEffect(() => {
    setMounted(true);
  }, []);

  // 根據系統主題自動選擇主題樣式
  useEffect(() => {
    if (!mounted) return;

    const isDarkMode = theme === "dark" || resolvedTheme === "dark";
    if (isDarkMode) {
      // 深色模式使用金玉良緣
      setCurrentSet(themeSets[1]);
    } else {
      // 淺色模式使用現代禪風
      setCurrentSet(themeSets[2]);
    }
  }, [theme, resolvedTheme, mounted]);

  // 當主題改變時更新音效
  useEffect(() => {
    setAudio(new Audio(currentSet.sound));
  }, [currentSet.sound]);

  // 處理敲擊事件
  const handleKnock = (e: React.MouseEvent<HTMLDivElement>) => {
    // 計算點擊位置
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    // 播放音效
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }

    // 更新計數器
    setCount((prev) => prev + 1);

    // 觸發動畫效果
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 100);

    // 新增浮動數字
    setFloatingNumbers((prev) => [...prev, { id, x, y }]);

    // 2秒後移除浮動數字 (與動畫時間相符)
    setTimeout(() => {
      setFloatingNumbers((prev) => prev.filter((num) => num.id !== id));
    }, 2000);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start ${currentSet.theme.background}`}
    >
      {/* 添加全局動畫樣式 */}
      <AnimationStyles />

      {/* 返回按鈕區域 */}
      <div className="flex justify-start w-full pl-4 mt-4">
        <BackButton text="返回遊戲介紹" />
      </div>

      {/* 頁面標題 */}
      <h1
        className={`text-5xl font-bold mb-8 ${currentSet.theme.textColor} font-cute`}
      >
        歐趴木魚
      </h1>

      {/* 主題選擇區域 */}
      <ThemeSelector
        themes={themeSets}
        currentTheme={currentSet}
        onThemeChange={setCurrentSet}
      />

      {/* 木魚點擊區域 */}
      <WoodFishClickArea
        woodFish={currentSet.woodFish}
        isAnimating={isAnimating}
        onClick={handleKnock}
        floatingNumbers={floatingNumbers}
        theme={currentSet.theme}
      />

      {/* 計數器顯示 */}
      <Counter count={count} textColor={currentSet.theme.textColor} />
    </div>
  );
}
