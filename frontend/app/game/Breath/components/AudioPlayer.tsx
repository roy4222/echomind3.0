"use client";
import { useState, useEffect, useRef } from "react";
import type { SyntheticEvent } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("播放錯誤:", error);
            setError("無法播放音訊檔案");
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleError = (e: SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error("音訊載入錯誤:", e);
    setError("音訊檔案載入失敗");
  };

  return (
    <div className="fixed bottom-5 right-5">
      <p className="fonttext-2xl mr-7 dark:text-white text-black text-center">
        音樂播放
      </p>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        onClick={togglePlay}
        className="backdrop-blur-sm p-2 mt-2 px-5 rounded-full hover:bg-white/60 transition-all duration-200 border border-white/50 dark:bg-gray-800 bg-stone-300"
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.75 5.25v13.5m-7.5-13.5v13.5"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z"
            />
          </svg>
        )}
      </button>
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_9e6046dccb.mp3?filename=relaxing-mountains-rivers-126532.mp3"
        onError={handleError}
        className="hidden"
      />
    </div>
  );
}
