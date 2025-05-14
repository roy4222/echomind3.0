import React, { useState } from 'react';

/**
 * 遊戲規則和說明組件
 * 提供五子棋遊戲的規則和操作說明
 */
const GameRules = () => {
  // const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full mb-4">
      {/* <button
        className="text-gray-600 hover:text-gray-800 underline mb-2 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '收起遊戲說明' : '查看遊戲說明'}
      </button> */}
      
      {/* {isOpen && ( */}
        <div className="w-full bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-600">
          <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-200 text-center">遊戲說明</h3>
          
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-600 p-2 rounded-md">
              <h4 className="
                font-semibold     // 字體粗細：半粗體
                mb-1             // margin-bottom: 0.25rem (4px)
                text-gray-700    // 淺色模式文字顏色：中灰色
                dark:text-gray-200  // 深色模式文字顏色：淺灰色
                border-l-4       // 左邊框寬度：4px
                border-gray-500  // 邊框顏色：灰色
                pl-2            // padding-left: 0.5rem (8px)，左內邊距
              ">遊戲規則：</h4>
              <ul className="
                list-disc      // 設置列表項目符號為實心圓點
                pl-8          // padding-left: 2rem (32px)，確保項目符號不會被裁切
                space-y-1     // 列表項目之間的垂直間距：0.25rem (4px)
              ">
                <li>玩家執黑先行，電腦執白後行</li>
                <li>在空格落子，黑白輪流</li>
                <li>先在任意方向形成連續五子者獲勝</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-600 p-2 rounded-md">
              <h4 className="
                font-semibold     // 字體粗細：半粗體
                mb-1             // margin-bottom: 0.25rem (4px)
                text-gray-700    // 淺色模式文字顏色：中灰色
                dark:text-gray-200  // 深色模式文字顏色：淺灰色
                border-l-4       // 左邊框寬度：4px
                border-gray-500  // 邊框顏色：灰色
                pl-2            // padding-left: 0.5rem (8px)，左內邊距
              ">操作說明：</h4>
              <ul className="
                list-disc      // 設置列表項目符號為實心圓點
                pl-8          // padding-left: 2rem (32px)，確保項目符號不會被裁切
                space-y-1     // 列表項目之間的垂直間距：0.25rem (4px)
              ">
                <li>點擊棋盤上的空格落子</li>
                <li>點擊「重新開始」可重置遊戲</li>
                <li>選擇不同難度調整電腦對戰強度</li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  );
};

export default GameRules;