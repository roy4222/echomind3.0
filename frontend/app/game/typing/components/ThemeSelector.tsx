import React from "react";
import { Theme, ThemeRecord } from "./types";

interface ThemeSelectorProps {
  themes: ThemeRecord;
  currentTheme: string;
  currentThemeData: Theme;
  showThemeSelector: boolean;
  onToggleTheme: (themeName: string) => void;
  onToggleSelector: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  currentTheme,
  currentThemeData,
  showThemeSelector,
  onToggleTheme,
  onToggleSelector,
}) => {
  return (
    <div className="relative theme-selector">
      <button
        onClick={onToggleSelector}
        className={`px-2 md:px-4 py-1 md:py-2 rounded-xl text-sm md:text-base ${currentThemeData.accent} text-white flex items-center cursor-pointer`}
      >
        <span className="mr-1">🎨</span> {currentThemeData.name}
      </button>

      {showThemeSelector && (
        <div
          className={`absolute right-0 mt-2 w-48 ${currentThemeData.containerBg} rounded shadow-lg z-10 border ${currentThemeData.inputBorder}`}
        >
          {Object.keys(themes).map((themeName) => (
            <button
              key={themeName}
              onClick={() => onToggleTheme(themeName)}
              className={`w-full text-left px-4 py-2 ${
                themes[themeName].buttonHover
              } ${currentTheme === themeName ? "font-bold" : ""} ${
                themes[themeName].text
              } flex items-center justify-between`}
            >
              <span>{themes[themeName].name}</span>
              <div className="flex space-x-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: themes[themeName].primaryColor,
                  }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: themes[themeName].secondaryColor,
                  }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: themes[themeName].accentColor,
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector; 