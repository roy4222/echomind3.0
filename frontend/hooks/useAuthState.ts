// 引入必要的 React Hooks 和 Firebase 認證相關功能
import { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged, AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// 定義認證狀態的介面
interface AuthState {
  user: FirebaseUser | null;     // 當前登入的用戶，未登入時為 null
  loading: boolean;      // 是否正在載入認證狀態
  error: AuthError | null;   // 認證過程中的錯誤，無錯誤時為 null
}

/**
 * 取得目前身份驗證狀態的Hook
 * @returns 目前的認證狀態
 */
export function useAuthState() {
  // 初始化認證狀態
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  // 監聽身份驗證狀態變化
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setAuthState({
          user,
          loading: false,
          error: null
        });
      },
      (error) => {
        setAuthState({
          user: null,
          loading: false,
          error: error as AuthError
        });
        console.error('認證狀態監聽錯誤:', error);
      }
    );

    // 組件卸載時取消監聽
    return () => unsubscribe();
  }, []);

  // 回傳目前的認證狀態
  return authState;
} 