export type FAQ = {
    id: string;          // FAQ 的唯一 ID
    question: string;    // 使用者的問題
    answer: string;      // FAQ 的解答
    tags?: string[];     // (可選) FAQ 分類標籤
    createdAt: Date;     // FAQ 創建時間
    updatedAt?: Date;    // (可選) 最後更新時間
  };
  