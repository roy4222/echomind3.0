import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';

/**
 * 初始化身份驗證監聽器
 * @param callback - 用戶狀態變化時的回調函數
 * @returns 取消監聽的函數
 */
export const initializeAuthListener = (
  callback: (user: User | null) => void
): (() => void) => {
  // 監聽身份驗證狀態變化
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user);
  });

  // 返回取消監聽的函數
  return unsubscribe;
}; 