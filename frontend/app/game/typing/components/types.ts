// 定義單字列表類型
export type WordList = {
  name: string;
  words: string[];
};

// 定義主題類型
export type Theme = {
  name: string;
  background: string;
  containerBg: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  error: string;
  success: string;
  buttonBg: string;
  buttonText: string;
  buttonHover: string;
  inputBg: string;
  inputBorder: string;
  inputFocus: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

// 定義主題記錄
export type ThemeRecord = Record<string, Theme>; 