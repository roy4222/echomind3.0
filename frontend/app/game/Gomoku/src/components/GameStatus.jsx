/**
 * GameStatus 組件 - 顯示遊戲當前狀態
 * 用於展示遊戲的當前狀態，包括：
 * - 當前玩家（黑棋或白棋）
 * - 獲勝玩家（如果有）
 * - 平局狀態
 * 
 * @component
 * @param {Object} props - 組件屬性
 * @param {string} props.status - 遊戲狀態文字，可能是以下幾種情況：
 *                               - "當前玩家: 黑棋" 或 "當前玩家: 白棋"
 *                               - "贏家: 黑棋" 或 "贏家: 白棋"
 *                               - "平局！"
 * @param {boolean} props.isBlackNext - 是否輪到黑棋
 * @example
 * // 使用示例
 * <GameStatus status="當前玩家: 黑棋" isBlackNext={true} />
 */
const GameStatus = ({ status, isBlackNext }) => (
  <div className="flex items-center justify-center gap-3 mb-4">
    <div className="text-xl font-medium text-gray-800 dark:text-gray-200">
      {status}
    </div>
    
    {/* 顯示當前玩家的棋子 */}
    {!status.includes('贏家') && !status.includes('平局') && (
      <div 
        className={`w-6 h-6 rounded-full ${
          isBlackNext 
            ? 'bg-gray-800' 
            : 'bg-white border border-gray-300 dark:border-gray-500'
        }`}
      />
    )}
  </div>
);

export default GameStatus; 