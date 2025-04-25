/**
 * Square 組件 - 渲染單個棋盤格子
 * @param {Object} props - 組件屬性
 * @param {string} props.value - 格子的值 ('black', 'white', 或 null)
 * @param {Function} props.onClick - 點擊事件處理函數
 * @param {Number} props.row - 行號
 * @param {Number} props.col - 列號
 * @param {boolean} props.disabled - 是否禁用交互
 */
const Square = ({ value, onClick, row, col, disabled = false }) => (
  <div 
    className={`w-8 h-8 relative cursor-pointer ${disabled && !value ? 'cursor-not-allowed' : value ? 'cursor-default' : ''}`}
    onClick={onClick}
  >
    {/* 顯示格線 */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute w-full h-[1px] bg-gray-800"></div>
      <div className="absolute h-full w-[1px] bg-gray-800"></div>
    </div>
    
    {/* 顯示棋子 */}
    {value && (
      <div 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full ${
          value === 'black' ? 'bg-gray-800' : 'bg-white border border-gray-300'
        }`}
      />
    )}
  </div>
);

export default Square; 