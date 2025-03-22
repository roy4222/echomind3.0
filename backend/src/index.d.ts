declare module '*/types/chat' {
  // 聊天訊息角色
  export type MessageRole = 'user' | 'assistant' | 'system';

  // 聊天訊息
  export interface ChatMessage {
    role: MessageRole;
    content: string;
    id?: string;
    createdAt?: Date | number;
  }

  // 聊天完成選項
  export interface ChatCompletionOptions {
    messages: ChatMessage[];
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  }

  // 聊天錯誤
  export interface ChatError {
    message: string;
    type?: string;
    code?: string;
  }

  // Groq 聊天回應
  export interface GroqChatResponse {
    model: string;
    choices: {
      message: {
        role: MessageRole;
        content: string;
      };
      finish_reason: string;
      index: number;
    }[];
    usage: {
      completion_tokens: number;
      prompt_tokens: number;
      total_tokens: number;
    };
  }

  // 聊天回應
  export interface ChatResponse {
    success: boolean;
    data?: GroqChatResponse;
    error?: ChatError;
  }

  // FAQ 搜尋結果
  export interface FaqSearchResult {
    id: string;
    question: string;
    answer: string;
    score: number;
    category?: string;
    tags?: string[];
  }
}

declare module '*/services/embedding' {
  export function generateEmbedding(text: string): Promise<number[]>;
} 