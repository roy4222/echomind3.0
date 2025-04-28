// 拼圖遊戲相關型別
export interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
}

export interface PuzzleTheme {
  id: string;
  name: string;
  title: string;
  image: string;
  imageUrl: string;
  description: string;
  placeholder: string;
}

export interface GameStatusPanelProps {
  moves: number;
  time: number;
  isCompleted: boolean;
  onReset: () => void;
  onRestart: () => void;
}

export interface PuzzleGameProps {
  theme: PuzzleTheme;
  difficulty?: number;
}
