export interface PuzzleTheme {
    id: string;
    title: string;
    image: string;
    description: string;
    placeholder: string;
  }
  
  export interface PuzzlePiece {
    id: number;
    correctPosition: number;  // 正確的位置索引
    currentPosition: number;  // 當前的位置索引
  }
  
  export interface GameStatusPanelProps {
    time: number;
    moves: number;
    isCompleted: boolean;
    onRestart: () => void;
  }
  
  export interface PuzzleGameProps {
    theme: string;
    difficulty: number;
  } 