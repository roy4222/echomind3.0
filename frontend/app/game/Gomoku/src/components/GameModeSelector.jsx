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
    <div className="w-full bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md mb-4 border border-gray-100 dark:border-gray-600">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">難度選擇</h2>
      
      <div className="flex gap-2">
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            difficulty === 'easy' 
              ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-md transform scale-105' 
              : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 hover:shadow'
          }`}
          onClick={() => onDifficultyChange('easy')}
        >
          簡單
        </button>
        
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            difficulty === 'medium' 
              ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-md transform scale-105' 
              : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 hover:shadow'
          }`}
          onClick={() => onDifficultyChange('medium')}
        >
          中等
        </button>
        
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            difficulty === 'hard' 
              ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md transform scale-105' 
              : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 hover:shadow'
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