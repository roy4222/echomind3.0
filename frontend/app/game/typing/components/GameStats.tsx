import React from "react";
import { Theme } from "./types";

interface GameStatsProps {
  timeLeft: number;
  wpm: number;
  currentTheme: Theme;
}

const GameStats: React.FC<GameStatsProps> = ({ timeLeft, wpm, currentTheme }) => {
  return (
    <>
      <div className={`text-lg mt-2 ${currentTheme.text}`}>
        ⏱ Time：<span className="font-semibold">{timeLeft}</span> s &nbsp; |
        &nbsp; ✍️ Speed：<span className="font-semibold">{wpm}</span> WPM
      </div>
      <div
        className={`text-lg ${currentTheme.secondary} mt-5 text-center`}
        style={{
          opacity: 0.7,
        }}
      >
        press ' Tab ' to restart
      </div>
    </>
  );
};

export default GameStats; 