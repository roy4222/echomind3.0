/**
 * GameTitle 組件 - 遊戲標題
 * 顯示遊戲的標題文字。這是一個純展示型組件，不接收任何 props。
 * 使用 Tailwind CSS 進行樣式設置：
 * - text-3xl: 大標題文字大小
 * - font-bold: 粗體文字
 * - mb-6: 底部邊距
 * 
 * @component
 * @example
 * // 使用示例
 * <GameTitle />
 */
const GameTitle = () => (
  <h1 className="text-3xl font-bold mb-6 text-gray-800">
    五子棋遊戲
  </h1>
);

export default GameTitle; 