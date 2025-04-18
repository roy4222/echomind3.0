"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";

// 遊戲列表數據
const games = [
  {
    id: "typing",
    name: "打字遊戲",
    description: "快打旋風",
    imageUrl: "/images/typing.png",
    darkImageUrl: "/images/typing-dark.png",
    path: "/game/typing",
  },
  {
    id: "puzzle",
    name: "拼圖",
    description: "訓練記憶力與專注力",
    imageUrl: "/images/puzzle.png",
    darkImageUrl: "/images/puzzle-dark.png",
    path: "/game/puzzle",
  },
  {
    id: "breathe",
    name: "呼吸遊戲",
    description: "訓練記憶力與專注力",
    imageUrl: "/images/breathe.png",
    darkImageUrl: "/images/breathe-dark.png",
    path: "/game/breathe",
  },
  {
    id: "muyu",
    name: "敲木魚",
    description: "歐趴木魚敲到歐趴",
    imageUrl: "/images/woodenfish.png",
    darkImageUrl: "/images/woodenfish-dark.png",
    path: "/game/muyu",
  },
  {
    id: "whack-a-mole",
    name: "打地鼠",
    description: "訓練反應力",
    imageUrl: "/images/whack-a-mole.png",
    darkImageUrl: "/images/whack-a-mole-dark.png",
    path: "/game/whack-a-mole",
  },
  {
    id: "memory-game",
    name: "記憶拼圖",
    description: "訓練記憶力與專注力",
    imageUrl: "/images/memory-game.png",
    darkImageUrl: "/images/memory-game-dark.png",
    path: "/game/memory-game",
  },
];

export default function GamePage() {
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 確保僅在客戶端渲染後才獲取主題資訊
  useEffect(() => {
    setMounted(true);
  }, []);

  // 根據當前主題選擇圖片
  const getImageUrl = (game: any) => {
    if (!mounted) return game.imageUrl; // 默認返回亮色模式圖片

    const isDarkMode = theme === "dark" || resolvedTheme === "dark";
    return isDarkMode && game.darkImageUrl ? game.darkImageUrl : game.imageUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-indigo-700 dark:text-indigo-300">
          EchoMind 遊戲中心
        </h1>
        <p className="text-lg text-center mb-12 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          在學習之餘，享受一些休閒時光。透過遊戲放鬆心情，提升專注力。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <motion.div
              key={game.id}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
              whileHover={{ y: -5 }}
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                {(game.imageUrl || game.darkImageUrl) && mounted && (
                  <Image
                    src={getImageUrl(game)}
                    alt={game.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {game.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {game.description}
                </p>

                <Link
                  href={game.path}
                  className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium"
                >
                  開始遊戲
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
