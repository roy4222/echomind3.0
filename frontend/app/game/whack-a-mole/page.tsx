'use client';

import { useState, useEffect, useCallback } from 'react';
// 不需要引入樣式檔案，因為使用 Tailwind CSS
// import './App.css'

// 音效檔案
/*const AUDIO = {
  HIT: new Audio('/sounds/hit.mp3'),
  MISS: new Audio('/sounds/miss.mp3'),
  GAME_START: new Audio('/sounds/game-start.mp3'),
  GAME_OVER: new Audio('/sounds/game-over.mp3'),
  LEVEL_UP: new Audio('/sounds/level-up.mp3'),
};*/
//
// 地鼠類型定義
const MOLE_TYPES = {
  NORMAL: 'normal',
  GOLDEN: 'golden',
  BOMB: 'bomb'
} as const;

type MoleType = typeof MOLE_TYPES[keyof typeof MOLE_TYPES];

// 地鼠分數設定
const MOLE_SCORES = {
  NORMAL: 1,    // 普通地鼠 1分
  GOLDEN: 5,    // 金色地鼠 5分
  BOMB: -3     // 炸彈地鼠 -3分
};

// 地鼠出現機率設定
const MOLE_CHANCES = {
  GOLDEN: 0.15,   // 15% 機率出現金色地鼠
  BOMB: 0.2      // 20% 機率出現炸彈地鼠
};

// 難度設置
const DIFFICULTY_SETTINGS = {
  EASY: {
    name: '簡單',
    moleSpeed: 1000,
    timeBonus: 5,
    goldenChance: 0.1,
    bombChance: 0.05
  },
  NORMAL: {
    name: '中等',
    moleSpeed: 800,
    timeBonus: 0,
    goldenChance: 0.15,
    bombChance: 0.1
  },
  HARD: {
    name: '困難',
    moleSpeed: 600,
    timeBonus: -5,
    goldenChance: 0.2,
    bombChance: 0.15
  }
};

