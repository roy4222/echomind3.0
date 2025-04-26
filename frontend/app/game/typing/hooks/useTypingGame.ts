import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { shuffleWords } from "../data/wordLists";
import { WordList } from "../components/types";
import { themes } from "../data/themes";

export const useTypingGame = (wordLists: WordList[]) => {
  // DOM引用
  const inputRef = useRef<HTMLInputElement>(null);

  // 獲取系統主題
  const { theme: systemTheme } = useTheme();

  // 狀態管理
  const [words, setWords] = useState<string[]>([]); // 當前遊戲中的單詞列表
  const [currentIndex, setCurrentIndex] = useState(0); // 當前輸入的單詞索引
  const [userInput, setUserInput] = useState(""); // 用戶輸入的文字
  const [timeLeft, setTimeLeft] = useState(0); // 剩餘時間
  const [wpm, setWpm] = useState(0); // 每分鐘打字速度
  const [timerRunning, setTimerRunning] = useState(false); // 計時器運行狀態
  const [startTime, setStartTime] = useState<number | null>(null); // 遊戲開始時間
  const [correctChars, setCorrectChars] = useState(0); // 正確輸入的字符數
  const [gameStarted, setGameStarted] = useState(false); // 遊戲是否開始
  const [gameEnded, setGameEnded] = useState(false); // 遊戲是否結束
  const [selectedDuration, setSelectedDuration] = useState(15); // 選擇的遊戲時長
  const [currentWordCorrect, setCurrentWordCorrect] = useState(true); // 當前單詞是否正確
  const [currentTheme, setCurrentTheme] = useState(
    systemTheme === "light" ? "morandi" : "dark"
  ); // 當前主題
  const [showThemeSelector, setShowThemeSelector] = useState(false); // 是否顯示主題選擇器
  const [currentWordList, setCurrentWordList] = useState(0); // 當前選擇的單字列表索引
  const [showWordListSelector, setShowWordListSelector] = useState(false); // 是否顯示單字列表選擇器

  // 計算WPM(每分鐘字數)
  const calculateWPM = () => {
    if (!startTime) return;

    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const adjustedWpm = correctChars / 5 / timeElapsed;

    setWpm(Math.round(adjustedWpm));
  };

  // 開始新遊戲
  const startGame = (duration: number) => {
    setSelectedDuration(duration);
    setWords(shuffleWords(wordLists[currentWordList].words).split(" "));
    setCurrentIndex(0);
    setUserInput("");
    setTimeLeft(duration);
    setWpm(0);
    setCorrectChars(0);
    setStartTime(null);
    setGameStarted(false);
    setGameEnded(false);
    setTimerRunning(false);
    setCurrentWordCorrect(true);
    // 確保在重新開始後將焦點回到輸入框
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // 重新開始遊戲
  const restartGame = () => {
    startGame(selectedDuration);
  };

  // 切換主題
  const toggleTheme = (themeName: string) => {
    setCurrentTheme(themeName);
    setShowThemeSelector(false);
  };

  // 切換單字列表
  const toggleWordList = (index: number) => {
    setCurrentWordList(index);
    setShowWordListSelector(false);
    // 如果遊戲已經開始，重新開始遊戲以使用新的單字列表
    if (gameStarted) {
      setWords(shuffleWords(wordLists[index].words).split(" "));
      setCurrentIndex(0);
      setUserInput("");
      setTimeLeft(selectedDuration);
      setWpm(0);
      setCorrectChars(0);
      setStartTime(null);
      setGameStarted(false);
      setGameEnded(false);
      setTimerRunning(false);
      setCurrentWordCorrect(true);
      // 確保在重新開始後將焦點回到輸入框
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } else {
      // 否則只更新單字列表
      setWords(shuffleWords(wordLists[index].words).split(" "));
    }
  };

  // 處理用戶輸入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    // 首次輸入時啟動遊戲
    if (!gameStarted && value.length > 0) {
      setGameStarted(true);
      setStartTime(Date.now());
      setTimerRunning(true);
    }

    // 如果遊戲已結束，不再處理輸入
    if (gameEnded) return;

    // 檢查當前輸入是否正確
    const currentWord = words[currentIndex];
    const isCorrect = value === currentWord.substring(0, value.length);
    setCurrentWordCorrect(isCorrect);

    // 處理單詞完成
    if (value.endsWith(" ")) {
      // 檢查當前單詞是否完全正確
      const isWordCorrect = value.trim() === currentWord;

      if (isWordCorrect) {
        setCorrectChars((prev) => prev + currentWord.length);
        setCurrentIndex((prev) => prev + 1);
        setUserInput("");
        setCurrentWordCorrect(true);

        // 如果完成所有單詞，重新開始
        if (currentIndex >= words.length - 1) {
          setWords(shuffleWords(wordLists[currentWordList].words).split(" "));
          setCurrentIndex(0);
        }
      } else {
        // 如果單詞不正確，不清空輸入，讓用戶繼續輸入直到正確
        setCorrectChars((prev) => prev + currentWord.length);
      }
    }
  };

  // 處理按鍵事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      restartGame();
    }
  };

  // 切換主題選擇器
  const toggleThemeSelector = () => {
    setShowThemeSelector(!showThemeSelector);
    setShowWordListSelector(false);
  };

  // 切換單字列表選擇器
  const toggleWordListSelector = () => {
    setShowWordListSelector(!showWordListSelector);
    setShowThemeSelector(false);
  };

  // 初始化遊戲
  useEffect(() => {
    // 初始化時設置為15秒
    setWords(shuffleWords(wordLists[currentWordList].words).split(" "));
    setTimeLeft(15);

    // 從本地存儲加載主題
    const savedTheme = localStorage.getItem("typing-theme");
    if (savedTheme && Object.keys(themes).includes(savedTheme)) {
      setCurrentTheme(savedTheme);
    } else {
      // 如果沒有保存的主題，根據系統主題設置默認主題
      setCurrentTheme(systemTheme === "light" ? "morandi" : "dark");
    }

    // 從本地存儲加載單字列表
    const savedWordList = localStorage.getItem("typing-wordlist");
    if (savedWordList) {
      const index = parseInt(savedWordList);
      if (!isNaN(index) && index >= 0 && index < wordLists.length) {
        setCurrentWordList(index);
        setWords(shuffleWords(wordLists[index].words).split(" "));
      }
    }
  }, []); // 只在組件初始化時執行一次

  // systemTheme 變化時更新主題
  useEffect(() => {
    if (!localStorage.getItem("typing-theme")) {
      setCurrentTheme(systemTheme === "light" ? "morandi" : "dark");
    }
  }, [systemTheme]);

  // 計時器邏輯
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      setGameEnded(true);
      calculateWPM();
    }
  }, [timeLeft, timerRunning]);

  // 全局鍵盤事件處理
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && gameEnded) {
        e.preventDefault();
        restartGame();
        // 確保在重新開始後將焦點回到輸入框
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [gameEnded]);

  // 保存主題到本地存儲
  useEffect(() => {
    localStorage.setItem("typing-theme", currentTheme);
  }, [currentTheme]);

  // 保存單字列表到本地存儲
  useEffect(() => {
    localStorage.setItem("typing-wordlist", currentWordList.toString());
  }, [currentWordList]);

  // 添加點擊空白處關閉選單的功能
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".theme-selector") &&
        !target.closest(".wordlist-selector")
      ) {
        setShowThemeSelector(false);
        setShowWordListSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
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
  } as const;
}; 