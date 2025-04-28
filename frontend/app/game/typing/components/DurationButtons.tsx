import React from "react";
import { Theme } from "./types";

interface DurationButtonsProps {
  selectedDuration: number;
  currentTheme: Theme;
  onSelectDuration: (duration: number) => void;
}

const DurationButtons: React.FC<DurationButtonsProps> = ({
  selectedDuration,
  currentTheme,
  onSelectDuration,
}) => {
  return (
    <div className="flex space-x-1 md:space-x-2">
      {[15, 30, 60].map((sec) => (
        <button
          key={sec}
          onClick={() => onSelectDuration(sec)}
          className={`px-2 md:px-3 py-1 md:py-2 rounded-xl text-sm md:text-base cursor-pointer ${
            selectedDuration === sec
              ? `${currentTheme.accent} text-white`
              : `${currentTheme.buttonBg} ${currentTheme.buttonText} ${currentTheme.buttonHover}`
          }`}
        >
          {sec} sec
        </button>
      ))}
    </div>
  );
};

export default DurationButtons; 