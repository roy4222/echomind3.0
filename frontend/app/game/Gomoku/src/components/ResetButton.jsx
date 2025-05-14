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
// 重置按鈕組件，接收點擊事件處理函數
const ResetButton = ({ onClick }) => {
  // 確認狀態的狀態變數
  const [confirming, setConfirming] = useState(false);
  //false：用設狀態值(尚未進入確認狀態)
  //confirming：確認狀態，當用戶點擊按鈕後進入確認狀態，5秒後自動取消確認狀態(當前狀態)
  //setConfirming：更新確認狀態的函數

  // 處理按鈕點擊事件
  const handleClick = () => {        // 1. 首先執行
    if (!confirming) {               // 2. 檢查狀態
      setConfirming(true);           // 第一次點擊
      setTimeout(() => setConfirming(false), 5000);
    } else {
      onClick();                     // 3. 執行 App.jsx 的 resetGame
      setConfirming(false);          // 4. 重置按鈕狀態
    }
  };

  return (
    <button 
      // 按鈕樣式類
      className={`
        px-6 py-3                    // 內邊距
        rounded-lg                   // 圓角
        shadow-md                    // 陰影
        transition-all               // 所有屬性過渡效果(當屬性值改變時，會平滑過渡而不是瞬間改變)
        transform                    // 啟用變形
        hover:scale-105             // 滑鼠懸停時放大
        focus:outline-none          // 移除焦點輪廓
        active:scale-100            // 點擊時恢復原始大小
        ${
          confirming 
            ? 'bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700'  // 確認狀態樣式
            : 'bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'  // 一般狀態樣式
        }
      `}
      onClick={handleClick}
    >
      {/* 根據確認狀態顯示不同文字 */}
      {confirming ? '確認重新開始?' : '重新開始'}
    </button>
  );
};

export default ResetButton;