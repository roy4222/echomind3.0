import { useEffect } from "react";

/**
 * 添加全局動畫樣式的組件
 */
const AnimationStyles = () => {
  useEffect(() => {
    // 創建樣式標籤
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      @keyframes float {
        0% {
          transform: translateY(0);
          opacity: 1;
        }
        100% {
          transform: translateY(-100px);
          opacity: 0;
        }
      }
      
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(0.95);
        }
        100% {
          transform: scale(1);
        }
      }
    `;
    // 添加到頭部
    document.head.appendChild(styleElement);

    // 清理函數
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return null;
};

export default AnimationStyles; 