// 主要遊戲元件
export default function MouseGame() {
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const [activeMoleType, setActiveMoleType] = useState<MoleType | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [showFinalScore, setShowFinalScore] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [wrongHit, setWrongHit] = useState<number | null>(null);
  const [missedMole, setMissedMole] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);  // 新增主題狀態

  // 地鼠類型及其分數
  const moleTypes = {
    normal: { score: 1, probability: 0.7 },
    golden: { score: 5, probability: 0.2 },
    bomb: { score: -3, probability: 0.1 }
  };

  // 根據回合取得地鼠出現速度
  const getMoleSpeed = (): number => {
    switch (round) {
      case 1: return 2000;  // 第一輪：2秒
      case 2: return 1500;  // 第二輪：1.5秒
      case 3: return 1000;  // 第三輪：1秒
      default: return 2000;
    }
  }

  // 隨機選擇地鼠類型
  const getRandomMoleType = (): MoleType => {
    const rand = Math.random();
    if (rand < moleTypes.normal.probability) return 'normal';
    if (rand < moleTypes.normal.probability + moleTypes.golden.probability) return 'golden';
    return 'bomb';
  }

  // 隨機選擇洞穴
  const getRandomHole = (): number => {
    const holes = Array.from({ length: 9 }, (_, i) => i);
    return holes[Math.floor(Math.random() * holes.length)];
  }

  // 顯示地鼠
  const showMole = useCallback(() => {
    if (!gameStarted || isGameOver || isResting) return;
    const newHole = getRandomHole();
    const newType = getRandomMoleType();
    setActiveMole(newHole);
    setActiveMoleType(newType);

    // 根據地鼠類型設置不同的消失時間
    const timeout = newType === 'golden' ? getMoleSpeed() * 0.7 : getMoleSpeed();
    setTimeout(() => {
      if (activeMole === newHole) {
        // 只有普通地鼠和金色地鼠沒打中時才扣分和顯示叉叉
        if (activeMoleType !== 'bomb') {
          setScore((prev: number) => prev - 1);
          setMissedMole(newHole);
          // 1秒後清除叉叉
          setTimeout(() => {
            setMissedMole(null);
          }, 1000);
        }
        setActiveMole(null);
        setActiveMoleType(null);
      }
    }, timeout);
  }, [gameStarted, isGameOver, isResting, activeMole, activeMoleType]);

  // 開始遊戲
  const startGame = (): void => {
    setScore(0);
    setTimeLeft(15);
    setGameStarted(true);
    setIsGameOver(false);
    setActiveMole(null);
    setActiveMoleType(null);
    setRound(1);
    setIsResting(false);
    setFinalScore(0);
    setShowFinalScore(false);
  }

  // 遊戲計時器
  useEffect(() => {
    if (!gameStarted || isGameOver || isResting) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime: number) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          if (round < 2) {  // 修改為2回合
            setIsResting(true);
            setTimeout(() => {
              setRound((prevRound: number) => prevRound + 1);
              setTimeLeft(15);
              setIsResting(false);
            }, 3000);
          } else {
            setIsGameOver(true);
            setGameStarted(false);
            setFinalScore(score);
            setShowFinalScore(true);
          }
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, isGameOver, round, isResting, score]);

  // 點擊地鼠
  const handleMoleClick = (index: number): void => {
    if (!gameStarted || isGameOver || isResting) {
      return;
    }

    if (index === activeMole) {
      const moleScore = moleTypes[activeMoleType as keyof typeof moleTypes]?.score || 0;
      setScore((prevScore: number) => {
        const newScore = prevScore + moleScore;
        return Math.max(0, newScore); // 確保分數不會小於0
      });
      setActiveMole(null);
      setActiveMoleType(null);
    } else {
      setWrongHit(index);
      setTimeout(() => setWrongHit(null), 1000);
      // 點錯時扣1分
      setScore((prevScore: number) => Math.max(0, prevScore - 1));
    }
  };

  // 地鼠出現邏輯
  useEffect(() => {
    if (!gameStarted || isGameOver || isResting) {
      return;
    }

    const moleTimer = setInterval(() => {
      const newHole = getRandomHole();
      const newType = getRandomMoleType();
      
      // 如果有之前的地鼠沒打到（不是炸彈），扣分
      if (activeMole !== null && activeMoleType !== 'bomb') {
        setScore((prevScore: number) => Math.max(0, prevScore - 1));
        setMissedMole(activeMole);
        setTimeout(() => setMissedMole(null), 1000);
      }
      
      setActiveMole(newHole);
      setActiveMoleType(newType);
    }, getMoleSpeed());

    return () => clearInterval(moleTimer);
  }, [gameStarted, isGameOver, isResting, round, activeMole, activeMoleType]);

  // 切換主題
  const toggleTheme = (): void => {
    setIsDarkMode((prev: boolean) => {
      const newTheme = !prev;
      document.body.className = newTheme ? 'bg-gray-800' : 'bg-gray-50';
      return newTheme;
    });
  };

  // 初始化主題
  useEffect(() => {
    document.body.className = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
  }, [isDarkMode]);

  // 返回開始畫面
  const returnToStart = (): void => {
    setGameStarted(false);
    setIsGameOver(false);
    setShowFinalScore(false);
    setScore(0);
    setTimeLeft(15);
    setRound(1);
    setActiveMole(null);
    setActiveMoleType(null);
  };

  return (
    <div className={`max-w-7xl mx-auto p-5 min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-50 text-gray-700'}`}>
      <button 
        className={`fixed top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-50 text-xl
                    ${isDarkMode ? 'bg-gray-700 text-gray-100 shadow-lg shadow-white/10' : 'bg-gray-100 text-gray-700 shadow-md shadow-black/10'}`}
        onClick={toggleTheme}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      {!gameStarted && !isGameOver ? (
        <div className={`text-center p-8 rounded-2xl mx-auto my-5 max-w-4xl
                        ${isDarkMode ? 'bg-gray-700/90 text-gray-100' : 'bg-white/90 text-gray-800'}`}>
          <h1 className={`text-4xl mb-5 font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>打地鼠遊戲</h1>
          <div className={`p-6 rounded-xl my-5 ${isDarkMode ? 'bg-gray-600 border border-gray-500' : 'bg-gray-100 border border-gray-200'}`}>
            <h2 className={`text-2xl mb-5 font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>遊戲規則</h2>
            <div className="flex justify-center gap-8 my-6 flex-wrap">
              <div className={`p-5 rounded-xl w-52 transition-all duration-300
                              ${isDarkMode ? 'bg-gray-700 border border-gray-500' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <div className="w-28 h-28 mx-auto mb-4 bg-center bg-no-repeat bg-contain" style={{backgroundImage: 'url(/game/mouse/normal-mole.svg)'}}></div>
                <p className="text-lg">普通地鼠</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>+1 分</p>
              </div>
              <div className={`p-5 rounded-xl w-52 transition-all duration-300
                              ${isDarkMode ? 'bg-gray-700 border border-gray-500' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <div className="w-28 h-28 mx-auto mb-4 bg-center bg-no-repeat bg-contain" style={{backgroundImage: 'url(/game/mouse/golden-mole.svg)'}}></div>
                <p className="text-lg">金色地鼠</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>+5 分</p>
              </div>
              <div className={`p-5 rounded-xl w-52 transition-all duration-300
                              ${isDarkMode ? 'bg-gray-700 border border-gray-500' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <div className="w-28 h-28 mx-auto mb-4 bg-center bg-no-repeat bg-contain" style={{backgroundImage: 'url(/game/mouse/bomb-mole.svg)'}}></div>
                <p className="text-lg">炸彈地鼠</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>-3 分</p>
              </div>
            </div>
            <div className={`text-left p-4 rounded-lg mt-5 ${isDarkMode ? 'bg-gray-700 border border-gray-500' : 'bg-white border border-gray-200'}`}>
              <p>遊戲時間：每輪 15 秒，共兩輪</p>
              <p>目標：打中越多地鼠獲得越高分數</p>
              <p>注意：</p>
              <p>- 避開炸彈地鼠，否則會扣 3 分</p>
              <p>- 沒打中地鼠會扣 1 分</p>
              <p>- 第二輪地鼠出現速度會更快</p>
            </div>
          </div>
          <button 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl py-3 px-10 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-bold"
            onClick={startGame}
          >
            開始遊戲
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-around mb-8 p-5 rounded-xl backdrop-blur-md bg-white/10 border border-white/20">
            <div className="text-2xl font-bold p-3 px-8">第 {round} 輪</div>
            <div className="text-2xl font-bold p-3 px-8">分數: {score}</div>
            <div className="text-2xl font-bold p-3 px-8">時間: {timeLeft}秒</div>
          </div>
          <div className="grid grid-cols-3 gap-10 max-w-4xl mx-auto p-5">
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i}
                className={`relative aspect-square rounded-full cursor-pointer overflow-hidden transition-all duration-300 shadow-inner
                           ${isDarkMode ? 'bg-amber-700' : 'bg-amber-200'}
                           ${activeMole === i ? 'active' : ''}
                           ${wrongHit === i ? 'wrong' : ''}
                           ${missedMole === i ? 'missed' : ''}`}
                onClick={() => handleMoleClick(i)}
              >
                {activeMole === i && (
                  <div 
                    className="absolute bottom-0 left-0 w-full h-full bg-center bg-no-repeat bg-contain transform transition-transform duration-200 origin-bottom animate-popUp"
                    style={{
                      backgroundImage: activeMoleType === 'normal' 
                                       ? 'url(/game/mouse/normal-mole.svg)' 
                                       : activeMoleType === 'golden' 
                                       ? 'url(/game/mouse/golden-mole.svg)' 
                                       : 'url(/game/mouse/bomb-mole.svg)'
                    }}
                  ></div>
                )}
                {(wrongHit === i || missedMole === i) && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-red-600 font-bold z-10
                                  animate-wrongMark shadow-red-500/50">✕</div>
                )}
                {(wrongHit === i || missedMole === i) && (
                  <div className="absolute inset-0 bg-red-500/40 rounded-full animate-wrongPulse"></div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {isResting && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className={`p-10 rounded-xl text-center shadow-2xl
                          ${isDarkMode ? 'bg-gray-800/95 text-gray-100' : 'bg-white/95 text-gray-800'}`}>
            <h2 className="text-3xl mb-5 text-yellow-400 font-bold">第 {round} 輪結束！</h2>
            <p className="text-xl mb-2">目前分數：{score}</p>
            <p className="text-xl mb-2">準備開始第 {round + 1} 輪...</p>
            <p className={`text-lg mt-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>注意：地鼠會更快了！</p>
          </div>
        </div>
      )}
      {showFinalScore && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className={`p-10 rounded-xl text-center min-w-[400px] shadow-2xl
                          ${isDarkMode ? 'bg-gray-800/95 text-gray-100' : 'bg-white/95 text-gray-800'}`}>
            <h2 className="text-4xl mb-8 text-yellow-400 font-bold animate-pulse">遊戲結束！</h2>
            <div className={`p-6 rounded-xl mb-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className="text-lg opacity-80">最終得分</p>
              <p className={`text-5xl my-3 font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{finalScore}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-bold"
                onClick={startGame}
              >
                再玩一次
              </button>
              <button 
                className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-bold"
                onClick={returnToStart}
              >
                返回開始畫面
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
