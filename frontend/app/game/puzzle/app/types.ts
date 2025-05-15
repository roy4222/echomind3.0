// 拼圖遊戲類型定義

// 遊戲狀態面板屬性介面
export interface GameStatusPanelProps {
  time: number;
  moves: number;
  isCompleted: boolean;
  onRestart: () => void;
}

// 拼圖塊介面
export interface PuzzlePiece {
  id: number;
  correctPosition: number;
  currentPosition: number;
} 