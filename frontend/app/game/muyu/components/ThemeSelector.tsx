import { ThemeSet } from "./types";

/**
 * 主題選擇按鈕組件
 * @param themes - 可用主題集合
 * @param currentTheme - 當前選中主題
 * @param onThemeChange - 主題切換回調函數
 */
const ThemeSelector = ({
  themes,
  currentTheme,
  onThemeChange,
}: {
  themes: ThemeSet[];
  currentTheme: ThemeSet;
  onThemeChange: (theme: ThemeSet) => void;
}) => (
  <div className="flex gap-4 mb-8">
    {themes.map((set) => (
      <button
        key={set.name}
        onClick={() => onThemeChange(set)}
        className={`
          px-4 py-2 
          rounded-xl
          font-cute
          text-lg
          transition-all
          duration-200
          shadow-md
          hover:shadow-xl
          hover:scale-105
          ${
            currentTheme.name === set.name
              ? `${set.theme.background} text-white font-bold`
              : `bg-white/90 hover:bg-white ${set.theme.textColor}`
          }
        `}
      >
        {set.name}
      </button>
    ))}
  </div>
);

export default ThemeSelector; 