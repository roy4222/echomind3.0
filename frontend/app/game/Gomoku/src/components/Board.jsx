import Square from './Square';

/**
 * Board 組件 - 遊戲棋盤
 * @param {Object} props - 組件屬性
 * @param {Array} props.board - 棋盤狀態，二維陣列
 * @param {Function} props.onSquareClick - 格子點擊處理函數
 * @param {boolean} props.disabled - 是否禁用棋盤交互，用於電腦思考時
 */
const Board = ({ board, onSquareClick, disabled = false }) => {
  // 棋盤大小
  const size = board.length;

  return (
    <div 
      className={`relative w-full p-2 rounded-lg overflow-hidden ${disabled ? 'cursor-not-allowed opacity-90' : ''}`}
      style={{
        background: '#E6C588',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div className="relative w-full h-full aspect-square">
        {/* 棋盤線條 - 使用單一線條顏色並調整透明度，避免疊加效果 */}
        <div className="absolute inset-0">
          {/* 繪製所有線條 */}
          <svg 
            width="100%" 
            height="100%" 
            className="absolute inset-0" 
            style={{ zIndex: 1 }}
          >
            {/* 水平線 */}
            {Array.from({ length: size }).map((_, index) => (
              <line 
                key={`h-${index}`} 
                x1="0%" 
                y1={`${(index / (size - 1)) * 100}%`} 
                x2="100%" 
                y2={`${(index / (size - 1)) * 100}%`} 
                stroke="rgba(0, 0, 0, 0.7)" 
                strokeWidth="1"
              />
            ))}
            
            {/* 垂直線 */}
            {Array.from({ length: size }).map((_, index) => (
              <line 
                key={`v-${index}`} 
                x1={`${(index / (size - 1)) * 100}%`} 
                y1="0%" 
                x2={`${(index / (size - 1)) * 100}%`} 
                y2="100%" 
                stroke="rgba(0, 0, 0, 0.7)" 
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
        
        {/* 標準的五個星位點 */}
        <div className="absolute w-[6px] h-[6px] bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"
             style={{ top: 'calc((3/14) * 100%)', left: 'calc((3/14) * 100%)', zIndex: 2 }}></div>
        <div className="absolute w-[6px] h-[6px] bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2" 
             style={{ top: 'calc((3/14) * 100%)', left: 'calc((11/14) * 100%)', zIndex: 2 }}></div>
        <div className="absolute w-[6px] h-[6px] bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"
             style={{ top: 'calc((7/14) * 100%)', left: 'calc((7/14) * 100%)', zIndex: 2 }}></div>
        <div className="absolute w-[6px] h-[6px] bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"
             style={{ top: 'calc((11/14) * 100%)', left: 'calc((3/14) * 100%)', zIndex: 2 }}></div>
        <div className="absolute w-[6px] h-[6px] bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"
             style={{ top: 'calc((11/14) * 100%)', left: 'calc((11/14) * 100%)', zIndex: 2 }}></div>
        
        {/* 交叉點及棋子 - 直接在交叉點繪製棋子 */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {board.map((row, rowIndex) => 
            row.map((square, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className="absolute cursor-pointer"
                style={{
                  top: `calc(${rowIndex / (size - 1)} * 100%)`,
                  left: `calc(${colIndex / (size - 1)} * 100%)`,
                  width: '22px',
                  height: '22px',
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => !disabled && onSquareClick(rowIndex, colIndex)}
              >
                {square && (
                  <div 
                    className={`w-full h-full rounded-full ${
                      square === 'black' 
                        ? 'bg-black' 
                        : 'bg-white'
                    }`}
                    style={{
                      boxShadow: square === 'black' 
                        ? '0 1px 2px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(50, 50, 50, 0.6)' 
                        : '0 1px 2px rgba(0, 0, 0, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {/* 棋子高光 */}
                    {square === 'black' ? (
                      <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-gray-600 opacity-50"></div>
                    ) : (
                      <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-white opacity-80"></div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        {/* 隱形點擊層 - 保持原有網格的點擊行為便於偵錯 */}
        <div 
          className="absolute inset-0 grid opacity-0 pointer-events-none"
          style={{ 
            gridTemplateColumns: `repeat(${size}, 1fr)`, 
            gridTemplateRows: `repeat(${size}, 1fr)`,
          }}
        >
          {board.map((row, rowIndex) => 
            row.map((square, colIndex) => (
              <div 
                key={`debug-${rowIndex}-${colIndex}`} 
                className="border border-red-500"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Board; 