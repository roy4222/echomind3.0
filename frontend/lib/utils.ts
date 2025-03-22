import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 用於組合 className 的工具函數
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 