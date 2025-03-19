'use client';

// 引入 React 核心庫
import * as React from 'react';
// 從 next-themes 引入主題提供者組件並重命名為 NextThemesProvider
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// 定義 ThemeProviderProps 類型，使用 Parameters 工具類型獲取 NextThemesProvider 的參數類型
type ThemeProviderProps = Parameters<typeof NextThemesProvider>[0];

/**
 * ThemeProvider 組件
 * 這是一個包裝 next-themes 的 ThemeProvider 的自定義組件
 * 用於在應用程序中提供主題切換功能
 * 
 * @param children - 子組件，將被包裹在主題提供者內
 * @param props - 其他傳遞給 NextThemesProvider 的屬性
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
} 