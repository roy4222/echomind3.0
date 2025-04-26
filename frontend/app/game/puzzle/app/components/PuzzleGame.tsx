import { useEffect, useState } from "react";
import { PuzzleGameProps, PuzzlePiece } from '../types';
import { puzzleThemes } from '../constants/puzzleThemes';
import { GameStatusPanel } from './GameStatusPanel';
import { initializePuzzlePieces, checkGameCompletion } from '../utils/gameUtils';
import Image from "next/image";

export const PuzzleGame = ({ theme, difficulty }: PuzzleGameProps) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const themeData = puzzleThemes.find(t => t.id === theme);

  // 初始化遊戲
  const initializeGame = () => {
    if (!themeData) return;
    const shuffledPieces = initializePuzzlePieces(difficulty);
    setPieces(shuffledPieces);
    setMoves(0);
    setTime(0);
    setIsCompleted(false);
    setDraggedPiece(null);
    setIsPaused(false);
  };

  // 遊戲初始化
  useEffect(() => {
    initializeGame();
  }, [themeData, difficulty]);

  // 計時器
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;

    if (gameStarted && !isCompleted && !isPaused) {
      timerInterval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [gameStarted, isCompleted, isPaused]);

  // 檢查遊戲是否完成
  useEffect(() => {
    if (pieces.length === 0 || !gameStarted) return;
    const isComplete = checkGameCompletion(pieces);
    if (isComplete) {
      setIsCompleted(true);
    }
  }, [pieces, gameStarted]);

  // 切換暫停/繼續遊戲
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // 開始拖曳
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (!gameStarted || isCompleted || isPaused) return;
    
    console.log(`開始拖曳: 位置 ${index}`);
    
    // 儲存拖曳的拼圖位置索引
    setDraggedPiece(index);
    
    // 設定視覺反饋
    e.currentTarget.style.opacity = '0.5';
    
    // 儲存資料以便在 drop 時恢復
    try {
      // 只設置一種資料類型，避免重複設置
      e.dataTransfer.setData('text/plain', index.toString());
    } catch (err) {
      console.error('設定拖曳資料失敗，使用狀態備份:', err);
    }
    
    e.dataTransfer.effectAllowed = 'move';
    
    // 標記元素，方便識別
    e.currentTarget.setAttribute('data-dragging', 'true');
  };

  // 結束拖曳
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // 重設樣式和屬性
    e.currentTarget.style.opacity = '1';
    e.currentTarget.removeAttribute('data-dragging');
    
    console.log(`拖曳結束，重設狀態`);
    
    // 確保在拖曳結束時重設狀態
    setTimeout(() => {
      if (draggedPiece !== null) {
        setDraggedPiece(null);
      }
    }, 100);
  };

  // 拖曳經過目標區域
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isPaused) return;
    
    e.preventDefault(); // 必須阻止預設行為，否則無法執行 drop
    e.stopPropagation(); // 防止事件冒泡
    e.dataTransfer.dropEffect = 'move';
  };

  // 拖曳進入目標區域
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (isPaused) return;
    
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-100');
  };

  // 拖曳離開目標區域
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (isPaused) return;
    
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-100');
  };

  // 放置拖曳物件
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    if (isPaused) return;
    
    e.preventDefault();
    e.stopPropagation(); // 防止事件冒泡
    
    // 移除視覺提示
    e.currentTarget.classList.remove('bg-blue-100');
    
    // 嘗試從多種來源獲取拖曳索引
    let dragIndex: number | null = null;
    
    // 1. 嘗試從 dataTransfer 獲取
    try {
      // 嘗試不同的 MIME 類型
      const dataIndex = 
        e.dataTransfer.getData('application/x-puzzle-position') || 
        e.dataTransfer.getData('text/plain');
      
      if (dataIndex && !isNaN(Number(dataIndex))) {
        dragIndex = Number(dataIndex);
        console.log(`從 dataTransfer 獲取拖曳索引: ${dragIndex}`);
      }
    } catch (error) {
      console.error('無法從 dataTransfer 獲取拖曳索引:', error);
    }
    
    // 2. 如果 dataTransfer 失敗，使用狀態中儲存的值
    if (dragIndex === null) {
      dragIndex = draggedPiece;
      console.log(`使用狀態中的拖曳索引: ${dragIndex}`);
    }
    
    // 3. 最後一種方法：查找標記為正在拖曳的元素
    if (dragIndex === null) {
      const draggingEl = document.querySelector('[data-dragging="true"]');
      if (draggingEl) {
        const pos = draggingEl.getAttribute('data-grid-position');
        if (pos && !isNaN(Number(pos))) {
          dragIndex = Number(pos);
          console.log(`從 DOM 屬性獲取拖曳索引: ${dragIndex}`);
        }
      }
    }
    
    // 驗證有效性
    if (dragIndex === null) {
      console.error('找不到拖曳的拼圖索引，拖曳操作取消');
      return;
    }
    
    if (!gameStarted || isCompleted) {
      console.log('遊戲未開始或已完成，拖曳操作取消');
      return;
    }
    
    if (dragIndex === dropIndex) {
      console.log('拖曳到相同位置，無需交換');
      return;
    }
    
    console.log(`交換拼圖塊: 從位置 ${dragIndex} 到位置 ${dropIndex}`);
    
    // 獲取拖曳和目標位置的拼圖塊
    const dragPiece = pieces.find(p => p.currentPosition === dragIndex);
    const dropPiece = pieces.find(p => p.currentPosition === dropIndex);
    
    if (!dragPiece || !dropPiece) {
      console.error('找不到拼圖塊', { dragIndex, dropIndex, pieces });
      return;
    }
    
    // 建立新的拼圖狀態，交換兩個拼圖塊的當前位置
    const newPieces = pieces.map(piece => {
      if (piece.currentPosition === dragIndex) {
        return { ...piece, currentPosition: dropIndex };
      } else if (piece.currentPosition === dropIndex) {
        return { ...piece, currentPosition: dragIndex };
      }
      return piece;
    });
    
    // 更新拼圖狀態
    setPieces(newPieces);
    setMoves(prev => prev + 1);
    setDraggedPiece(null);
    
    // 移除所有可能的拖曳標記
    document.querySelectorAll('[data-dragging="true"]').forEach(el => {
      (el as HTMLElement).removeAttribute('data-dragging');
      (el as HTMLElement).style.opacity = '1';
    });
  };

  // 開始遊戲
  const startGame = () => {
    initializeGame();
    setGameStarted(true);
  };

  // 重新開始遊戲
  const restartGame = () => {
    initializeGame();
    if (!gameStarted) {
      setGameStarted(true);
    }
  };

  if (!themeData) {
    return <div className="text-center text-red-500">找不到選擇的主題</div>;
  }

  // 根據拼圖的當前位置和正確位置計算背景圖片位置
  const calculateBackgroundPosition = (correctPos: number) => {
    const row = Math.floor(correctPos / difficulty);
    const col = correctPos % difficulty;
    
    // 計算背景位置的百分比
    const xPercent = (col / (difficulty - 1)) * 100;
    const yPercent = (row / (difficulty - 1)) * 100;
    
    return `${xPercent}% ${yPercent}%`;
  };

  // 獲取指定位置顯示的拼圖塊
  const getPieceAtPosition = (position: number) => {
    return pieces.find(p => p.currentPosition === position);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
          {themeData.title} - {difficulty}x{difficulty}
        </h2>
        {!gameStarted ? (
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-8 py-3 rounded-full hover:from-gray-800 hover:to-gray-900 transition-all transform hover:scale-105 shadow-lg font-semibold text-lg"
          >
            開始遊戲
          </button>
        ) : isCompleted ? (
          <div className="text-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 shadow-md mb-6">
            <div className="text-2xl font-bold text-gray-800 mb-2">
              恭喜完成！
            </div>
            <div className="flex justify-center gap-8 items-center">
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium text-gray-600">總用時</span>
                <span className="text-xl font-bold text-gray-800">{Math.floor(time / 60)}分{time % 60}秒</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium text-gray-600">移動次數</span>
                <span className="text-xl font-bold text-gray-800">{moves}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <GameStatusPanel
              time={time}
              moves={moves}
              isCompleted={isCompleted}
              onRestart={restartGame}
            />
            
            {/* 暫停/繼續按鈕 - 單一按鈕設計 */}
            <button 
              onClick={togglePause}
              className={`px-6 py-2 rounded-full transition-all duration-300 font-medium shadow-md transform hover:scale-105 ${
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
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-center md:items-start">
        {/* 拼圖遊戲區域 - 移除暫停時的視覺效果，只保留功能限制 */}
        <div
          className="grid gap-1 bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl shadow-xl relative"
          style={{
            gridTemplateColumns: `repeat(${difficulty}, 1fr)`,
            aspectRatio: '1/1',
            width: '100%',
            maxWidth: '600px'
          }}
        >
          {/* 按照網格位置順序渲染拼圖方塊 */}
          {Array.from({ length: difficulty * difficulty }, (_, gridPosition) => {
            // 找到目前顯示在該網格位置的拼圖塊
            const pieceAtPosition = pieces.find(p => p.currentPosition === gridPosition);
            if (!pieceAtPosition) return null;
            
            return (
              <div
                key={`grid-${gridPosition}`}
                draggable={gameStarted && !isCompleted && !isPaused}
                onDragStart={(e) => handleDragStart(e, gridPosition)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, gridPosition)}
                className="relative aspect-square cursor-move hover:z-10 transition-transform hover:scale-[1.02]"
                data-grid-position={gridPosition}
                data-piece-id={pieceAtPosition.id}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center border border-gray-300 shadow-sm rounded-sm"
                  style={{
                    backgroundImage: `url(${themeData.image})`,
                    backgroundSize: `${difficulty * 100}%`,
                    backgroundPosition: calculateBackgroundPosition(pieceAtPosition.correctPosition)
                  }}
                />
              </div>
            );
          })}
        </div>
        
        {/* 可選：顯示原始圖片作為參考 */}
        {gameStarted && (
          <div className="hidden md:block bg-gray-50 p-4 rounded-xl shadow-lg">
            <h3 className="text-lg font-medium mb-3 text-center text-gray-800">參考圖片</h3>
            <div className="relative w-52 h-52 shadow-md rounded-lg overflow-hidden">
              <Image
                src={themeData.image}
                alt={themeData.title}
                fill
                style={{objectFit: "cover"}}
                className="hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 