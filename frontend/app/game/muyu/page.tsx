"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// 定義主題類型
type Theme = {
  background: string; // 背景樣式
  textColor: string; // 文字顏色
};

// 定義主題集合類型
type ThemeSet = {
  name: string; // 主題名稱
  theme: Theme; // 主題樣式
  woodFish: {
    name: string; // 木魚名稱
    image: string; // 木魚圖片路徑
    size: number; // 木魚尺寸
  };
  sound: string; // 敲擊音效路徑
};

// 浮動數字組件：顯示點擊後的動畫效果
const FloatingNumber = ({
  x,
  y,
  theme,
}: {
  x: number; // X座標
  y: number; // Y座標
  theme: Theme; // 主題樣式
}) => (
  <div
    className={`absolute text-2xl font-bold pointer-events-none ${theme.textColor}`}
    style={{
      left: x,
      top: y,
      animation: "float 2s ease-out forwards",
      opacity: 1,
    }}
  >
    歐趴+1
  </div>
);

// 預設主題集合
const themeSets: ThemeSet[] = [
  {
    name: "傳統禪意",
    theme: {
      background: "bg-gradient-to-b from-[#0F1015] via-[#15161C] to-[#1A1B26]",
      textColor: "text-[#6B7280]",
    },
    woodFish: { name: "傳統木魚", image: "/images/muyu.png", size: 250 },
    sound: "/sounds/muyu.mp3",
  },
  {
    name: "金玉良緣",
    theme: {
      background: "bg-gradient-to-b from-gray-800 to-black",
      textColor: "text-amber-600",
    },
    woodFish: { name: "金邊木魚", image: "/images/muyu1.png", size: 250 },
    sound: "/sounds/muyu1.mp3",
  },
  {
    name: "現代禪風",
    theme: {
      background: "bg-gradient-to-b from-[#E8E4D9] to-[#D8C3A5]",
      textColor: "text-[#8B7E74]",
    },
    woodFish: { name: "玉石木魚", image: "/images/muyu2.png", size: 250 },
    sound: "/sounds/muyu2.mp3",
  },
];

export default function Home() {
  // 狀態管理
  const [count, setCount] = useState(0); // 計數器
  const [isAnimating, setIsAnimating] = useState(false); // 動畫狀態
  const [floatingNumbers, setFloatingNumbers] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]); // 浮動數字陣列
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null); // 音效物件
  const [currentSet, setCurrentSet] = useState(themeSets[1]); // 當前主題(為金玉良緣)

  // 當主題改變時更新音效
  useEffect(() => {
    setAudio(new Audio(currentSet.sound));
  }, [currentSet.sound]);

  // 添加全局動畫樣式
  useEffect(() => {
    // 創建樣式標籤
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      @keyframes float {
        0% {
          transform: translateY(0);
          opacity: 1;
        }
        100% {
          transform: translateY(-100px);
          opacity: 0;
        }
      }
      
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(0.95);
        }
        100% {
          transform: scale(1);
        }
      }
    `;
    // 添加到頭部
    document.head.appendChild(styleElement);

    // 清理函數
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
      className={`min-h-screen flex flex-col items-center justify-center ${currentSet.theme.background}`}
    >
      <h1
        className={`text-5xl font-bold mb-8 ${currentSet.theme.textColor} font-cute`}
      >
        歐趴木魚
      </h1>

      {/* 主題選擇按鈕 */}
      <div className="flex gap-4 mb-8">
        {themeSets.map((set) => (
          <button
            key={set.name}
            onClick={() => setCurrentSet(set)}
            className={`
              px-4 py-2 
              rounded-xl
              font-cute
              text-lg
              transition-all
              duration-200
              shadow-md
              hover:shadow-xl
              hover:scale-105
              ${
                currentSet.name === set.name
                  ? `${set.theme.background} text-white font-bold`
                  : `bg-white/90 hover:bg-white ${set.theme.textColor}`
              }
            `}
          >
            {set.name}
          </button>
        ))}
      </div>

      {/* 木魚圖片和點擊區域 */}
      <div
        className="relative"
        onClick={handleKnock}
        style={{
          animation: isAnimating ? "pulse 0.1s ease-in-out" : "none",
          willChange: "transform",
          cursor: `url('/bat.svg'), auto`,
        }}
      >
        <Image
          src={currentSet.woodFish.image}
          alt={currentSet.woodFish.name}
          width={currentSet.woodFish.size}
          height={currentSet.woodFish.size}
          draggable="false"
          className="rounded-full drop-shadow-lg hover:drop-shadow-2xl transition-shadow duration-300"
          style={{ willChange: "filter" }}
        />
        {/* 浮動數字動畫 */}
        {floatingNumbers.map((num) => (
          <FloatingNumber
            key={num.id}
            x={num.x}
            y={num.y}
            theme={currentSet.theme}
          />
        ))}
      </div>

      <div
        className={`mt-8 text-2xl font-bold font-cute ${currentSet.theme.textColor}`}
      >
        歐趴數：{count}
      </div>
    </div>
  );
}
