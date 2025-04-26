// SnakeGame.jsx - 貪吃蛇遊戲主要組件
import React, { useState, useEffect, useRef } from 'react';

// 遊戲相關常數設定
const GRID_SIZE = 20; // 遊戲格子大小
const INITIAL_SNAKE = [{ x: 10, y: 10 }]; // 蛇的初始位置--為一個物件
const INITIAL_FOOD = { x: 15, y: 15 }; // 食物的初始位置
const INITIAL_DIRECTION = 'RIGHT'; // 初始移動方向
const INITIAL_SPEED = 10; // 初始速度值
const MIN_SPEED = 1; // 最低速度
const MAX_SPEED = 20; // 最高速度

const SnakeGame = () => {
  // 遊戲狀態管理
  const [snake, setSnake] = useState(INITIAL_SNAKE); // 蛇的位置狀態
  const [food, setFood] = useState(INITIAL_FOOD); // 食物位置狀態
  const [direction, setDirection] = useState(INITIAL_DIRECTION); // 移動方向狀態
  const [isGameOver, setIsGameOver] = useState(false); // 遊戲結束狀態
  const [isPaused, setIsPaused] = useState(false); // 遊戲暫停狀態
  const [score, setScore] = useState(0); // 分數狀態
  const [speed, setSpeed] = useState(INITIAL_SPEED); // 蛇的速度狀態
  const gameRef = useRef(null); // 遊戲區域的參考
  const [animation, setAnimation] = useState(false); // 控制頁面載入動畫

  // 頁面載入動畫效果
  useEffect(() => {
    setAnimation(true);
  }, []);

  // 處理穿牆功能 - 確保座標在格子範圍內，並允許穿牆
  const handleWrapAround = (position) => {
    let { x, y } = position;
    
    // 穿牆處理：
    // 如果 x 座標超出右邊界，從左邊重新進入
    if (x >= GRID_SIZE) x = 0;
    // 如果 x 座標小於左邊界，從右邊重新進入
    else if (x < 0) x = GRID_SIZE - 1;
    // 如果 y 座標超出下邊界，從上方重新進入
    if (y >= GRID_SIZE) y = 0;
    // 如果 y 座標小於上邊界，從下方重新進入
    else if (y < 0) y = GRID_SIZE - 1;
    
    return { x, y };
  };

  // 速度控制函數
  const increaseSpeed = () => {
    if (speed < MAX_SPEED) {
      setSpeed(prevSpeed => prevSpeed + 1);
    }
  };

  const decreaseSpeed = () => {
    if (speed > MIN_SPEED) {
      setSpeed(prevSpeed => prevSpeed - 1);
    }
  };

  // 根據速度計算移動間隔時間（毫秒）
  const getSpeedInterval = () => {
    // 速度越高，間隔越短（移動越快）
    return 200 - (speed * 8); // 從 120ms (最慢) 到 40ms (最快)
  };

  // 遊戲主循環 - 控制蛇的移動和碰撞檢測
  useEffect(() => {
    if (isGameOver || isPaused) return;

    // 設定定時器來移動蛇
    const moveSnake = setInterval(() => {
      // 更新蛇的位置狀態
      setSnake((prevSnake) => {
        // 複製當前蛇的位置陣列
        const newSnake = [...prevSnake];
        // 取得並複製蛇頭位置
        const head = { ...newSnake[0] };

        // 根據方向更新蛇頭位置
        switch (direction) {
          case 'UP': head.y--; break;
          case 'DOWN': head.y++; break;
          case 'LEFT': head.x--; break;
          case 'RIGHT': head.x++; break;
        }

        // 處理穿牆效果
        const wrappedHead = handleWrapAround(head);

        // 檢查自身碰撞
        if (newSnake.some(segment => segment.x === wrappedHead.x && segment.y === wrappedHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        // 使用穿牆後的蛇頭位置
        newSnake.unshift(wrappedHead);

        // 檢查是否吃到食物
        if (wrappedHead.x === food.x && wrappedHead.y === food.y) {
          setScore(score => score + 1);
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, getSpeedInterval()); // 使用基於速度的間隔時間
    
    // 清理函數：當組件卸載或依賴項改變時清除定時器
    return () => clearInterval(moveSnake);
  }, [direction, isGameOver, isPaused, food, speed]); // 添加 speed 到依賴項

  // 鍵盤事件監聽器 - 處理方向控制
  useEffect(() => {
    const handleKeyPress = (e) => {
      // 阻止方向鍵的預設行為，避免畫面捲動
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.key)) {
        e.preventDefault();
      }
      
      // 只有在遊戲進行中才處理方向鍵
      if (!isGameOver && !isPaused) {
        switch (e.key) {
          case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
          case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
          case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
          case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
          case ' ': // 空格鍵暫停/恢復遊戲
            setIsPaused(prev => !prev);
            break;
        }
      } else if (e.key === ' ' && !isGameOver) {
        // 即使遊戲暫停也可以用空格鍵恢復
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isGameOver, isPaused]);

  // 生成新的食物位置
  const generateFood = (currentSnake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  };

  // 重置遊戲狀態
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    // 保持當前速度設置
  };

  // 更新蛇的移動方向
  const changeDirection = (newDirection) => {
    switch (newDirection) {
      case 'UP': if (direction !== 'DOWN') setDirection('UP'); break;
      case 'DOWN': if (direction !== 'UP') setDirection('DOWN'); break;
      case 'LEFT': if (direction !== 'RIGHT') setDirection('LEFT'); break;
      case 'RIGHT': if (direction !== 'LEFT') setDirection('RIGHT'); break;
    }
  };

  // 渲染遊戲網格
  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isSnakeHead = isSnake && snake[0].x === x && snake[0].y === y;
        const isFood = food.x === x && food.y === y;
        
        grid.push(
          <div
            key={`${x}-${y}`}
            className={`w-6 h-6 border border-gray-100 transition-colors duration-100 ${
              isSnakeHead ? 'bg-gray-800' : // 蛇頭顏色
              isSnake ? 'bg-gray-700' : // 蛇身體顏色
              isFood ? 'bg-red-500' : // 食物顏色
              'bg-gray-50' // 背景顏色
            }`}
          />
        );
      }
    }
    return grid;
  };

  // 渲染遊戲介面
  return (
    <div className={`w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center py-8 px-4 transition-all duration-700 ${animation ? 'opacity-100' : 'opacity-0'}`}>
      {/* <div className="bg-white/90 backdrop-blur-sm shadow-md py-6 px-8 rounded-xl w-full max-w-2xl mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">貪吃蛇遊戲</h1>
      </div> */}
      
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 max-w-2xl w-full mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center bg-gray-50 rounded-lg px-4 py-2 shadow-sm w-36">
            <div className="text-sm font-semibold text-gray-700">分數</div>
            <div className="text-2xl font-bold text-gray-800">{score}</div>
          </div>
          
         
          
          <div className="text-gray-700 text-lg font-medium">
            {isGameOver && <span className="text-red-600">遊戲結束</span>}
          </div>
        </div>
      
        {/* 遊戲區域 */}
        <div 
          ref={gameRef}
          className="grid bg-gray-50 rounded-lg shadow-inner p-3 mx-auto mb-4"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: '550px',
            height: '550px'
          }}
        >
          {renderGrid()}
        </div>

        <div className="flex justify-between items-center mt-10">
           {/* 速度控制器 */}
           <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 shadow-sm">
            <button 
              onClick={decreaseSpeed}
              disabled={speed <= MIN_SPEED}
              className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                speed <= MIN_SPEED 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-800 transition-colors'
              }`}
            >
              -
            </button>
            <div className="w-20 text-center">
              <div className="text-sm font-semibold text-gray-700">速度</div>
              <div className="text-xl font-bold text-gray-800">{speed}</div>
            </div>
            <button 
              onClick={increaseSpeed}
              disabled={speed >= MAX_SPEED}
              className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                speed >= MAX_SPEED
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-800 transition-colors'
              }`}
            >
              +
            </button>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium shadow-md transform hover:scale-105 ${
                isPaused 
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                  : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white'
              }`}
            >
              {isPaused ? (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  繼續遊戲
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  暫停遊戲
                </span>
              )}
            </button>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all transform hover:scale-105 shadow-md font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              重新開始
            </button>
          </div>
        </div>
        
        {/* 操作說明 */}
        <div className="mt-6 bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
          <p className="font-medium text-center mb-2">操作說明</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-gray-200 px-2 py-1 rounded shadow-sm">↑</span>
              <span>向上移動</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-gray-200 px-2 py-1 rounded shadow-sm">↓</span>
              <span>向下移動</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-gray-200 px-2 py-1 rounded shadow-sm">←</span>
              <span>向左移動</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-gray-200 px-2 py-1 rounded shadow-sm">→</span>
              <span>向右移動</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-gray-200 px-2 py-1 rounded shadow-sm whitespace-nowrap">Space</span>
              <span>暫停/繼續</span>
            </div>
            <div className="text-gray-600 text-sm bg-gray-50 px-3 py-1 rounded-full shadow-sm">
             穿牆模式：蛇可以穿過邊界
           </div>
          </div>
        </div>
      </div>
      
      {/* <footer className="bg-white/90 backdrop-blur-sm shadow-inner py-4 px-8 rounded-xl text-center text-gray-600 w-full max-w-xl">
        <p>&copy; {new Date().getFullYear()} 貪吃蛇遊戲 - 穿牆模式增強版</p>
      </footer> */}
    </div>
  );
};

export default SnakeGame;