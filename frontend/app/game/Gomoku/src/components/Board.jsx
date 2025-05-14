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
      {/*  inset-0 等同於
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;*/}
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
                // React需要的唯一key，格式為"h-索引號"
                key={`h-${index}`}

                // 線條起點x座標（左端）
                x1="0%"

                // 線條起點y座標（根據索引計算百分比位置）
                // 例如：size=15，index=0時，y1="0%"
                //      size=15，index=14時，y1="100%"
                y1={`${(index / (size - 1)) * 100}%`}

                // 線條終點x座標（右端）
                x2="100%"

                // 線條終點y座標（與y1相同，形成水平線）
                y2={`${(index / (size - 1)) * 100}%`}

                // 線條顏色（黑色70%透明度）
                stroke="rgba(0, 0, 0, 0.7)"

                // 線條寬度為1個單位
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

        {/* SVG 座標系統是從左上角開始：
          x軸 (left)
            0%  = 最左邊
            100% = 最右邊
          y軸 (top)
            0% = 最上邊
            100% = 最下邊
        */}

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
                //cursor-pointer：當滑鼠移到元素上時，游標變成手指指針形狀 (👆) 表示可以點擊
                style={{
                  top: `calc(${rowIndex / (size - 1)} * 100%)`,
                  left: `calc(${colIndex / (size - 1)} * 100%)`,
                  width: '22px',
                  height: '22px',
                  transform: 'translate(-50%, -50%)'
                }}
                // 點擊事件：非禁用狀態才能落子
                //例如常見的disable如當遊戲結束時或是電腦思考時
                onClick={() => !disabled && onSquareClick(rowIndex, colIndex)}
              >
                {/* 只有當 square 有值（黑或白）時才渲染棋子 */}
                {square && (
                  <div
                    // 設置棋子基本樣式
                    // w-full h-full：填滿容器
                    // rounded-full：圓形
                    // 根據棋子顏色設置背景色
                    className={`w-full h-full rounded-full ${
                      square === 'black' ? 'bg-black' : 'bg-white'
                    }`}
                    // 添加立體效果
                    style={{
                      boxShadow: square === 'black'
                        // 黑棋：外陰影 + 內陰影，創造立體感
                        ? '0 1px 2px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(50, 50, 50, 0.6)'
                        // 白棋：淺色陰影，增加層次感
                        : '0 1px 2px rgba(0, 0, 0, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {/* 棋子頂部高光效果 */}
                    {square === 'black' ? (
                      // 黑棋：灰色高光，50%透明度
                      <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-gray-600 opacity-50"></div>
                    ) : (
                      // 白棋：白色高光，80%透明度
                      <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-white opacity-80"></div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 隱形點擊層 - 保持原有網格的點擊行為便於偵錯 */}
        {/* 偵錯功能：
            紅色邊框顯示每個格子範圍，不會干擾原本的點擊功能，可即時檢查對齊問題
            使用時機：
            檢查棋盤格子大小是否均勻，驗證點擊區域是否正確，確認棋子位置是否對齊，這就像在棋盤上蓋了一層透明的描圖紙，需要時才顯示出來檢查。 */}
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