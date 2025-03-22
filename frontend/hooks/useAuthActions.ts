// 引入 Firebase 認證相關功能
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  UserCredential,
  sendPasswordResetEmail,
  AuthError,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { User as FirebaseUser } from 'firebase/auth';

// 註冊資料介面
export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// 登入資料介面
export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * 提供認證相關操作的Hook
 * @returns 認證相關的操作函數
 */
export function useAuthActions() {
  /**
   * 使用電子郵件及密碼註冊
   * @param data - 註冊資料
   */
  const registerWithEmail = async (
    data: RegisterData
  ): Promise<FirebaseUser> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      // 設置用戶名稱
      if (data.name && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: data.name
        });
      }
      
      toast.success('註冊成功！');
      return userCredential.user;
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    }
  };

  /**
   * 使用電子郵件及密碼登入
   * @param data - 登入資料
   */
  const loginWithEmail = async (
    data: LoginData
  ): Promise<FirebaseUser> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      toast.success('登入成功！');
      return userCredential.user;
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    }
  };

  /**
   * 使用Google帳號登入
   * @param rememberMe - 是否記住登錄狀態
   */
  const loginWithGoogle = async (rememberMe?: boolean): Promise<FirebaseUser> => {
    try {
      const provider = new GoogleAuthProvider();
      if (rememberMe) {
        auth.setPersistence('local');
      }
      const userCredential = await signInWithPopup(auth, provider);
      
      toast.success('Google登入成功！');
      return userCredential.user;
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    }
  };

  /**
   * 登出
   */
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast.success('已登出');
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    }
  };

  /**
   * 重設密碼
   * @param email - 電子郵件
   */
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('密碼重設郵件已發送');
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    }
  };

  /**
   * 更新用戶檔案
   * @param displayName - 顯示名稱
   * @param photoURL - 頭像 URL
   */
  const updateUserProfile = async (
    displayName?: string, 
    photoURL?: string
  ): Promise<void> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('沒有登入的用戶');
      }
      
      const updateData: {
        displayName?: string;
        photoURL?: string;
      } = {};
      
      if (displayName !== undefined) updateData.displayName = displayName;
      if (photoURL !== undefined) updateData.photoURL = photoURL;
      
      await updateProfile(user, updateData);
      toast.success('用戶資料已更新');
    } catch (error) {
      console.error('更新用戶資料失敗:', error);
      toast.error('更新用戶資料失敗');
      throw error;
    }
  };

  /**
   * 處理認證錯誤
   * @param error - 認證錯誤物件
   */
  const handleAuthError = (error: AuthError): void => {
    let message = '發生錯誤，請稍後再試';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = '此電子郵件已被使用';
        break;
      case 'auth/invalid-email':
        message = '無效的電子郵件格式';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        message = '電子郵件或密碼錯誤';
        break;
      case 'auth/weak-password':
        message = '密碼強度不足';
        break;
      case 'auth/popup-closed-by-user':
        message = '登入視窗已被關閉';
        break;
      default:
        console.error('認證錯誤:', error);
    }
    
    toast.error(message);
  };

  return {
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };
} 