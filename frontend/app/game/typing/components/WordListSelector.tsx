import React from "react";
import { Theme, WordList } from "./types";

interface WordListSelectorProps {
  wordLists: WordList[];
  currentWordList: number;
  currentTheme: Theme;
  showWordListSelector: boolean;
  onToggleWordList: (index: number) => void;
  onToggleSelector: () => void;
}

const WordListSelector: React.FC<WordListSelectorProps> = ({
  wordLists,
  currentWordList,
  currentTheme,
  showWordListSelector,
  onToggleWordList,
  onToggleSelector,
}) => {
  return (
    <div className="relative wordlist-selector">
      <button
        onClick={onToggleSelector}
        className={`px-2 md:px-4 py-1 md:py-2 rounded-xl text-sm md:text-base ${currentTheme.buttonBg} ${currentTheme.buttonText} flex items-center cursor-pointer`}
      >
        {wordLists[currentWordList].name}
      </button>

      {showWordListSelector && (
        <div
          className={`absolute right-0 mt-2 w-48 ${currentTheme.containerBg} rounded shadow-lg z-10 border ${currentTheme.inputBorder}`}
        >
          {wordLists.map((list, index) => (
            <button
              key={index}
              onClick={() => onToggleWordList(index)}
              className={`w-full text-left px-4 py-2 ${
                currentTheme.buttonHover
              } ${currentWordList === index ? "font-bold" : ""} ${
                currentTheme.text
              }`}
            >
              {list.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WordListSelector; 