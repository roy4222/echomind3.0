/**
 * 計數器顯示組件
 * @param count - 當前計數值
 * @param textColor - 文字顏色樣式
 */
const Counter = ({ count, textColor }: { count: number; textColor: string }) => (
  <div className={`mt-8 text-2xl font-bold font-cute ${textColor}`}>
    歐趴數：{count}
  </div>
);

export default Counter; 