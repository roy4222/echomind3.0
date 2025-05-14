import React from 'react';
import Board from './Board';
import DifficultySelector from './GameModeSelector';
import GameRules from './GameRules';
import GameStatus from './GameStatus';
import ResetButton from './ResetButton';

/**
 * 遊戲容器組件
 * 整合棋盤、難度選擇器和遊戲規則
 * 
 * @param {Object} props - 組件屬性
 * @param {Array} props.board - 棋盤狀態，二維陣列
 * @param {Function} props.onSquareClick - 格子點擊處理函數
 * @param {boolean} props.disabled - 是否禁用棋盤交互，用於電腦思考時
 * @param {string} props.difficulty - 電腦難度 ('easy', 'medium', 'hard')
 * @param {Function} props.onDifficultyChange - 難度變更處理函數
 * @param {string} props.status - 遊戲狀態文字
 * @param {boolean} props.isBlackNext - 是否輪到黑棋
 * @param {Function} props.onReset - 重置遊戲處理函數
 */
const GameContainer = ({ 
  board, 
  onSquareClick, 
  disabled, 
  difficulty, 
  onDifficultyChange,
  status,
  isBlackNext,
  onReset
}) => {
  return (
    // 主容器：垂直布局，居中對齊
    <div className="flex flex-col items-center">
      {/* 遊戲主要區域：固定寬度，水平布局，漸層背景 */}
      <div className="w-[900px] flex flex-row gap-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
        
        {/* 左側面板：垂直布局，固定寬度 */}
        <div className="flex flex-col w-[280px] gap-4">
          {/* 難度選擇器組件 */}
          <DifficultySelector 
            difficulty={difficulty} 
            onDifficultyChange={onDifficultyChange} 
          />
          
          {/* 遊戲規則組件 */}
          <GameRules />
          
          {/* 遊戲狀態組件 */}
          <GameStatus 
            status={status} 
            isBlackNext={isBlackNext}
          />
        </div>
        
        {/* 右側棋盤：彈性寬度，保持正方形比例 */}
        <div className="flex-1 aspect-square">
          <Board 
            // board: 二維陣列，表示棋盤狀態
            // null: 空格, 'black': 黑子, 'white': 白子
            board={board} 

            // onSquareClick: 處理格子點擊的回調函數
            // 參數: (row, col) 被點擊的格子座標
            onSquareClick={onSquareClick} 

            // disabled: 是否禁用棋盤互動
            // true: 禁止落子（如：遊戲結束、電腦思考中）
            // false: 允許落子
            disabled={disabled} 
          />
        </div>
      </div>
      
      {/* 重置按鈕區域：上下邊距，水平置中 */}
      <div className="mt-6 mb-4">
        <ResetButton onClick={onReset} />
      </div>
    </div>
  );
};

export default GameContainer;