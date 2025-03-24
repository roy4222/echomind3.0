import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'sonner';

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

/**
 * 用戶身份驗證服務
 */
export class AuthService {
  private userId: string | null = null;

  /**
   * 設定目前使用者 ID
   * @param userId 使用者 ID
   */
  setUserId(userId: string | null) {
    this.userId = userId;
  }

  /**
   * 取得目前使用者 ID
   * @returns 使用者 ID
   */
  getUserId(): string | null {
    return this.userId;
  }

  /**
   * 驗證是否已設定使用者 ID
   * @param errorMessage 錯誤訊息
   * @returns 是否已設定使用者 ID
   */
  validateUser(errorMessage: string = '請先登入以使用此功能'): boolean {
    if (!this.userId) {
      toast.error(errorMessage);
      return false;
    }
    return true;
  }
}

// 建立並匯出默認的身份驗證服務實例
export const authService = new AuthService(); 