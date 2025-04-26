'use client'
import { useState, useEffect, useCallback } from 'react';

export default function BreathingCircle() {
  const [isPressed, setIsPressed] = useState(false);
  const [scale, setScale] = useState(1);
  const [text, setText] = useState('按住並深呼吸');
  const maxScale = 2.5;
  const animationDuration = 3000;

  const animate = useCallback((startValue: number, endValue: number, onComplete?: () => void) => {
    const startTime = Date.now();
    
    const updateAnimation = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const currentValue = startValue + (endValue - startValue) * progress;
      
      setScale(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateAnimation);
      } else if (onComplete) {
        onComplete();
      }
    };
    
    requestAnimationFrame(updateAnimation);
  }, [animationDuration]);

  useEffect(() => {
    if (isPressed) {
      setText('深呼吸...');
      animate(1, maxScale, () => setText('放開並慢慢吐氣'));
    } else {
      setText('慢慢吐氣...');
      animate(scale, 1, () => setText('按住並深呼吸'));
    }
  }, [isPressed, maxScale, animate]);

  return (
    <div
      className="select-none cursor-pointer"
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      <div
        className="w-48 h-48 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200 border-2 border-white shadow-lg dark:bg-gray-100 bg-stone-300"
        style={{ transform: `scale(${scale})` }}
      >
        <p className="text-gray-700 font-medium text-center px-4">
          {text}
        </p>
      </div>
    </div>
  );
}