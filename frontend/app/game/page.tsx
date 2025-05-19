"use client";

import { useState, useEffect, useRef } from "react";  // 狀態管理
import Image from "next/image";  
import { motion } from "framer-motion"; // 懸停動畫:卡片的縮放和上浮效果
import { ArrowRight } from "lucide-react"; // 圖示
import { useTheme } from "next-themes"; // 主題偵測

// 卡片尺寸和間距常數
const CARD_WIDTH = 256; // w-64 = 16rem = 256px
const CARD_GAP = 28; // space-x-7 = 1.75rem = 28px
const TOTAL_WIDTH = CARD_WIDTH + CARD_GAP;

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
    description: "訓練反應力",
    imageUrl: "/images/whack-a-mole-light.png",
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
  {
    id: "bingo",
    name: "賓果",
    description: "訓練專注力",
    imageUrl: "/images/bingo-light.png",
    darkImageUrl: "/images/bingo-dark.png",
    introPath: "/game/introduction?game=bingo",
  },
];

export default function GamePage() {
  // ===== 狀態管理 =====
  // 主題相關
  const { theme, resolvedTheme } = useTheme(); // 使用 next-themes 提供的主題相關 hook
  const [mounted, setMounted] = useState(false); // 用於確認組件是否已掛載
  
  // 遊戲卡片相關
  const [hoveredGame, setHoveredGame] = useState<string | null>(null); // 追蹤目前滑鼠懸停的遊戲卡片
  
  // 滾動相關
  const scrollContainerRef = useRef<HTMLDivElement>(null); // 滾動容器的 ref
  const [scrollPosition, setScrollPosition] = useState(0); // 目前滾動位置
  const [isTransitioning, setIsTransitioning] = useState(false); // 是否正在過渡動畫中
  const [autoScroll, setAutoScroll] = useState(true); // 是否開啟自動滾動
  
  // 拖動相關
  const [isDragging, setIsDragging] = useState(false); // 是否正在拖曳中
  const [startX, setStartX] = useState(0); // 拖曳開始的 X 座標
  const [startScroll, setStartScroll] = useState(0); // 拖曳開始時的滾動位置
  const [hasDragged, setHasDragged] = useState(false); // 是否已經進行過拖曳

  // ===== 單一功能 Hooks =====
  // 確保僅在客戶端渲染後才獲取主題資訊
  useEffect(() => {
    setMounted(true);
  }, []);

  // 根據當前主題選擇圖片
  // 根據當前主題選擇圖片
  const getImageUrl = (game: any) => {
    if (!mounted) return game.imageUrl;

    const isDarkMode = theme === "dark" || resolvedTheme === "dark";
    return isDarkMode && game.darkImageUrl ? game.darkImageUrl : game.imageUrl;
  };

  // 計算滾動邊界
  // 確保滾動位置在有效範圍內,避免超出邊界
  const calculateScrollBounds = (position: number) => {
    const numCards = games.length;
    const maxScrollPosition = TOTAL_WIDTH * numCards;

    if (position < 0) {
      return 0;
    } else if (position >= maxScrollPosition) {
      return maxScrollPosition;
    }
    return position;
  };


  // ===== 滾動相關功能 =====
  // 自動滾動效果
  useEffect(() => {
    if (!scrollContainerRef.current || !autoScroll) return;

    const numCards = games.length;
    const maxScrollPosition = TOTAL_WIDTH * numCards;

    // 自動滾動邏輯
    // 每10毫秒移動1像素,實現平滑滾動效果
    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        // 當滾動到末尾時重置位置
        const newPosition = prev + 1;
        if (newPosition >= maxScrollPosition) {
          // 設置過渡動畫標記,避免重置時的跳動感
          setIsTransitioning(true);
          setTimeout(() => {
            setScrollPosition(0);
            setIsTransitioning(false);
          }, 0);
          return 0;
        }
        return newPosition;
      });
    }, 10); // 每10毫秒移動1像素

    return () => clearInterval(interval);
  }, [autoScroll]);

  // ===== 滑鼠事件處理函數 =====
  // 滑鼠按下時：開始拖動，記錄起始位置
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartScroll(scrollPosition);
    setAutoScroll(false); // 停止自動滾動
    setHasDragged(false); // 重置拖曳狀態
  };

  // 滑鼠移動時：計算滑動距離，更新滾動位置
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    // 判斷是否達到拖曳閾值(5px),避免誤觸
    if (Math.abs(deltaX) > 5) {
      setHasDragged(true);
    }

    // 計算新的滾動位置並確保在有效範圍內
    const newPosition = startScroll - deltaX;
    setScrollPosition(calculateScrollBounds(newPosition));
  };

  // 滑鼠釋放時：停止拖動，恢復自動滾動
  const handleMouseUp = () => {
    setIsDragging(false);
    // 延遲恢復自動滾動,避免與點擊事件衝突
    setTimeout(() => {
      setAutoScroll(true);
    }, 50);
  };

  // 滑鼠滾輪事件：停止自動滾動，手動滾動
  const handleWheel = (e: React.WheelEvent) => {
    setAutoScroll(false);
    const newPosition = scrollPosition + e.deltaY;
    setScrollPosition(calculateScrollBounds(newPosition));

    // 3秒後恢復自動滾動
    setTimeout(() => {
      setAutoScroll(true);
    }, 3000);
  };

  // 卡片點擊處理函數
  // 如果正在拖曳中,阻止點擊事件
  const handleCardClick = (path: string, e: React.MouseEvent) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    window.location.href = path;
  };

  // ===== 渲染函數 =====
  // 渲染滾動遊戲的卡片 
  // isClone參數用於標記是否為複製卡片(用於無縫滾動)
  const renderScrollCard = (
    game: (typeof games)[0],
    isClone: boolean = false
  ) => {
    const key = isClone ? `${game.id}-clone` : game.id;

    return (
      <motion.div
        key={key}
        className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer select-none"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => handleCardClick(game.introPath, e)}
      >
        <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
          {mounted && (
            <Image
              src={getImageUrl(game)}
              alt={game.name}
              fill
              className="object-cover"
              draggable="false"
            />
          )}
        </div>
        <div className="p-4">
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
    );
  };

  // 渲染網格選單的卡片
  const renderGridCard = (game: (typeof games)[0]) => (
    <motion.div
      key={game.id}
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl cursor-pointer select-none"
      whileHover={{ y: -5 }} // 懸停時向上移動5px
      onMouseEnter={() => setHoveredGame(game.id)}
      onMouseLeave={() => setHoveredGame(null)}
      onClick={() => (window.location.href = game.introPath)}
    >
      <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
        {mounted && (
          <Image
            src={getImageUrl(game)}
            alt={game.name}
            fill
            className="object-cover"
            draggable="false"
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
  );

  // ===== 頁面渲染 =====
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
          可按住拖移遊戲卡片
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
            className="flex space-x-7 py-4"
            style={{
              transform: `translateX(-${scrollPosition}px)`,
              transition: isTransitioning ? "none" : "transform 0.01s linear",
            }}
          >
            {/* 第一組遊戲卡片 */}
            {games.map((game) => renderScrollCard(game))}

            {/* 第二組遊戲卡片（用於無縫循環） */}
            {games.map((game) => renderScrollCard(game, true))}
          </div>
        </div>

        {/* 原有的網格選單 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map(renderGridCard)}
        </div>
      </div>
    </div>
  );
}
