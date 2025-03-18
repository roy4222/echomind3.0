export type User = {
    uid: string;          // 使用者唯一 ID (來自 Firebase Auth)
    email: string;        // 使用者 Email
    displayName?: string; // (可選) 使用者名稱
    role: "user" | "admin"; // 角色權限 (一般使用者 / 管理員)
    createdAt: Date;      // 帳號創建時間
  };
  