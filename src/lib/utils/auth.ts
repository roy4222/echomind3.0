import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { toast } from 'sonner';

// 定義用戶註冊資料介面
interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// 定義登入資料介面
interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 定義用戶資料介面
interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerData: any[];
  providerId: string;
}

// 儲存用戶資訊到 localStorage
const saveUserToLocalStorage = (user: User, rememberMe: boolean = false) => {
  const userData: UserData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    providerData: user.providerData,
    providerId: user.providerData[0]?.providerId || 'password'
  };

  if (rememberMe) {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('rememberMe', 'true');
  } else {
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.removeItem('rememberMe');
  }
};

// 從 storage 清除用戶資訊
const clearUserFromStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('rememberMe');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('rememberMe');
};

// 初始化 auth 監聽器
export const initializeAuthListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      saveUserToLocalStorage(user, rememberMe);
    }
    callback(user);
  });
};

// 註冊新用戶
export const registerWithEmail = async ({ email, password, name }: RegisterData): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: name
    });
    saveUserToLocalStorage(userCredential.user, true);
    toast.success('註冊成功！', {
      description: '歡迎加入 EchoMind',
      duration: 3000,
    });
    return userCredential.user;
  } catch (error: any) {
    const errorMessage = getErrorMessage(error.code);
    toast.error('註冊失敗', {
      description: errorMessage,
      duration: 3000,
    });
    throw new Error(errorMessage);
  }
};

// 使用電子郵件登入
export const loginWithEmail = async ({ email, password, rememberMe = false }: LoginData): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    saveUserToLocalStorage(userCredential.user, rememberMe);
    toast.success('登入成功！', {
      description: '歡迎回來',
      duration: 3000,
    });
    return userCredential.user;
  } catch (error: any) {
    const errorMessage = getErrorMessage(error.code);
    toast.error('登入失敗', {
      description: errorMessage,
      duration: 3000,
    });
    throw new Error(errorMessage);
  }
};

// Google 登入
export const loginWithGoogle = async (rememberMe: boolean = false): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    saveUserToLocalStorage(userCredential.user, rememberMe);
    toast.success('Google 登入成功！', {
      description: '歡迎回來',
      duration: 3000,
    });
    return userCredential.user;
  } catch (error: any) {
    const errorMessage = getErrorMessage(error.code);
    toast.error('登入失敗', {
      description: errorMessage,
      duration: 3000,
    });
    throw new Error(errorMessage);
  }
};

// 登出
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    clearUserFromStorage();
    toast.success('登出成功！', {
      description: '期待您的再次使用',
      duration: 3000,
    });
  } catch (error) {
    toast.error('登出失敗', {
      description: '請稍後再試',
      duration: 3000,
    });
    throw new Error('登出失敗，請稍後再試');
  }
};

// 獲取當前用戶
export const getCurrentUser = (): User | null => {
  const user = auth.currentUser;
  if (user) return user;
  
  // 如果沒有當前用戶，檢查 storage
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (storedUser) {
    return JSON.parse(storedUser) as User;
  }
  
  return null;
};

// 錯誤訊息處理
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return '此電子郵件已被註冊';
    case 'auth/invalid-email':
      return '無效的電子郵件格式';
    case 'auth/operation-not-allowed':
      return '此登入方式未啟用';
    case 'auth/weak-password':
      return '密碼強度不足';
    case 'auth/user-disabled':
      return '此帳號已被停用';
    case 'auth/user-not-found':
      return '找不到此用戶';
    case 'auth/wrong-password':
      return '密碼錯誤';
    case 'auth/popup-closed-by-user':
      return '登入視窗被關閉';
    case 'auth/popup-blocked':
      return '登入視窗被阻擋';
    case 'auth/cancelled-popup-request':
      return '登入請求已取消';
    default:
      return '請稍後再試';
  }
};
