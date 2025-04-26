import React, { useState } from 'react';

/**
 * 遊戲規則和說明組件
 * 提供五子棋遊戲的規則和操作說明
 */
const GameRules = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full mb-4">
      {/* <button
        className="text-gray-600 hover:text-gray-800 underline mb-2 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '收起遊戲說明' : '查看遊戲說明'}
      </button> */}
      
      {/* {isOpen && ( */}
        <div className="w-full bg-white p-4 rounded-lg shadow-md text-sm text-gray-700 border border-gray-100">
          <h3 className="font-bold mb-2 text-gray-800 text-center">遊戲說明</h3>
          
          <div className="space-y-3">
            <div className="bg-gray-50 p-2 rounded-md">
              <h4 className="font-semibold mb-1 text-gray-700 border-l-4 border-gray-500 pl-2">遊戲規則：</h4>
              <ul className="list-disc pl-8 space-y-1">
                <li>玩家執黑先行，電腦執白後行</li>
                <li>在空格落子，黑白輪流</li>
                <li>先在任意方向形成連續五子者獲勝</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-2 rounded-md">
              <h4 className="font-semibold mb-1 text-gray-700 border-l-4 border-gray-500 pl-2">操作說明：</h4>
              <ul className="list-disc pl-8 space-y-1">
                <li>點擊棋盤上的空格落子</li>
                <li>點擊「重新開始」可重置遊戲</li>
                <li>選擇不同難度調整電腦對戰強度</li>
              </ul>
            </div>
          </div>
        </div>
      {/* )} */}
    </div>
  );
};

export default GameRules; 