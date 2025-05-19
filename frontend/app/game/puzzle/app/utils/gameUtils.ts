import { PuzzlePiece } from '../../../../../lib/types/game';

// 格式化時間為 MM:SS 格式
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60); //向下取最小整數
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  //補零至指定長度 > 如果字串長度不足2，前面補'0'
};


// 初始化拼圖塊
export const initializePuzzlePieces = (difficulty: number): PuzzlePiece[] => {
  const totalPieces = difficulty * difficulty;
  
  // 創建初始拼圖塊，每個拼圖塊有其正確位置和當前位置
  const initialPieces = Array.from({ length: totalPieces }, (_, i) => ({ 
    /*_ 表示不使用的參數
        i 是索引值
        _ 是一個慣例寫法，表示這個參數雖然存在但不會被使用。
    */
    id: i,                // 唯一識別碼
    correctPosition: i,   // 正確位置
    currentPosition: i    // 目前位置
  }));

  // 洗牌算法 - 打亂當前位置
  const shuffledPieces = [...initialPieces];
  for (let i = shuffledPieces.length - 1; i > 0; i--) {
      // 隨機選擇 0 到 i 之間的索引
    const j = Math.floor(Math.random() * (i + 1));
      // 交換當前位置
    [shuffledPieces[i].currentPosition, shuffledPieces[j].currentPosition] =
      [shuffledPieces[j].currentPosition, shuffledPieces[i].currentPosition];
  }

  return shuffledPieces;
};

// 檢查遊戲是否完成
export const checkGameCompletion = (pieces: PuzzlePiece[]): boolean => {
  return pieces.every(piece => piece.currentPosition === piece.correctPosition);
  //every() 方法測試陣列中的所有元素是否都符合指定的條件
}; 