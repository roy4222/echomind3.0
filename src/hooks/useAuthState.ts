// 引入必要的 React Hooks 和 Firebase 認證相關功能
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// 定義認證狀態的介面
interface AuthState {
  user: User | null;     // 當前登入的用戶，未登入時為 null
  loading: boolean;      // 是否正在載入認證狀態
  error: Error | null;   // 認證過程中的錯誤，無錯誤時為 null
}

// 自定義 Hook 用於監聽和管理用戶的認證狀態
export const useAuthState = (): AuthState => {
  // 設置狀態管理
  const [user, setUser] = useState<User | null>(null);        // 用戶狀態
  const [loading, setLoading] = useState(true);               // 載入狀態
  const [error, setError] = useState<Error | null>(null);     // 錯誤狀態

  useEffect(() => {
    // 設置 Firebase 認證狀態監聽器
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          try {
            // 如果有用戶登入，重新載入用戶資料以確保資料最新
            await user.reload();
            setUser(user);
          } catch (error) {
            // 處理重新載入用戶資料時的錯誤
            console.error('重新載入用戶資料失敗:', error);
            setError(error as Error);
          }
        } else {
          // 如果沒有用戶登入，將用戶狀態設為 null
          setUser(null);
        }
        // 完成載入，設置 loading 為 false
        setLoading(false);
      },
      (error) => {
        // 處理監聽器本身的錯誤
        console.error('認證狀態監聽錯誤:', error);
        setError(error as Error);
        setLoading(false);
      }
    );

    // 清理函數：組件卸載時取消監聽
    return () => unsubscribe();
  }, []);

  // 返回當前的認證狀態
  return { user, loading, error };
}; 