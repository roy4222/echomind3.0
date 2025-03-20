'use client'; // 標記此組件為客戶端組件

// 導入必要的依賴
import { createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';

/**
 * 認證上下文的類型定義
 * @interface AuthContextType
 * @property {User | null} user - 當前登入的用戶對象或 null
 * @property {boolean} loading - 認證狀態是否正在加載中
 * @property {Error | null} error - 認證過程中可能遇到的錯誤或 null
 * @property {function} registerWithEmail - 註冊用戶的函數
 * @property {function} loginWithEmail - 用電子郵件登入的函數
 * @property {function} loginWithGoogle - 用 Google 登入的函數
 * @property {function} logout - 登出用戶的函數
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  registerWithEmail: (data: { email: string; password: string; name: string }) => Promise<User>;
  loginWithEmail: (data: { email: string; password: string; rememberMe?: boolean }) => Promise<User>;
  loginWithGoogle: (rememberMe?: boolean) => Promise<User>;
  logout: () => Promise<void>;
}

// 創建認證上下文，設置默認值
const AuthContext = createContext<AuthContextType | null>(null);

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
  const { user, loading, error } = useAuthState();
  const { registerWithEmail, loginWithEmail, loginWithGoogle, logout } = useAuthActions();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  // 準備提供給上下文的值
  const value = {
    user,
    loading,
    error,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 