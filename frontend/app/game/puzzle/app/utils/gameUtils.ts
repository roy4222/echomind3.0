import { PuzzlePiece } from '@/lib/types/puzzle';

// 格式化時間為 MM:SS 格式
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 初始化拼圖塊
export const initializePuzzlePieces = (difficulty: number): PuzzlePiece[] => {
  const totalPieces = difficulty * difficulty;
  
  // 創建初始拼圖塊，每個拼圖塊有其正確位置和當前位置
  const initialPieces = Array.from({ length: totalPieces }, (_, i) => ({
    id: i,
    correctPosition: i,
    currentPosition: i
  }));

  // 洗牌算法 - 打亂當前位置
  const shuffledPieces = [...initialPieces];
  for (let i = shuffledPieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPieces[i].currentPosition, shuffledPieces[j].currentPosition] =
      [shuffledPieces[j].currentPosition, shuffledPieces[i].currentPosition];
  }

  return shuffledPieces;
};

// 檢查遊戲是否完成
export const checkGameCompletion = (pieces: PuzzlePiece[]): boolean => {
  return pieces.every(piece => piece.currentPosition === piece.correctPosition);
}; 