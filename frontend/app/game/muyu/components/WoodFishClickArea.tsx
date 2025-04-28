import Image from "next/image";
import { Theme, ThemeSet } from "./types";
import FloatingNumber from "./FloatingNumber";

/**
 * 木魚點擊區域組件
 * @param woodFish - 木魚圖片信息
 * @param isAnimating - 動畫狀態
 * @param onClick - 點擊事件處理函數
 * @param floatingNumbers - 浮動數字陣列
 * @param theme - 當前主題樣式
 */
const WoodFishClickArea = ({
  woodFish,
  isAnimating,
  onClick,
  floatingNumbers,
  theme,
}: {
  woodFish: ThemeSet["woodFish"];
  isAnimating: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  floatingNumbers: Array<{ id: number; x: number; y: number }>;
  theme: Theme;
}) => (
  <div
    className="relative"
    onClick={onClick}
    style={{
      animation: isAnimating ? "pulse 0.1s ease-in-out" : "none",
      willChange: "transform",
      cursor: `url('/bat.svg'), auto`,
    }}
  >
    <Image
      src={woodFish.image}
      alt={woodFish.name}
      width={woodFish.size}
      height={woodFish.size}
      draggable="false"
      className="rounded-full drop-shadow-lg hover:drop-shadow-2xl transition-shadow duration-300"
      style={{ willChange: "filter" }}
    />
    {/* 浮動數字動畫效果 */}
    {floatingNumbers.map((num) => (
      <FloatingNumber
        key={num.id}
        x={num.x}
        y={num.y}
        theme={theme}
      />
    ))}
  </div>
);

export default WoodFishClickArea; 