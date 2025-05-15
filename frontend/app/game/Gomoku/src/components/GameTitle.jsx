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
  <h1 className="
    text-3xl       // 文字大小：1.875rem (30px)
    font-bold      // 文字粗細：700 (粗體)
    mb-6          // margin-bottom: 1.5rem (24px)
    text-gray-800  // 文字顏色：深灰色 (#1F2937)
  ">
    五子棋
  </h1>
);

export default GameTitle;