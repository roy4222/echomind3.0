/**
 * 定義聊天訊息的介面
 */
export interface ChatMessage {
  /** 訊息的角色類型: 使用者、助理或系統 */
  role: 'user' | 'assistant' | 'system';
  /** 訊息的內容 */
  content: string;
}

/**
 * 定義聊天完成請求的選項介面
 */
export interface ChatCompletionOptions {
  /** 聊天訊息歷史記錄 */
  messages: ChatMessage[];
  /** 使用的語言模型，可選 */
  model?: string;
  /** 溫度參數，控制回應的隨機性，可選 */
  temperature?: number;
  /** 最大生成的 token 數量，可選 */
  maxTokens?: number;
  /** 是否使用串流回應，可選 */
  stream?: boolean;
}

/**
 * 定義聊天 API 回應的介面
 */
export interface ChatResponse {
  /** API 呼叫是否成功 */
  success: boolean;
  /** 成功時的回應資料，可以是任何類型的回應 */
  data?: unknown;
  /** 錯誤時的相關資訊 */
  error?: {
    /** 錯誤訊息 */
    message: string;
    /** 錯誤代碼 */
    code: string;
  };
}

/**
 * Groq API 回應中的選項訊息
 */
export interface ChatResponseChoice {
  message: {
    role: string;
    content: string;
  };
  index: number;
  finish_reason: string;
}

/**
 * Groq API 回應的具體結構
 */
export interface GroqChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatResponseChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
} 