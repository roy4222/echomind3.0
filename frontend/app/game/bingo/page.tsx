import { useState, useEffect, useCallback } from 'react';

interface GameSettings {
  gridSize: number;
  numberRange: number;
  callLimit: number;
  mode: 'classic' | 'quick' | 'challenge';
}

export default function BingoGame() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  // 遊戲設置
  const [settings, setSettings] = useState<GameSettings>({
    gridSize: 5,
    numberRange: 50,
    callLimit: 15,
    mode: 'classic'
  });

  const [board, setBoard] = useState<number[]>([]);
  const [marked, setMarked] = useState<boolean[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [remainingCalls, setRemainingCalls] = useState(settings.callLimit);
  const [showSettings, setShowSettings] = useState(false);

  // 音效
  useEffect(() => {
    const playSound = (soundName: string) => {
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audio.play().catch(e => console.log('音效播放失敗:', e));
    };

    if (gameWon) {
      playSound('win');
    } else if (gameLost) {
      playSound('lose');
    }
  }, [gameWon, gameLost]);

  // 初始化遊戲板
  const initializeBoard = () => {
    const boardSize = settings.gridSize * settings.gridSize;
    const numbers = Array.from({ length: boardSize }, (_, i) => 
      Math.floor(Math.random() * (settings.numberRange + 1))
    );
    setBoard(numbers);
    setMarked(new Array(boardSize).fill(false));
    setGameStarted(true);
    setGameWon(false);
    setGameLost(false);
    setWinningLine([]);
    setCalledNumbers([]);
    setCurrentNumber(null);
    setRemainingCalls(settings.callLimit);
  };

  // 根據模式設置遊戲參數
  const setGameMode = (mode: 'classic' | 'quick' | 'challenge') => {
    switch (mode) {
      case 'classic':
        setSettings(prev => ({
          ...prev,
          mode,
          gridSize: 5,
          numberRange: 50,
          callLimit: 15
        }));
        break;
      case 'quick':
        setSettings(prev => ({
          ...prev,
          mode,
          gridSize: 3,
          numberRange: 25,
          callLimit: 8
        }));
        break;
      case 'challenge':
        setSettings(prev => ({
          ...prev,
          mode,
          gridSize: 7,
          numberRange: 75,
          callLimit: 20
        }));
        break;
    }
  };

  // 檢查是否連線
  const checkForWin = useCallback((markedArray: boolean[]) => {
    const size = settings.gridSize;
    const winPatterns: number[][] = [];
    
    // 檢查橫列
    for (let row = 0; row < size; row++) {
      const pattern = [];
      for (let col = 0; col < size; col++) {
        pattern.push(row * size + col);
      }
      winPatterns.push(pattern);
    }
    
    // 檢查直行
    for (let col = 0; col < size; col++) {
      const pattern = [];
      for (let row = 0; row < size; row++) {
        pattern.push(row * size + col);
      }
      winPatterns.push(pattern);
    }
    
    // 檢查對角線（左上到右下）
    const diag1 = [];
    for (let i = 0; i < size; i++) {
      diag1.push(i * size + i);
    }
    winPatterns.push(diag1);
    
    // 檢查對角線（右上到左下）
    const diag2 = [];
    for (let i = 0; i < size; i++) {
      diag2.push(i * size + (size - 1 - i));
    }
    winPatterns.push(diag2);
    
    // 檢查所有可能的連線
    for (const pattern of winPatterns) {
      if (pattern.every(index => markedArray[index])) {
        setWinningLine(pattern);
        return true;
      }
    }
    
    return false;
  }, [settings.gridSize]);

  // 叫號
  const callNumber = () => {
    if (gameWon || gameLost || remainingCalls <= 0) return;
    
    // 從未叫過的號碼中隨機選一個
    const availableNumbers = Array.from({ length: settings.numberRange + 1 }, (_, i) => i)
      .filter(n => !calledNumbers.includes(n));
    
    if (availableNumbers.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const number = availableNumbers[randomIndex];
    
    setCurrentNumber(number);
    setCalledNumbers(prev => [...prev, number]);
    setRemainingCalls(prev => prev - 1);
    
    // 檢查是否輸了
    if (remainingCalls <= 1 && !board.includes(number)) {
      setGameLost(true);
    }
  };

  // 點擊格子
  const handleCellClick = (index: number) => {
    if (gameWon || gameLost) return;
    if (currentNumber === null || board[index] !== currentNumber) return;
    
    const newMarked = [...marked];
    newMarked[index] = true;
    setMarked(newMarked);
    
    // 檢查是否贏了
    if (checkForWin(newMarked)) {
      setGameWon(true);
    }
  };

  return (
    <main className={`min-h-screen py-8 px-4 font-sans ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-b from-indigo-50 via-white to-indigo-50 text-gray-800'
    } transition-all duration-500`}>
      <div className="container mx-auto max-w-5xl">
        <header className="flex justify-between items-center mb-8">
          <div className="w-12"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-center tracking-wide">
            賓果遊戲
          </h1>
          
          <button
            onClick={() => setIsDarkMode(prev => !prev)}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-110 shadow-md ${
              isDarkMode 
                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
            }`}
            aria-label={isDarkMode ? '切換至白天模式' : '切換至深夜模式'}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </header>
        
        {!gameStarted && (
          <div className="flex flex-col items-center">
            <section className={`w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden ${
              isDarkMode ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white ring-1 ring-gray-100'
            }`}>
              <div className={`px-6 py-5 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className="text-2xl font-bold">遊戲規則</h2>
              </div>
              <div className="px-6 py-5">
                <ul className="list-disc pl-5 space-y-3 mb-6">
                  <li>點擊「開始遊戲」按鈕開始新遊戲</li>
                  <li>點擊「叫號」按鈕來叫出下一個數字（0-{settings.numberRange}）</li>
                  <li>只能標記當前叫到的數字</li>
                  <li>完成一條線（橫、直或斜）即可獲勝</li>
                  <li>叫號次數限制為 {settings.callLimit} 次</li>
                  <li className={`font-medium ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    目前模式：{
                      settings.mode === 'classic' ? '經典模式' :
                      settings.mode === 'quick' ? '快速模式' :
                      '挑戰模式'
                    }
                  </li>
                </ul>
              </div>
            </section>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowSettings(true)}
                className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-md ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                遊戲設置
              </button>
              <button
                onClick={initializeBoard}
                className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-md ${
                  isDarkMode 
                    ? 'bg-indigo-600 hover:bg-indigo-500' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                開始遊戲
              </button>
            </div>
          </div>
        )}
        
        {gameStarted && (
          <div className={`rounded-2xl shadow-xl overflow-hidden ${
            isDarkMode ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white ring-1 ring-gray-100'
          }`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className={`px-4 py-2 rounded-lg font-bold shadow-sm ${
                  isDarkMode 
                    ? 'bg-red-900/30 text-red-400 ring-1 ring-red-900/50' 
                    : 'bg-red-50 text-red-600 ring-1 ring-red-100'
                }`}>
                  剩餘叫號：{remainingCalls}
                </div>
                
                <div className="flex items-center gap-3">
                  {currentNumber !== null && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm ${
                      isDarkMode 
                        ? 'bg-blue-900/30 text-blue-400 ring-1 ring-blue-900/50' 
                        : 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
                    }`}>
                      <span className="opacity-70 text-sm">當前</span>
                      <span className="text-xl font-bold">{currentNumber}</span>
                    </div>
                  )}
                  
                  <button
                    onClick={callNumber}
                    disabled={gameWon || gameLost || remainingCalls === 0}
                    className={`px-5 py-2 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 shadow-md ${
                      isDarkMode 
                        ? 'bg-green-600 hover:bg-green-500 disabled:bg-gray-700' 
                        : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300'
                    }`}
                  >
                    叫號
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className={`px-4 py-3 rounded-lg text-sm mb-5 shadow-sm ${
                isDarkMode 
                  ? 'bg-gray-900 text-gray-300 ring-1 ring-gray-800' 
                  : 'bg-gray-50 text-gray-600 ring-1 ring-gray-100'
              }`}>
                <span className="font-medium">已叫出：</span>
                {calledNumbers.length > 0 
                  ? calledNumbers.join('、') 
                  : <span className="italic opacity-70">尚未叫號</span>
                }
              </div>

              <div 
                className="grid gap-2 p-4 mb-5 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${settings.gridSize}, minmax(0, 1fr))`,
                  maxWidth: settings.gridSize === 3 ? '280px' : 
                           settings.gridSize === 5 ? '380px' : '480px'
                }}
              >
                {board.map((number, index) => (
                  <div
                    key={index}
                    onClick={() => handleCellClick(index)}
                    className={`
                      aspect-square flex items-center justify-center text-xl font-bold
                      border-2 rounded-lg cursor-pointer transition-all duration-200 shadow-sm
                      ${marked[index] 
                        ? isDarkMode 
                          ? 'bg-green-900/50 border-green-700 text-green-400' 
                          : 'bg-green-100 border-green-500 text-green-800'
                        : isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                          : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
                      }
                      ${winningLine.includes(index)
                        ? isDarkMode
                          ? 'bg-amber-900/50 border-amber-600 text-amber-400 animate-pulse shadow-lg'
                          : 'bg-amber-100 border-amber-500 text-amber-800 animate-pulse shadow-lg'
                        : ''
                      }
                      ${currentNumber === number
                        ? isDarkMode
                          ? 'ring-2 ring-blue-500/70 shadow-md'
                          : 'ring-2 ring-blue-500/70 shadow-md'
                        : ''
                      }
                      ${!marked[index] && currentNumber === number
                        ? 'transform hover:scale-105 hover:-rotate-1'
                        : ''
                      }
                    `}
                  >
                    {number}
                  </div>
                ))}
              </div>
              
              {gameWon && (
                <div className={`py-3 px-4 mb-5 rounded-lg text-center animate-bounce shadow-md ${
                  isDarkMode 
                    ? 'bg-green-900/30 border border-green-800 text-green-400' 
                    : 'bg-green-50 border border-green-200 text-green-600'
                }`}>
                  <p className="text-xl font-bold">🎉 恭喜你贏了！ 🎉</p>
                </div>
              )}
              
              {gameLost && (
                <div className={`py-3 px-4 mb-5 rounded-lg text-center shadow-md ${
                  isDarkMode 
                    ? 'bg-red-900/30 border border-red-800 text-red-400' 
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  <p className="text-xl font-bold">😢 遊戲結束！未能在限定次數內完成連線 😢</p>
                </div>
              )}
              
              {(gameWon || gameLost) ? (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={initializeBoard}
                    className={`px-5 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-md ${
                      isDarkMode 
                        ? 'bg-indigo-600 hover:bg-indigo-500' 
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    }`}
                  >
                    重新開始
                  </button>
                  <button
                    onClick={() => {
                      setGameStarted(false);
                      setGameWon(false);
                      setGameLost(false);
                      setBoard([]);
                      setMarked([]);
                      setWinningLine([]);
                      setCalledNumbers([]);
                      setCurrentNumber(null);
                    }}
                    className={`px-5 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-md ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    回主選單
                  </button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    onClick={initializeBoard}
                    className={`px-5 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-md ${
                      isDarkMode 
                        ? 'bg-indigo-600 hover:bg-indigo-500' 
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    }`}
                  >
                    重新開始
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${
              isDarkMode ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white ring-1 ring-gray-200'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 pb-4 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>遊戲設置</h2>
              
              <div className="mb-6">
                <label className={`block text-lg font-medium mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>遊戲模式</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setGameMode('classic')}
                    className={`p-3 rounded-lg text-center transition-all ${
                      settings.mode === 'classic'
                        ? isDarkMode 
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-500 shadow-md transform scale-105' 
                          : 'bg-indigo-500 text-white ring-2 ring-indigo-400 shadow-md transform scale-105'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    經典模式
                    <div className="text-xs mt-1 font-medium">5x5 格</div>
                  </button>
                  <button
                    onClick={() => setGameMode('quick')}
                    className={`p-3 rounded-lg text-center transition-all ${
                      settings.mode === 'quick'
                        ? isDarkMode 
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-500 shadow-md transform scale-105' 
                          : 'bg-indigo-500 text-white ring-2 ring-indigo-400 shadow-md transform scale-105'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    快速模式
                    <div className="text-xs mt-1 font-medium">3x3 格</div>
                  </button>
                  <button
                    onClick={() => setGameMode('challenge')}
                    className={`p-3 rounded-lg text-center transition-all ${
                      settings.mode === 'challenge'
                        ? isDarkMode 
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-500 shadow-md transform scale-105' 
                          : 'bg-indigo-500 text-white ring-2 ring-indigo-400 shadow-md transform scale-105'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    挑戰模式
                    <div className="text-xs mt-1 font-medium">7x7 格</div>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className={`px-5 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-md ${
                    isDarkMode 
                      ? 'bg-indigo-600 hover:bg-indigo-500' 
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  }`}
                >
                  確定
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
