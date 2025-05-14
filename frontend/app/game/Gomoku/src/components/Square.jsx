// 已經不用了，全部都在Board裡面了
/**
 * Square 組件 - 渲染單個棋盤格子
 * @param {Object} props - 組件屬性
 * @param {string} props.value - 格子的值 ('black', 'white', 或 null)
 * @param {Function} props.onClick - 點擊事件處理函數
 * @param {Number} props.row - 行號
 * @param {Number} props.col - 列號
 * @param {boolean} props.disabled - 是否禁用交互
 * 
 * 注意：此組件已被簡化，實際渲染已移至Board組件中
 */
const Square = ({ value, onClick, row, col, disabled = false }) => (
  <div 
    className={`relative w-full h-full flex items-center justify-center cursor-pointer ${disabled && !value ? 'cursor-not-allowed' : value ? 'cursor-default' : ''}`}
    onClick={onClick}
  >
    {/* 棋子渲染已移至Board組件 */}
  </div>
);

export default Square; 