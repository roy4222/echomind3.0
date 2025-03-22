export type User = {
    uid: string;          // 使用者唯一 ID (來自 Firebase Auth)
    email: string;        // 使用者 Email
    name?: string;        // (可選) 使用者名稱，與後端保持一致
    displayName?: string; // (可選) 顯示名稱，保留此欄位以兼容 Firebase Auth
    photoURL?: string;    // (可選) 使用者頭像 URL
    role: "user" | "admin"; // 角色權限 (一般使用者 / 管理員)
    createdAt: Date;      // 帳號創建時間
    metadata?: {
      creationTime?: string;
      lastSignInTime?: string;
    };
  };
  
/**
 * 後端使用者資料格式
 * 用於與後端 API 交互時的類型定義
 */
export type BackendUser = {
  uid: string;          // 使用者唯一 ID
  email: string;        // 使用者 Email
  name?: string;        // 使用者名稱
  role?: string;        // 使用者角色
};

/**
 * 將 Firebase Auth 使用者資料轉換為應用內使用的格式
 */
export function normalizeUser(firebaseUser: any): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || '',
    displayName: firebaseUser.displayName || '',
    photoURL: firebaseUser.photoURL || '',
    role: firebaseUser.customClaims?.role || 'user',
    createdAt: firebaseUser.metadata?.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date(),
    metadata: {
      creationTime: firebaseUser.metadata?.creationTime,
      lastSignInTime: firebaseUser.metadata?.lastSignInTime
    }
  };
}
  