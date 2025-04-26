/**
 * App.jsx - 五子棋遊戲的主要組件
 * 這是遊戲的根組件，負責：
 * 1. 管理遊戲狀態
 * 2. 處理玩家互動
 * 3. 組織遊戲界面
 */
import { useState, useEffect, useCallback } from 'react';
import GameContainer from './components/GameContainer';
import GameTitle from './components/GameTitle';
import { checkWinner, getGameStatus, computerMove, initializeBoard, isBoardFull } from './utils/gameLogic';


/**
 * App 組件 - 五子棋遊戲的主要邏輯和界面
 * 包含遊戲的核心功能：
 * - 遊戲狀態管理（棋盤狀態、當前玩家）
 * - 玩家操作處理（落子、重置）
 * - 遊戲規則實現（勝負判定、回合切換）
 * - 界面組織（標題、棋盤、狀態、按鈕）
 * 
 * @component
 * @example
 * // 使用示例
 * <App />
 */
function App() {
  // 棋盤大小
  const boardSize = 15;

  /**
   * 遊戲狀態管理
   * @state {Array} board - 棋盤狀態，15x15二維陣列，每個元素可能是：
   *                        - 'black'：黑棋
   *                        - 'white'：白棋
   *                        - null：空格
   */
  const [board, setBoard] = useState(initializeBoard(boardSize));
  
  /**
   * 玩家回合管理
   * @state {boolean} isBlackNext - 是否輪到黑棋
   *                              - true：輪到黑棋 (人類玩家)
   *                              - false：輪到白棋 (電腦)
   */
  const [isBlackNext, setIsBlackNext] = useState(true);

  /**
   * 贏家狀態
   * @state {string|null} winner - 勝利者
   *                             - 'black'：黑棋獲勝
   *                             - 'white'：白棋獲勝
   *                             - null：沒有勝利者
   */
  const [winner, setWinner] = useState(null);

  /**
   * 最後一步落子的位置，用於檢查勝負
   * @state {Array|null} lastMove - 最後一步落子的[行, 列]
   */
  const [lastMove, setLastMove] = useState(null);

  /**
   * 遊戲難度管理
   * @state {string} difficulty - 電腦難度
   *                             - 'easy'：簡單
   *                             - 'medium'：中等
   *                             - 'hard'：困難
   */
  const [difficulty, setDifficulty] = useState('medium');

  /**
   * 電腦思考狀態
   * @state {boolean} isComputerThinking - 電腦是否正在思考
   */
  const [isComputerThinking, setIsComputerThinking] = useState(false);

  /**
   * 電腦下棋函數 - 使用useCallback進行記憶化
   */
  const makeComputerMove = useCallback(() => {
    // 確保還沒有贏家且輪到電腦下棋
    if (winner || isBlackNext) return;
    
    // 設置電腦思考狀態
    setIsComputerThinking(true);

    // 計算電腦的落子位置
    const [aiRow, aiCol] = computerMove(board, 'white', difficulty);
      
    if (aiRow !== -1 && aiCol !== -1) {
      // 創建新棋盤並設置電腦棋子
      const newBoard = board.map(row => [...row]);
      newBoard[aiRow][aiCol] = 'white';
      
      // 更新狀態
      setBoard(newBoard);
      setLastMove([aiRow, aiCol]);
      
      // 檢查電腦是否獲勝
      if (checkWinner(newBoard, aiRow, aiCol, 'white')) {
        setWinner('white');
      } else {
        // 切換回玩家回合
        setIsBlackNext(true);
      }
    }
    
    // 電腦思考結束
    setIsComputerThinking(false);
  }, [board, difficulty, isBlackNext, winner]);

  /**
   * 電腦對戰時，監聽玩家下棋後自動執行電腦下棋
   */
  useEffect(() => {
    // 如果輪到電腦下棋且電腦不在思考中
    if (!isBlackNext && !winner && !isComputerThinking) {
      makeComputerMove();
    }
  }, [isBlackNext, winner, makeComputerMove, isComputerThinking]);

  /**
   * 處理玩家點擊格子事件
   * @param {number} row - 被點擊格子的行號
   * @param {number} col - 被點擊格子的列號
   */
  const handlePlayerMove = (row, col) => {
    // 如果電腦正在思考，不允許玩家下棋
    if (isComputerThinking) return;
    
    // 如果格子已被佔用或已有勝利者或不是玩家回合，則返回
    if (board[row][col] || winner || !isBlackNext) return;
    
    // 創建新棋盤並設置玩家棋子
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = 'black';
    
    // 更新狀態
    setBoard(newBoard);
    setLastMove([row, col]);
    
    // 檢查玩家是否獲勝
    if (checkWinner(newBoard, row, col, 'black')) {
      setWinner('black');
    } else {
      // 切換到電腦回合
      setIsBlackNext(false);
    }
  };

  /**
   * 重置遊戲狀態
   * 將遊戲恢復到初始狀態：
   * 1. 清空棋盤（所有格子設為null）
   * 2. 將下一位玩家設為黑棋
   * 3. 清除獲勝狀態
   */
  const resetGame = () => {
    setBoard(initializeBoard(boardSize));
    setIsBlackNext(true);
    setWinner(null);
    setLastMove(null);
    setIsComputerThinking(false);
  };

  /**
   * 處理難度變更
   * @param {string} newDifficulty - 新的難度
   */
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    resetGame();
  };

  // 計算當前遊戲狀態
  const status = getGameStatus(winner, isBlackNext);

  return (
    <div className="w-screen min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8">
      <GameTitle />
      
      <GameContainer 
        board={board}
        onSquareClick={handlePlayerMove}
        disabled={isComputerThinking}
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        status={status}
        isBlackNext={isBlackNext}
        onReset={resetGame}
      />
    </div>
  );
}

export default App;