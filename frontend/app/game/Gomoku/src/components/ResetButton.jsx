import React, { useState } from 'react';

/**
 * ResetButton 組件 - 重置遊戲按鈕
 * 提供一個按鈕用於重置遊戲狀態，點擊後會：
 * - 清空棋盤
 * - 重置玩家順序（設為黑棋）
 * - 清除獲勝狀態
 * 
 * @component
 * @param {Object} props - 組件屬性
 * @param {Function} props.onClick - 點擊處理函數，用於重置遊戲狀態
 * 
 * @example
 * // 使用示例
 * const handleReset = () => {
 *   // 重置遊戲邏輯
 * };
 * <ResetButton onClick={handleReset} />
 */
const ResetButton = ({ onClick }) => {
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      // 5秒後自動取消確認狀態
      setTimeout(() => setConfirming(false), 5000);
    } else {
      onClick();
      setConfirming(false);
    }
  };

  return (
    <button 
      className={`px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none active:scale-100 ${
        confirming 
          ? 'bg-gray-700 text-white hover:bg-gray-800' 
          : 'bg-gray-800 text-white hover:bg-gray-900'
      }`}
      onClick={handleClick}
    >
      {confirming ? '確認重新開始?' : '重新開始'}
    </button>
  );
};

export default ResetButton; 