/**
 * 聊天訊息的角色類型
 */
export type ChatRole = 'user' | 'assistant' | 'system';

/**
 * 聊天訊息介面
 */
export interface ChatMessage {
  /** 訊息的角色 */
  role: ChatRole;
  /** 訊息內容 */
  content: string;
  /** 唯一識別碼 */
  id?: string;
  /** 創建時間戳 */
  createdAt?: number;
  /** 圖片 (base64 格式) */
  image?: string;
  /** 圖片 URL (R2 存儲) */
  imageUrl?: string;
}

/**
 * 聊天完成選項
 */
export interface ChatCompletionOptions {
  /** 聊天訊息 */
  messages: ChatMessage[];
  /** 語言模型名稱 */
  model?: string;
  /** 溫度參數 */
  temperature?: number;
  /** 最大生成token數 */
  maxTokens?: number;
  /** 是否使用串流模式 */
  stream?: boolean;
  /** 圖片 (base64 格式) */
  image?: string;
}

/**
 * 聊天錯誤
 */
export interface ChatError {
  /** 錯誤訊息 */
  message: string;
  /** 錯誤類型 */
  type?: string;
  /** 錯誤碼 */
  code?: string;
}

/**
 * Groq 聊天回應
 */
export interface GroqChatResponse {
  /** 模型名稱 */
  model: string;
  /** 聊天完成結果 */
  choices: {
    /** 回覆訊息 */
    message: {
      /** 訊息角色 */
      role: ChatRole;
      /** 訊息內容 */
      content: string;
    };
    /** 生成結束原因 */
    finish_reason: string;
    /** 索引 */
    index: number;
  }[];
  /** 使用情況 */
  usage: {
    /** 完成 token 數 */
    completion_tokens: number;
    /** 提示 token 數 */
    prompt_tokens: number;
    /** 總 token 數 */
    total_tokens: number;
  };
}

/**
 * 聊天響應介面
 */
export interface ChatResponse {
  /** 是否成功 */
  success: boolean;
  /** 回應數據 */
  data?: any;
  /** 錯誤訊息 */
  error?: ChatError;
}

/**
 * 簡化的聊天響應
 */
export interface SimpleChatResponse {
  /** 回應文本 */
  text: string;
  /** 處理時間 (ms) */
  processingTime?: number;
}

/**
 * FAQ 搜尋結果
 */
export interface FaqSearchResult {
  /** FAQ ID */
  id: string;
  /** 問題 */
  question: string;
  /** 答案 */
  answer: string;
  /** 相似度分數 */
  score: number;
  /** 分類 */
  category?: string;
  /** 標籤 */
  tags?: string[];
}

/**
 * 聊天歷史記錄介面
 */
export interface ChatHistory {
  /** 聊天記錄唯一識別碼 */
  id: string;
  /** 聊天標題 */
  title: string;
  /** 訊息列表 */
  messages: ChatMessage[];
  /** 使用的模型識別碼 */
  modelId: string;
  /** 最後更新時間戳 */
  lastUpdated: number;
  /** 建立時間戳 */
  createdAt: number;
}

/**
 * 聊天輸入 Props 介面
 */
export interface ChatInputProps {
  /** 提交訊息的回調函數 */
  onSubmit: (input: string, modelId?: string, image?: string) => Promise<void>;
  /** 添加消息到聊天的回調函數 */
  onSendMessage?: (message: ChatMessage) => void;
  /** 是否正在載入中 */
  isLoading: boolean;
}

/**
 * 圖片預覽 Props 介面
 */
export interface ImagePreviewProps {
  /** 上傳的圖片 (base64 格式) */
  image: string;
  /** 移除圖片的回調函數 */
  onRemove: () => void;
  /** 獲取檔案名稱的函數 */
  getFileName: () => string | undefined;
}

/**
 * 功能按鈕 Props 介面
 */
export interface ActionButtonsProps {
  /** 資料庫搜尋是否啟用 */
  isDbSearchActive: boolean;
  /** 切換資料庫搜尋的函數 */
  toggleDbSearch: () => void;
  /** 網絡搜尋是否啟用 */
  isWebSearchActive: boolean;
  /** 切換網絡搜尋的函數 */
  toggleWebSearch: () => void;
  /** 處理圖片上傳的函數 */
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** 當前選擇的模型 ID */
  selectedModelId: string;
  /** 檔案輸入參考 */
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}