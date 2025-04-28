import React, { RefObject } from "react";
import { Theme } from "./types";

interface InputFieldProps {
  inputRef: RefObject<HTMLInputElement>;
  userInput: string;
  currentWordCorrect: boolean;
  gameEnded: boolean;
  currentTheme: Theme;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  inputRef,
  userInput,
  currentWordCorrect,
  gameEnded,
  currentTheme,
  onChange,
  onKeyDown,
}) => {
  return (
    <input
      ref={inputRef}
      type="text"
      className={`w-full h-11 border rounded p-2 focus:outline-none focus:ring-2 ${
        currentWordCorrect
          ? `${currentTheme.inputBorder} ${currentTheme.inputFocus} ${currentTheme.text} ${currentTheme.inputBg}`
          : `border-red-500 focus:ring-red-400 ${currentTheme.text} ${currentTheme.inputBg}`
      }`}
      placeholder={
        gameEnded ? "press ' Tab ' to restart" : "Type to start . . ."
      }
      value={userInput}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={gameEnded}
    />
  );
};

export default InputField; 