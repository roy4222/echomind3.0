import React from "react";
import { Theme } from "./types";

interface WordDisplayProps {
  words: string[];
  currentIndex: number;
  currentTheme: Theme;
}

const WordDisplay: React.FC<WordDisplayProps> = ({
  words,
  currentIndex,
  currentTheme,
}) => {
  return (
    <div
      className={`mb-4 leading-relaxed ${currentTheme.text}`}
      style={{
        height: "150px",
        overflowY: "auto",
      }}
    >
      {words.map((word, index) => {
        let className = "inline-block mr-2 text-lg";

        if (index < currentIndex) {
          className += ` ${currentTheme.secondary}`;
        } else if (index === currentIndex) {
          className += ` ${currentTheme.primary} font-bold`;
        }

        return (
          <span key={index} className={className}>
            {word}
          </span>
        );
      })}
    </div>
  );
};

export default WordDisplay; 