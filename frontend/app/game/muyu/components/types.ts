// 定義主題類型
export type Theme = {
  background: string; // 背景樣式
  textColor: string; // 文字顏色
};

// 定義主題集合類型
export type ThemeSet = {
  name: string; // 主題名稱
  theme: Theme; // 主題樣式
  woodFish: {
    name: string; // 木魚名稱
    image: string; // 木魚圖片路徑
    size: number; // 木魚尺寸
  };
  sound: string; // 敲擊音效路徑
};

// 預設主題集合
export const themeSets: ThemeSet[] = [
  {
    name: "傳統禪意",
    theme: {
      background: "bg-gradient-to-b from-[#0F1015] via-[#15161C] to-[#1A1B26]",
      textColor: "text-[#6B7280]",
    },
    woodFish: { name: "傳統木魚", image: "/images/muyu.png", size: 250 },
    sound: "/sounds/muyu.mp3",
  },
  {
    name: "金玉良緣",
    theme: {
      background: "bg-gradient-to-b from-gray-800 to-black",
      textColor: "text-amber-600",
    },
    woodFish: { name: "金邊木魚", image: "/images/muyu1.png", size: 250 },
    sound: "/sounds/muyu1.mp3",
  },
  {
    name: "現代禪風",
    theme: {
      background: "bg-gradient-to-b from-[#E8E4D9] to-[#D8C3A5]",
      textColor: "text-[#8B7E74]",
    },
    woodFish: { name: "玉石木魚", image: "/images/muyu2.png", size: 250 },
    sound: "/sounds/muyu2.mp3",
  },
]; 