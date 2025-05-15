import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// BackButton 組件：返回按鈕
function BackButton({ text }: { text: string }) {
  const router = useRouter();
  
  const navigate = () => {
    router.back();
  };

  return (
    <motion.button
    // Motion 是 React 的動畫庫
      // 點擊事件處理器
      onClick={navigate}
      
      // Framer Motion 動畫效果
      whileHover={{ scale: 1.05 }}  // 滑鼠懸停時放大 5%
      whileTap={{ scale: 0.95 }}    // 點擊時縮小 5%
      
      // Tailwind CSS 類別
      className="
        inline-flex          // 行內彈性布局
        items-center        // 垂直居中對齊
        text-indigo-600    // 淺色模式文字顏色
        dark:text-indigo-400 // 深色模式文字顏色
        hover:text-indigo-800 // 懸停時文字顏色
        dark:hover:text-indigo-300 // 深色模式懸停文字顏色
        bg-gray-50         // 淺色模式背景色
        dark:bg-gray-800   // 深色模式背景色
        px-3              // 左右內邊距
        py-2              // 上下內邊距
        rounded-lg        // 圓角
        shadow-sm         // 淺陰影
      "
    >
      <ArrowLeft className="mr-2" size={20} />
      {text}
    </motion.button>
  );
}

export default BackButton;