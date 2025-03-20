/**
 * Firebase Authentication 相關功能模組
 * 包含用戶註冊、登入、登出等功能
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  User,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  AuthError,
  AuthErrorCodes,
  getAuth
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { toast } from 'sonner';

/**
 * 用戶註冊資料介面
 */
interface RegisterData {
  email: string;
  password: string;
  name: string;
}

/**
 * 登入資料介面
 */
interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * 用戶資料介面
 */
interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerData: any[];
  providerId: string;
  lastLoginAt?: string;
  createdAt?: string;
}

/**
 * 認證錯誤介面
 */
interface AuthenticationError extends Error {
  code?: string;
  message: string;
}

/**
 * 設定 Firebase Auth 持久化類型
 * @param rememberMe - 是否記住登入狀態
 */
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

/**
 * 儲存用戶資訊到 storage
 * @param user - Firebase User 物件
 * @param rememberMe - 是否記住登入狀態
 */
const saveUserToStorage = (user: User, rememberMe: boolean = false) => {
  const userData: UserData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    providerData: user.providerData,
    providerId: user.providerData[0]?.providerId || 'password',
    lastLoginAt: new Date().toISOString(),
    createdAt: user.metadata.creationTime || new Date().toISOString()
  };

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('user', JSON.stringify(userData));
  if (rememberMe) {
    localStorage.setItem('rememberMe', 'true');
  }
};

/**
 * 從 storage 清除用戶資訊
 */
const clearUserFromStorage = () => {
  [localStorage, sessionStorage].forEach(storage => {
    storage.removeItem('user');
    storage.removeItem('rememberMe');
  });
};

/**
 * 初始化 Firebase Auth 設置
 */
export const initializeAuth = async () => {
  try {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    await setPersistenceType(rememberMe);
    
    // 強制刷新 token
    const currentUser = auth.currentUser;
    if (currentUser) {
      await currentUser.reload();
    }
  } catch (error) {
    console.error('初始化 Auth 失敗:', error);
  }
};

/**
 * 初始化 auth 監聽器
 * @param callback - 用戶狀態變更時的回調函數
 */
export const initializeAuthListener = (callback: (user: User | null) => void) => {
  let unsubscribe: (() => void) | null = null;

  const initialize = async () => {
    try {
      // 先初始化 Auth 設置
      await initializeAuth();

      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // 確保用戶資料是最新的
          await user.reload();
          const rememberMe = localStorage.getItem('rememberMe') === 'true';
          saveUserToStorage(user, rememberMe);
        } else {
          clearUserFromStorage();
        }
        callback(user);
      });

      // 檢查初始狀態
      const initialUser = auth.currentUser;
      if (initialUser) {
        await initialUser.reload();
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        saveUserToStorage(initialUser, rememberMe);
        callback(initialUser);
      }

      // 監聽 storage 事件，處理多標籤同步
      window.addEventListener('storage', (event) => {
        if (event.key === 'user') {
          if (!event.newValue) {
            callback(null);
          } else {
            const userData = JSON.parse(event.newValue);
            callback(userData as User);
          }
        }
      });

    } catch (error) {
      console.error('初始化 auth 監聽器失敗:', error);
      throw error;
    }
  };

  // 執行初始化
  initialize();

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

/**
 * 註冊新用戶
 * @param RegisterData - 包含 email、password 和 name 的註冊資料
 * @returns Promise<User> - 註冊成功的用戶
 */
export const registerWithEmail = async ({ email, password, name }: RegisterData): Promise<User> => {
  try {
    await setPersistenceType(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, {
      displayName: name
    });

    saveUserToStorage(userCredential.user, true);
    
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

/**
 * 使用電子郵件登入
 * @param LoginData - 包含 email、password 和 rememberMe 的登入資料
 * @returns Promise<User> - 登入成功的用戶
 */
export const loginWithEmail = async ({ email, password, rememberMe = false }: LoginData): Promise<User> => {
  try {
    await setPersistenceType(rememberMe);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    saveUserToStorage(userCredential.user, rememberMe);
    
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

/**
 * Google 登入
 * @param rememberMe - 是否記住登入狀態
 * @returns Promise<User> - 登入成功的用戶
 */
export const loginWithGoogle = async (rememberMe: boolean = false): Promise<User> => {
  try {
    await setPersistenceType(rememberMe);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const userCredential = await signInWithPopup(auth, provider);
    saveUserToStorage(userCredential.user, rememberMe);
    
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

/**
 * 登出
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    clearUserFromStorage();
    
    toast.success('登出成功！', {
      description: '期待您的再次使用',
      duration: 3000,
    });
  } catch (error) {
    handleAuthError(error as AuthError);
    throw error;
  }
};

/**
 * 獲取當前用戶
 * @returns Promise<User | null> - 當前登入的用戶或 null
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const user = auth.currentUser;
  if (user) {
    try {
      await user.reload();
      return user;
    } catch (error) {
      console.error('刷新用戶資料失敗:', error);
    }
  }
  
  // 如果沒有當前用戶，檢查 storage
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  const storage = rememberMe ? localStorage : sessionStorage;
  const storedUser = storage.getItem('user');
  
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    // 嘗試重新驗證用戶
    try {
      await initializeAuth();
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === userData.uid) {
        return currentUser;
      }
    } catch (error) {
      console.error('驗證已存儲用戶失敗:', error);
    }
  }
  
  return null;
};

/**
 * 處理認證錯誤
 * @param error - Firebase Auth 錯誤物件
 */
const handleAuthError = (error: AuthError) => {
  const errorMessage = getErrorMessage(error.code);
  console.error('認證錯誤:', error);
  
  toast.error('操作失敗', {
    description: errorMessage,
    duration: 3000,
  });
};

/**
 * 取得錯誤訊息
 * @param errorCode - Firebase Auth 錯誤代碼
 * @returns string - 對應的錯誤訊息
 */
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    [AuthErrorCodes.EMAIL_EXISTS]: '此電子郵件已被註冊',
    [AuthErrorCodes.INVALID_EMAIL]: '無效的電子郵件格式',
    [AuthErrorCodes.OPERATION_NOT_ALLOWED]: '此登入方式未啟用',
    [AuthErrorCodes.WEAK_PASSWORD]: '密碼強度不足',
    [AuthErrorCodes.USER_DISABLED]: '此帳號已被停用',
    [AuthErrorCodes.USER_DELETED]: '找不到此用戶',
    [AuthErrorCodes.INVALID_PASSWORD]: '密碼錯誤',
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
