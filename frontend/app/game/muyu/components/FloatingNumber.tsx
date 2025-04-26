import { Theme } from "./types";

/**
 * 浮動數字組件：顯示點擊後的動畫效果
 * @param x - X座標位置
 * @param y - Y座標位置
 * @param theme - 主題樣式
 */
const FloatingNumber = ({
  x,
  y,
  theme,
}: {
  x: number;
  y: number;
  theme: Theme;
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

export default FloatingNumber; 