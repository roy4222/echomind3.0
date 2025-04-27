"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
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
    introPath: "/game/introduction?game=typing",
  },
  {
    id: "puzzle",
    name: "拼圖",
    description: "歐趴拼圖拼到歐趴",
    imageUrl: "/images/puzzle.png",
    darkImageUrl: "/images/puzzle-dark.png",
    introPath: "/game/introduction?game=puzzle",
  },
  {
    id: "breathe",
    name: "呼吸遊戲",
    description: "訓練放鬆與專注力",
    imageUrl: "/images/Breath-light.png",
    darkImageUrl: "/images/Breath-dark.png",
    introPath: "/game/introduction?game=Breath",
  },
  {
    id: "muyu",
    name: "敲木魚",
    description: "歐趴木魚敲到歐趴",
    imageUrl: "/images/woodenfish.png",
    darkImageUrl: "/images/woodenfish-dark.png",
    introPath: "/game/introduction?game=muyu",
  },
  {
    id: "whack-a-mole",
    name: "打地鼠",
    description: "歐趴打地鼠打到歐趴",
    imageUrl: "/images/whack-a-mole.png",
    darkImageUrl: "/images/whack-a-mole-dark.png",
    introPath: "/game/introduction?game=whack-a-mole",
  },
  {
    id: "SnakeGame",
    name: "貪吃蛇",
    description: "歐趴貪吃蛇吃到歐趴",
    imageUrl: "/images/SnakeGame.png",
    darkImageUrl: "/images/SnakeGame-dark.png",
    introPath: "/game/introduction?game=SnakeGame",
  },
  {
    id: "Gomoku",
    name: "五子棋",
    description: "歐趴五子棋下到歐趴",
    imageUrl: "/images/Gomoku.png",
    darkImageUrl: "/images/Gomoku-dark.png",
    introPath: "/game/introduction?game=Gomoku",
  },
];

// 在樣式部分添加防止文字選擇的 CSS 類
const noSelectStyles = {
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none",
  userSelect: "none",
};

export default function GamePage() {
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScroll, setStartScroll] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [hasDragged, setHasDragged] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);

  // 確保僅在客戶端渲染後才獲取主題資訊
  useEffect(() => {
    setMounted(true);
  }, []);

  // 自動滾動效果
  useEffect(() => {
    if (!scrollContainerRef.current || !autoScroll) return;

    const cardWidth = 256; // w-64 = 16rem = 256px
    const gap = 28; // space-x-7 = 1.75rem = 28px
    const totalWidth = cardWidth + gap;
    const numCards = games.length;

    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const newPosition = prev + 1;
        if (newPosition >= totalWidth * numCards) {
          setIsTransitioning(true);
          setTimeout(() => {
            setScrollPosition(0);
            setIsTransitioning(false);
          }, 0);
          return 0;
        }
        return newPosition;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [autoScroll]);

  // 滑鼠事件處理
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartScroll(scrollPosition);
    setAutoScroll(false);
    setHasDragged(false);
    setDragStartTime(Date.now());
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 5) {
      setHasDragged(true);
    }

    const newPosition = startScroll - deltaX;

    const cardWidth = 256;
    const gap = 28;
    const totalWidth = cardWidth + gap;
    const numCards = games.length;

    if (newPosition < 0) {
      setScrollPosition(0);
    } else if (newPosition >= totalWidth * numCards) {
      setScrollPosition(totalWidth * numCards);
    } else {
      setScrollPosition(newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const isDragGesture = hasDragged || Date.now() - dragStartTime > 200;

    setTimeout(() => {
      setAutoScroll(true);
    }, 50);
  };

  const handleWheel = (e: React.WheelEvent) => {
    setAutoScroll(false);

    const cardWidth = 256;
    const gap = 28;
    const totalWidth = cardWidth + gap;
    const numCards = games.length;

    const newPosition = scrollPosition + e.deltaY;

    if (newPosition < 0) {
      setScrollPosition(0);
    } else if (newPosition >= totalWidth * numCards) {
      setScrollPosition(totalWidth * numCards);
    } else {
      setScrollPosition(newPosition);
    }

    // 重置自動滾動計時器
    setTimeout(() => {
      setAutoScroll(true);
    }, 3000);
  };

  // 新增卡片點擊處理函數
  const handleCardClick = (path: string, e: React.MouseEvent) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    window.location.href = path;
  };

  // 根據當前主題選擇圖片
  const getImageUrl = (game: any) => {
    if (!mounted) return game.imageUrl;

    const isDarkMode = theme === "dark" || resolvedTheme === "dark";
    return isDarkMode && game.darkImageUrl ? game.darkImageUrl : game.imageUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-indigo-700 dark:text-indigo-300">
          EchoMind 遊戲中心
        </h1>
        <p className="text-lg text-center mb-9 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          在學習之餘，享受一些休閒時光。透過遊戲放鬆心情，提升專注力。
        </p>
        <p className="text-base text-center mb-1 text-gray-400 dark:text-gray-700 opacity-60 mx-auto">
          手動拖移遊戲卡片
        </p>

        {/* 自動滾動的遊戲選單 */}
        <div
          className="mb-16 overflow-hidden relative select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          <div
            ref={scrollContainerRef}
            className="flex space-x-7 py-4 select-none"
            style={{
              transform: `translateX(-${scrollPosition}px)`,
              transition: isTransitioning ? "none" : "transform 0.01s linear",
            }}
          >
            {/* 第一組遊戲卡片 */}
            {games.map((game) => (
              <motion.div
                key={game.id}
                className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer select-none"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => handleCardClick(game.introPath, e)}
              >
                <div className="h-40 bg-gray-200 dark:bg-gray-700 relative select-none">
                  {(game.imageUrl || game.darkImageUrl) && mounted && (
                    <Image
                      src={getImageUrl(game)}
                      alt={game.name}
                      fill
                      className="object-cover select-none"
                      draggable="false"
                    />
                  )}
                </div>
                <div className="p-4 select-none">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    {game.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {game.description}
                  </p>
                  <div className="inline-flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                    查看詳情
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </motion.div>
            ))}
            {/* 第二組遊戲卡片（用於無縫循環） */}
            {games.map((game) => (
              <motion.div
                key={`${game.id}-clone`}
                className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer select-none"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => handleCardClick(game.introPath, e)}
              >
                <div className="h-40 bg-gray-200 dark:bg-gray-700 relative select-none">
                  {(game.imageUrl || game.darkImageUrl) && mounted && (
                    <Image
                      src={getImageUrl(game)}
                      alt={game.name}
                      fill
                      className="object-cover select-none"
                      draggable="false"
                    />
                  )}
                </div>
                <div className="p-4 select-none">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    {game.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {game.description}
                  </p>
                  <div className="inline-flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                    查看詳情
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 原有的網格選單 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <motion.div
              key={game.id}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl cursor-pointer"
              whileHover={{ y: -5 }}
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
              onClick={() => (window.location.href = game.introPath)}
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

                <div className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium">
                  查看詳情
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
