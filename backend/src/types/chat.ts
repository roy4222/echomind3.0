/**
 * 聊天訊息角色
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * 聊天訊息
 */
export interface ChatMessage {
  /** 訊息角色 */
  role: MessageRole;
  /** 訊息內容 */
  content: string;
  /** 訊息 ID */
  id?: string;
  /** 創建時間 */
  createdAt?: Date | number;
}

/**
 * 聊天完成選項
 */
export interface ChatCompletionOptions {
  /** 聊天訊息歷史 */
  messages: ChatMessage[];
  /** 使用的語言模型 */
  model?: string;
  /** 溫度參數 */
  temperature?: number;
  /** 最大生成的 token 數量 */
  maxTokens?: number;
  /** 是否使用串流回應 */
  stream?: boolean;
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
      role: MessageRole;
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
 * 聊天回應
 */
export interface ChatResponse {
  /** 是否成功 */
  success: boolean;
  /** 回應數據 */
  data?: GroqChatResponse;
  /** 錯誤信息 */
  error?: ChatError;
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
  /** 重要程度 (1-5) */
  importance?: number;
} 