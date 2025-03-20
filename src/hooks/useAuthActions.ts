// 引入 Firebase 認證相關功能
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  User,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  AuthError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

// 註冊資料介面
interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// 登入資料介面
interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 認證相關操作的 Hook
export const useAuthActions = () => {
  // 設定認證狀態的持久化類型
  const setPersistenceType = async (rememberMe: boolean): Promise<void> => {
    try {
      await setPersistence(auth, 
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
    } catch (error) {
      console.error('設定持久化失敗:', error);
      throw error;
    }
  };

  // 使用電子郵件註冊
  const registerWithEmail = async ({ email, password, name }: RegisterData): Promise<User> => {
    try {
      // 設定持久化並創建用戶
      await setPersistenceType(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 更新用戶資料
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // 顯示成功訊息
      toast.success('註冊成功！', {
        description: '歡迎加入 EchoMind',
        duration: 3000,
      });

      return userCredential.user;
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    }
  };

  // 使用電子郵件登入
  const loginWithEmail = async ({ email, password, rememberMe = false }: LoginData): Promise<User> => {
    try {
      // 設定持久化並登入
      await setPersistenceType(rememberMe);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 顯示成功訊息
      toast.success('登入成功！', {
        description: '歡迎回來',
        duration: 3000,
      });

      return userCredential.user;
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    }
  };

  // 使用 Google 登入
  const loginWithGoogle = async (rememberMe: boolean = false): Promise<User> => {
    try {
      // 設定持久化
      await setPersistenceType(rememberMe);
      const provider = new GoogleAuthProvider();
      // 設定 Google 登入選項
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // 執行 Google 登入
      const userCredential = await signInWithPopup(auth, provider);
      
      // 顯示成功訊息
      toast.success('Google 登入成功！', {
        description: '歡迎回來',
        duration: 3000,
      });

      return userCredential.user;
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    }
  };

  // 登出功能
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      
      // 顯示成功訊息
      toast.success('登出成功！', {
        description: '期待您的再次使用',
        duration: 3000,
      });
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    }
  };

  // 返回所有認證操作函數
  return {
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
  };
};

// 處理認證錯誤
const handleAuthError = (error: AuthError) => {
  const errorMessage = getErrorMessage(error.code);
  console.error('認證錯誤:', error);
  
  // 顯示錯誤訊息
  toast.error('操作失敗', {
    description: errorMessage,
    duration: 3000,
  });
};

// 取得錯誤訊息對應的中文說明
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': '此電子郵件已被註冊',
    'auth/invalid-email': '無效的電子郵件格式',
    'auth/operation-not-allowed': '此登入方式未啟用',
    'auth/weak-password': '密碼強度不足',
    'auth/user-disabled': '此帳號已被停用',
    'auth/user-not-found': '找不到此用戶',
    'auth/wrong-password': '密碼錯誤',
    'auth/popup-closed-by-user': '登入視窗被關閉',
    'auth/popup-blocked': '登入視窗被阻擋',
    'auth/cancelled-popup-request': '登入請求已取消',
    'auth/network-request-failed': '網路連線失敗',
    'auth/too-many-requests': '登入嘗試次數過多，請稍後再試',
    'auth/requires-recent-login': '請重新登入以繼續操作',
    'auth/account-exists-with-different-credential': '此電子郵件已使用其他登入方式註冊',
  };

  return errorMessages[errorCode] || '發生未知錯誤，請稍後再試';
}; 