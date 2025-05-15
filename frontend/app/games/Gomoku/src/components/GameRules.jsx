import React, { useState } from 'react';

/**
 * 遊戲規則和說明組件
 * 提供五子棋遊戲的規則和操作說明
 */
const GameRules = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 w-[280px]">
      {/* <button
        className="text-gray-600 hover:text-gray-800 underline mb-2 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '收起遊戲說明' : '查看遊戲說明'}
      </button> */}
      
      {/* {isOpen && ( */}
        <div className="bg-white p-4 rounded-lg shadow-md text-sm text-gray-700">
          <h3 className="font-bold mb-2 text-gray-800">遊戲規則：</h3>
          <ul className="list-disc pl-5 mb-3">
            <li>玩家執黑先行，電腦執白後行</li>
            <li>在空格落子，黑白輪流</li>
            <li>先在任意方向形成連續五子者獲勝</li>
          </ul>
          
          <h3 className="font-bold mb-2 text-gray-800">操作說明：</h3>
          <ul className="list-disc pl-5 mb-3">
            <li>點擊棋盤上的空格落子</li>
            <li>點擊「重新開始」可重置遊戲</li>
            <li>選擇不同難度調整電腦對戰強度</li>
          </ul>
          
          <h3 className="font-bold mb-2 text-gray-800">難度說明：</h3>
          <ul className="list-disc pl-5">
            <li><span className="font-semibold text-gray-600">簡單：</span>適合初學者，電腦偶爾會犯錯</li>
            <li><span className="font-semibold text-gray-700">中等：</span>具有一定挑戰性，電腦會嘗試進攻和防守</li>
            <li><span className="font-semibold text-gray-800">困難：</span>非常具有挑戰性，電腦會使用進階策略</li>
          </ul>
        </div>
      {/* )} */}
    </div>
  );
};

export default GameRules; 