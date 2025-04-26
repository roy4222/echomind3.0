"use client"; // 標記為客戶端組件

import { useTypingGame } from "./hooks/useTypingGame";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { wordLists } from "./data/wordLists";
import { themes } from "./data/themes";

// Components
import DurationButtons from "./components/DurationButtons";
import WordListSelector from "./components/WordListSelector";
import ThemeSelector from "./components/ThemeSelector";
import WordDisplay from "./components/WordDisplay";
import InputField from "./components/InputField";
import GameStats from "./components/GameStats";
import BackButton from "./components/BackButton";

export default function Home() {
  const {
    inputRef,
    words,
    currentIndex,
    userInput,
    timeLeft,
    wpm,
    gameStarted,
    gameEnded,
    selectedDuration,
    currentWordCorrect,
    currentTheme,
    showThemeSelector,
    currentWordList,
    showWordListSelector,
    startGame,
    restartGame,
    toggleTheme,
    toggleWordList,
    handleInputChange,
    handleKeyDown,
    toggleThemeSelector,
    toggleWordListSelector,
  } = useTypingGame(wordLists);

  // 當前正在使用的主題數據
  const currentThemeData = themes[currentTheme];

  

  // 渲染 UI
  return (
    <div
      className={`min-h-screen ${currentThemeData.background} flex flex-col items-center justify-center py-10 px-4 transition-colors duration-300`}
      tabIndex={0}
    >
      <div className="flex justify-start w-full mt-4 ml-4">
        <BackButton 
          text="返回遊戲介紹"
        />
      </div>

      <div className="flex flex-col items-center w-full max-w-2xl lg:max-w-3xl">

        <h1
          className={`font-bold ${currentThemeData.text} mb-5 md:mb-7 text-center`}
          style={{
            fontSize: "clamp(2rem, 5vw, 2.8rem)",
            fontFamily: "monospace",
          }}
        >
          ⌨️Typing Game🖱️
        </h1>

        <div className="flex justify-between items-center w-full mb-4 flex-wrap gap-2">
          {/* 時間選擇按鈕 */}
          <DurationButtons
            selectedDuration={selectedDuration}
            currentTheme={currentThemeData}
            onSelectDuration={startGame}
          />

          <div className="flex space-x-2">
            {/* 單字列表選擇器 */}
            <WordListSelector
              wordLists={wordLists}
              currentWordList={currentWordList}
              currentTheme={currentThemeData}
              showWordListSelector={showWordListSelector}
              onToggleWordList={toggleWordList}
              onToggleSelector={toggleWordListSelector}
            />

            {/* 主題選擇器 */}
            <ThemeSelector
              themes={themes}
              currentTheme={currentTheme}
              currentThemeData={currentThemeData}
              showThemeSelector={showThemeSelector}
              onToggleTheme={toggleTheme}
              onToggleSelector={toggleThemeSelector}
            />
          </div>
        </div>
      </div>

      {/* 主遊戲區域 */}
      <div
        className={`shadow-md p-4 sm:p-6 w-full max-w-2xl lg:max-w-3xl mb-4 rounded-xl ${currentThemeData.containerBg}`}
      >
        <WordDisplay
          words={words}
          currentIndex={currentIndex}
          currentTheme={currentThemeData}
        />
        <InputField
          inputRef={inputRef as React.RefObject<HTMLInputElement>}
          userInput={userInput}
          currentWordCorrect={currentWordCorrect}
          gameEnded={gameEnded}
          currentTheme={currentThemeData}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* 遊戲狀態顯示 */}
      <GameStats
        timeLeft={timeLeft}
        wpm={wpm}
        currentTheme={currentThemeData}
      />
    </div>
  );
}
