import React from 'react';

/**
 * 難度選擇器組件
 * 提供電腦對戰的難度選擇
 * 
 * @param {Object} props - 組件屬性
 * @param {string} props.difficulty - 電腦難度 ('easy', 'medium', 'hard')
 * @param {Function} props.onDifficultyChange - 難度變更處理函數
 */
const DifficultySelector = ({ difficulty, onDifficultyChange }) => {
  return (
    <div className="mb-8 bg-white p-4 rounded-lg shadow-md w-[280px]">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">難度選擇</h2>
      
      <div className="flex gap-2">
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm transition-colors ${
            difficulty === 'easy' 
              ? 'bg-gray-600 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => onDifficultyChange('easy')}
        >
          簡單
        </button>
        
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm transition-colors ${
            difficulty === 'medium' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => onDifficultyChange('medium')}
        >
          中等
        </button>
        
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm transition-colors ${
            difficulty === 'hard' 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => onDifficultyChange('hard')}
        >
          困難
        </button>
      </div>
    </div>
  );
};

export default DifficultySelector; 