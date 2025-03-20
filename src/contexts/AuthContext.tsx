'use client'; // 標記此組件為客戶端組件

// 導入必要的依賴
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { getCurrentUser } from '@/lib/utils/auth';

/**
 * 認證上下文的類型定義
 * @interface AuthContextType
 * @property {User | null} user - 當前登入的用戶對象或 null
 * @property {boolean} loading - 認證狀態是否正在加載中
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// 創建認證上下文，設置默認值
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

/**
 * 自定義 Hook，用於獲取認證上下文
 * @throws {Error} 如果在 AuthProvider 外部使用則拋出錯誤
 * @returns {AuthContextType} 認證上下文對象
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必須在 AuthProvider 內使用');
  }
  return context;
};

/**
 * AuthProvider 組件的 Props 類型定義
 * @interface AuthProviderProps
 * @property {ReactNode} children - 子組件
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 認證提供者組件
 * 管理用戶認證狀態並提供給子組件
 * @param {AuthProviderProps} props - 組件屬性
 * @returns {JSX.Element} 認證提供者組件
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // 狀態管理
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化認證狀態
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('初始化認證狀態失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 準備提供給上下文的值
  const value = {
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 