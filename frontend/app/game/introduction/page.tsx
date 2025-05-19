"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

// ===== 類型定義 =====
// 定義遊戲資訊類型
interface GameInfo {
  name: string;
  description: string;
  longDescription: string;
  features: string[];
  imageUrl: string;
  darkImageUrl: string;
}

// ===== 遊戲資訊數據 =====
const gameInfo: Record<string, GameInfo> = {
  typing: {
    name: "打字遊戲",
    description: "快打旋風",
    longDescription:
      "透過有趣的打字遊戲提升您的打字速度和準確度。可以根據自己的程度選擇難度，讓您在享受遊戲的同時不斷進步。",
    features: [
      "即時速度和準確度統計",
      "多種速度等級",
      "文字模式可選",
      "多種主題",
    ],
    imageUrl: "/images/typing.png",
    darkImageUrl: "/images/typing-dark.png",
  },
  puzzle: {
    name: "拼圖",
    description: "訓練記憶力與專注力",
    longDescription:
      "經典的拼圖遊戲，透過組合碎片來完成完整的圖像。遊戲提供多種難度和主題，適合所有年齡層的玩家。",
    features: ["多種圖片主題", "可調整難度", "計時挑戰", "進度保存"],
    imageUrl: "/images/puzzle.png",
    darkImageUrl: "/images/puzzle-dark.png",
  },
  Breath: {
    name: "呼吸遊戲",
    description: "訓練放鬆與專注力",
    longDescription:
      "透過引導式的呼吸練習，幫助您放鬆心情、減輕壓力。配合視覺和聲音效果，讓呼吸練習更加輕鬆有趣。",
    features: ["多種呼吸模式", "自定義節奏", "放鬆音樂"],
    imageUrl: "/images/Breath-light.png",
    darkImageUrl: "/images/Breath-dark.png",
  },
  muyu: {
    name: "敲木魚",
    description: "歐趴木魚敲到歐趴",
    longDescription:
      "現代化的電子木魚體驗，結合傳統與科技。每次敲擊都會產生優美的音效，幫助您沉澱心靈。",
    features: ["真實音效", "計數統計", "十分解壓", "多種主題"],
    imageUrl: "/images/woodenfish.png",
    darkImageUrl: "/images/woodenfish-dark.png",
  },
  "whack-a-mole": {
    name: "打地鼠",
    description: "訓練反應力",
    longDescription:
      "經典的打地鼠遊戲，考驗您的反應速度和手眼協調能力。遊戲難度會隨著您的表現逐漸提升。",
    features: ["多種難度模式", "計分系統", "特殊道具", "排行榜"],
    imageUrl: "/images/whack-a-mole-light.png",
    darkImageUrl: "/images/whack-a-mole-dark.png",
  },
  SnakeGame: {
    name: "貪吃蛇",
    description: "歐趴貪吃蛇吃到歐趴",
    longDescription: "經典貪吃蛇遊戲，放鬆身心，享受遊戲的樂趣。",
    features: ["多種模式", "可調整難度", "計時挑戰", "進度保存"],
    imageUrl: "/images/SnakeGame.png",
    darkImageUrl: "/images/SnakeGame-dark.png",
  },
  Gomoku: {
    name: "五子棋",
    description: "訓練邏輯",
    longDescription:
      "經典的五子棋遊戲，加入了新的玩法和特殊規則。可以和電腦對戰一起玩。",
    features: ["AI對戰", "特殊規則", "戰績統計"],
    imageUrl: "/images/Gomoku.png",
    darkImageUrl: "/images/Gomoku-dark.png",
  },
  bingo: {
    name: "賓果",
    description: "訓練專注力",
    longDescription:
      "經典的賓果遊戲，透過隨機抽號碼並標記數字，看誰最快連成一條線獲勝。",
    features: ["經典模式", "快速模式", "挑戰模式", "連線動畫"],
    imageUrl: "/images/bingo-light.png",
    darkImageUrl: "/images/bingo-dark.png",
  },
};

export default function GameIntroduction() {
  // ===== 狀態和參數 =====
  const searchParams = useSearchParams();
  const gameId = searchParams.get("game");
  const game = gameId ? gameInfo[gameId] : null;

  // 主題相關
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ===== Hooks =====
  // 確保僅在客戶端渲染後才獲取主題資訊
  useEffect(() => {
    setMounted(true);
  }, []);

  // ===== 工具函數 =====
  // 根據當前主題選擇圖片
  const getImageUrl = (game: GameInfo) => {
    if (!mounted) return game.imageUrl;
    const isDarkMode = theme === "dark" || resolvedTheme === "dark";
    return isDarkMode && game.darkImageUrl ? game.darkImageUrl : game.imageUrl;
  };

  // ===== 動畫屬性 =====
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  // ===== 頁面渲染 =====
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-4">
      <div className="container mx-auto px-4 md:px-40">
        {/* 返回按鈕 */}
        <Link
          href="/game"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-4"
        >
          <ArrowLeft className="mr-1" size={20} />
          返回遊戲列表
        </Link>

        {/* 遊戲卡片 */}
        {game && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden max-w-6xl mx-auto">
            {/* 遊戲封面圖片 */}
            <div className="relative h-60 md:h-52">
              {mounted && (
                <Image
                  src={getImageUrl(game)}
                  alt={game.name}
                  fill
                  className="object-contain"
                />
              )}
            </div>

            {/* 遊戲詳細信息 */}
            <div className="p-6">
              {/* 遊戲標題 */}
              <motion.h1
                className="text-3xl font-bold text-gray-800 dark:text-white mb-3"
                {...fadeInUp}
              >
                {game.name}
              </motion.h1>

              {/* 遊戲描述 */}
              <motion.p
                className="text-lg text-gray-600 dark:text-gray-300 mb-6"
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {game.longDescription}
              </motion.p>

              {/* 遊戲特色區塊 */}
              <motion.div
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  遊戲特色
                </h2>
                {/* 特色列表 */}
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {game.features.map((feature: string, index: number) => (
                    <motion.li
                      key={index}
                      className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-xl p-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="h-2 w-2 bg-indigo-500 rounded-full mr-3" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* 開始遊戲按鈕 */}
              <motion.div
                className="mt-6"
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link
                  href={`/game/${gameId}`}
                  className="inline-flex items-center justify-center px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-200"
                >
                  開始遊戲
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
