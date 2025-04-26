"use client";

import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

// 定義遊戲資訊類型
interface GameInfo {
  name: string;
  description: string;
  longDescription: string;
  features: string[];
  imageUrl: string;
  darkImageUrl: string;
}

// 遊戲資訊
const gameInfo: Record<string, GameInfo> = {
  typing: {
    name: "打字遊戲",
    description: "快打旋風",
    longDescription:
      "透過有趣的打字遊戲提升您的打字速度和準確度。遊戲會根據您的程度自動調整難度，讓您在享受遊戲的同時不斷進步。",
    features: [
      "即時速度和準確度統計",
      "多種難度等級",
      "自定義文字練習",
      "競賽模式",
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
    features: ["真實音效", "計數統計", "成就系統", "排行榜"],
    imageUrl: "/images/woodenfish.png",
    darkImageUrl: "/images/woodenfish-dark.png",
  },
  "whack-a-mole": {
    name: "打地鼠",
    description: "訓練反應力",
    longDescription:
      "經典的打地鼠遊戲，考驗您的反應速度和手眼協調能力。遊戲難度會隨著您的表現逐漸提升。",
    features: ["多種難度模式", "計分系統", "特殊道具", "排行榜"],
    imageUrl: "/images/whack-a-mole.png",
    darkImageUrl: "/images/whack-a-mole-dark.png",
  },
  "memory-game": {
    name: "記憶拼圖",
    description: "訓練記憶力與專注力",
    longDescription:
      "考驗記憶力的翻牌遊戲，需要記住卡片的位置並配對相同的圖案。適合所有年齡層的玩家。",
    features: ["多種圖案主題", "難度調整", "計時模式", "配對動畫"],
    imageUrl: "/images/memory-game.png",
    darkImageUrl: "/images/memory-game-dark.png",
  },
  "circle-circle": {
    name: "圈圈差差",
    description: "訓練邏輯",
    longDescription:
      "經典的圈圈叉叉遊戲，加入了新的玩法和特殊規則。可以和電腦對戰或和朋友一起玩。",
    features: ["AI對戰", "多人模式", "特殊規則", "戰績統計"],
    imageUrl: "/images/circle-circle.png",
    darkImageUrl: "/images/circle-circle-dark.png",
  },
};

export default function GameIntroduction() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("game");
  const game = gameId ? gameInfo[gameId] : null;
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // 確保僅在客戶端渲染後才獲取主題資訊
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 根據當前主題選擇圖片
  const getImageUrl = (game: GameInfo) => {
    if (!mounted) return game.imageUrl;
    
    const isDarkMode = theme === "dark" || resolvedTheme === "dark";
    return isDarkMode && game.darkImageUrl ? game.darkImageUrl : game.imageUrl;
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            找不到遊戲資訊
          </h1>
          <Link
            href="/game"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            <ArrowLeft className="mr-2" size={20} />
            返回遊戲列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <Link
          href="/game"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-8"
        >
          <ArrowLeft className="mr-2" size={20} />
          返回遊戲列表
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-64 md:h-96">
            {mounted && (
              <Image
                src={getImageUrl(game)}
                alt={game.name}
                fill
                className="object-cover"
              />
            )}
          </div>

          <div className="p-8">
            <motion.h1
              className="text-4xl font-bold text-gray-800 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {game.name}
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {game.longDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                遊戲特色
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {game.features.map((feature: string, index: number) => (
                  <motion.li
                    key={index}
                    className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
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

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link
                href={`/game/${gameId}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
              >
                開始遊戲
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
