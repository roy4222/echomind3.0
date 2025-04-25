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
    <div className={`relative mb-8 bg-wood p-1 shadow-md rounded-md ${disabled ? 'cursor-not-allowed opacity-90' : ''}`}>
      {/* 棋盤格子 */}
      <div className="grid grid-cols-15 gap-0">
        {board.map((row, rowIndex) => 
          row.map((square, colIndex) => (
            <Square 
              key={`${rowIndex}-${colIndex}`} 
              value={square} 
              row={rowIndex}
              col={colIndex}
              onClick={() => !disabled && onSquareClick(rowIndex, colIndex)} 
              disabled={disabled}
            />
          ))
        )}
      </div>
      
      {/* 棋盤邊框 */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gray-800"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-800"></div>
      <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gray-800"></div>
      <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gray-800"></div>
    </div>
  );
};

export default Board; 