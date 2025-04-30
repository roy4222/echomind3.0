/**
 * Groq 服務
 * 用於處理與 Groq API 的通訊以及 RAG 整合
 */
import { Env } from '../index';
import { createEnvironmentManager } from '../utils/environment';
import { ExternalApiError } from '../utils/errorHandler';
import type { ChatMessage, ChatCompletionOptions, GroqChatResponse, FaqSearchResult } from '../types/chat';
import { MODEL_MAPPING, getModelConfig, modelSupportsImages } from '../config/models';
import { createPineconeClient } from './vector';
import { chatLogger } from '../utils/logger';
import { withRetry, withFallback, serviceDegradation } from '../utils/retry';
import { MemoryCache, createCacheKey } from '../utils/cache';

/**
 * 預設配置參數
 */
const DEFAULT_MODEL = getModelConfig('default').name;
const DEFAULT_TEMPERATURE = getModelConfig('default').temperature;
const DEFAULT_MAX_TOKENS = getModelConfig('default').maxTokens;

/**
 * Groq 快取配置
 */
export interface GroqCacheConfig {
  /** 是否啟用快取 */
  enabled: boolean;
  /** 快取存活時間 (毫秒) */
  ttl: number;
  /** 最大快取項目數量 */
  maxSize: number;
  /** 是否快取 RAG 結果 */
  cacheRagResults: boolean;
}

/**
 * 預設快取配置
 */
const DEFAULT_CACHE_CONFIG: GroqCacheConfig = {
  enabled: true,
  ttl: 15 * 60 * 1000, // 15 分鐘
  maxSize: 500,
  cacheRagResults: true
};

/**
 * 系統提示詞設定
 * 定義 AI 助手的角色和行為準則
 */
const BASE_SYSTEM_PROMPT: ChatMessage = {
  role: 'system',
  content: `你是輔仁大學資訊管理學系的 AI 助手，名叫 EchoMind。
  - 使用繁體中文回答
  - 回答要簡潔但專業
  - 對學生要友善有耐心
  - 不確定的事情要誠實說不知道
  - 需要時可以使用 Markdown 格式美化回答
  - 專注於資管相關的學術、課程、就業諮詢
  - 避免討論政治、宗教等敏感話題`
};

/**
 * 帶有知識增強的系統提示詞模板
 * @param faqs 相關的 FAQ 結果
 * @returns 增強的系統提示詞
 */
function createEnhancedSystemPrompt(faqs: FaqSearchResult[]): ChatMessage {
  if (!faqs || faqs.length === 0) {
    return BASE_SYSTEM_PROMPT;
  }

  // 將相關 FAQ 整合到系統提示詞中
  let enhancedContent = `${BASE_SYSTEM_PROMPT.content}\n\n### 參考知識\n請根據以下資料回答問題。如果問題與提供的資料無關，請根據你的一般知識回答，但優先使用提供的資料。\n\n`;
  
  // 添加每個相關 FAQ
  faqs.forEach((faq, index) => {
    enhancedContent += `#### 參考資料 ${index + 1}：${faq.category || '一般資訊'}\n`;
    enhancedContent += `問：${faq.question}\n`;
    enhancedContent += `答：${faq.answer}\n\n`;
  });
  
  enhancedContent += `請確保你的回答準確反映上述參考資料的內容，但不要在回答中引用或提及這些參考資料的存在，也不要告訴用戶你是根據這些資料回答的。保持自然的對話風格。`;
  
  return {
    role: 'system',
    content: enhancedContent
  };
}

/**
 * Groq 服務類別
 */
export class GroqService {
  /**
   * 環境變數
   */
  private env: Env;
  
  /**
   * 回應快取
   */
  private responseCache: MemoryCache<GroqChatResponse>;
  
  /**
   * 快取配置
   */
  private cacheConfig: GroqCacheConfig;

  /**
   * 建立 Groq 服務
   * @param env 環境變數
   * @param cacheConfig 快取配置
   */
  constructor(env: Env, cacheConfig?: Partial<GroqCacheConfig>) {
    this.env = env;
    
    // 初始化快取配置
    this.cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...cacheConfig };
    
    // 初始化回應快取
    this.responseCache = new MemoryCache<GroqChatResponse>({
      ttl: this.cacheConfig.ttl,
      maxSize: this.cacheConfig.maxSize
    });
    
    chatLogger.info('初始化 Groq 服務和快取', {
      cacheEnabled: this.cacheConfig.enabled,
      cacheTtl: this.cacheConfig.ttl / 1000 / 60 + '分鐘',
      cacheMaxSize: this.cacheConfig.maxSize
    });
  }
  
  /**
   * 調用 Groq API 
   * @param options 聊天完成選項
   * @returns Groq API 回應
   */
  async callGroqApi(
    { messages, model = DEFAULT_MODEL, temperature = DEFAULT_TEMPERATURE, maxTokens = DEFAULT_MAX_TOKENS, image }: ChatCompletionOptions
  ): Promise<GroqChatResponse> {
    // 建立快取鍵
    // 我們只快取非串流的請求，並忽略圖片請求
    if (this.cacheConfig.enabled && !image) {
      const cacheKey = createCacheKey(
        'groq-api',
        model,
        temperature,
        maxTokens,
        messages.map(m => `${m.role}:${m.content.substring(0, 100)}`)
      );
      
      // 嘗試從快取中獲取結果
      const cachedResponse = this.responseCache.get(cacheKey);
      if (cachedResponse) {
        chatLogger.info('從快取獲取 Groq 回應', {
          model,
          cacheHit: true,
          messageCount: messages.length
        });
        return cachedResponse;
      }
    }
    // 將 API 調用部分封裝為函數，方便重試
    const callApi = async (): Promise<GroqChatResponse> => {
      const url = 'https://api.groq.com/openai/v1/chat/completions';
      
      // 建立環境變數管理器
      const envManager = createEnvironmentManager(this.env);
      
      // 根據前端選擇的模型 ID 映射到實際模型名稱和參數
      let actualModel = DEFAULT_MODEL;
      let actualTemperature = temperature;
      let actualMaxTokens = maxTokens;
      let modelDisplayName = '預設模型';
      
      chatLogger.debug('準備調用 Groq API', {
        messageCount: messages.length,
        selectedModel: model,
        hasImage: !!image
      });
      
      // 使用映射表處理模型選擇
      if (model in MODEL_MAPPING) {
        const modelConfig = MODEL_MAPPING[model as keyof typeof MODEL_MAPPING];
        actualModel = modelConfig.name;
        modelDisplayName = modelConfig.displayName;
        
        // 如果沒有明確傳入溫度和最大 tokens，則使用對應模型的建議值
        if (temperature === DEFAULT_TEMPERATURE) {
          actualTemperature = modelConfig.temperature;
        }
        if (maxTokens === DEFAULT_MAX_TOKENS) {
          actualMaxTokens = modelConfig.maxTokens;
        }
        
        chatLogger.info('模型映射', {
          frontend: model,
          actual: actualModel,
          displayName: modelDisplayName,
          temperature: actualTemperature,
          maxTokens: actualMaxTokens
        });
      } else if (model.includes('llama') || model.includes('deepseek') || model.includes('qwen')) {
        // 如果傳入的是完整模型名稱，直接使用
        actualModel = model;
        modelDisplayName = model;
        console.log(`🔄 使用直接指定的模型: ${model}`);
      } else {
        console.log(`⚠️ 未知模型 ID: ${model}，使用預設模型: ${DEFAULT_MODEL}`);
      }
      
      // 開始計時 API 調用
      const startTime = Date.now();
      chatLogger.info('調用 Groq API', {
        model: actualModel,
        temperature: actualTemperature,
        maxTokens: actualMaxTokens,
        messagesCount: messages.length,
        hasImage: !!image
      });
      
      // 驗證 Groq 環境變數
      try {
        envManager.validateGroq();
      } catch (error) {
        console.error('❌ Groq 環境變數驗證失敗:', error);
        throw new ExternalApiError('未設定 API 金鑰', 'Groq');
      }
      
      // 在訊息開頭加入系統提示詞
      const messagesWithSystemPrompt = [BASE_SYSTEM_PROMPT, ...messages];
      console.log('🔄 添加系統提示詞，最終訊息數量:', messagesWithSystemPrompt.length);
      
      // 準備請求體
      const requestBody: any = {
        model: actualModel,  // 使用映射後的模型名稱
        messages: messagesWithSystemPrompt,
        temperature: actualTemperature,
        max_tokens: actualMaxTokens
      };

      // 如果是支援圖片的模型且有圖片，添加圖片到請求中
      if (modelSupportsImages(actualModel) && image) {
        console.log(`🖼️ 檢測到圖片上傳，添加到 ${modelDisplayName} 模型請求中`);
        
        // 修改最後一條用戶訊息，添加圖片
        const lastUserMessageIndex = requestBody.messages.findIndex(
          (msg: ChatMessage) => msg.role === 'user'
        );
        
        if (lastUserMessageIndex !== -1) {
          const lastUserMessage = requestBody.messages[lastUserMessageIndex];
          
          // 將最後一條用戶訊息轉換為多模態格式
          requestBody.messages[lastUserMessageIndex] = {
            role: 'user',
            content: [
              { type: 'text', text: lastUserMessage.content },
              { 
                type: 'image_url', 
                image_url: {
                  url: image
                }
              }
            ]
          };
          
          chatLogger.debug('添加圖片到最後一條消息', {
            messageCount: requestBody.messages.length,
            imageSize: image.length
          });
        } else {
          chatLogger.warn('無法添加圖片：最後一條消息不是用戶消息', {
            lastMessageRole: lastUserMessageIndex === -1 ? '未找到用戶消息' : '系統消息'
          });
        }
      }
      
      // 發送請求到 Groq API
      console.log(`🌐 發送請求到 Groq API (模型: ${modelDisplayName})...`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.env.GROQ_API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });
      
      // 記錄 API 響應時間
      const responseTime = Date.now() - startTime;
      chatLogger.info('收到 Groq API 響應', {
        responseTime: `${responseTime}ms`,
        status: response.status
      });
      
      // 檢查 API 響應
      if (!response.ok) {
        // 嘗試解析錯誤響應
        let errorMessage: string;
        try {
          const errorData = await response.json();
          chatLogger.error('Groq API 錯誤', errorData);
          errorMessage = errorData.error?.message || `HTTP 錯誤 ${response.status}`;
        } catch (e) {
          // 如果無法解析 JSON，則獲取文本
          errorMessage = await response.text();
          chatLogger.error('Groq API 返回非 JSON 錯誤', { 
            error: errorMessage,
            status: response.status 
          });
        }
        
        // 使用專門的外部 API 錯誤類型
        throw new ExternalApiError(
          errorMessage,
          'Groq',
          response.status
        );
      }
      
      // 解析 API 回應
      const result = await response.json();
      
      // 從第一個選擇中提取回應內容
      const choices = result.choices || [];
      
      // 記錄模型和用量信息
      chatLogger.info('Groq API 完成', {
        model: result.model,
        usage: result.usage,
        choicesCount: choices.length,
        responseTime: `${Date.now() - startTime}ms`
      });
      
      // 報告服務成功
      serviceDegradation.reportSuccess('Groq');
      
      // 如果啟用快取且非圖片請求，將結果存入快取
      if (this.cacheConfig.enabled && !image) {
        const cacheKey = createCacheKey(
          'groq-api',
          model,
          temperature,
          maxTokens,
          messages.map(m => `${m.role}:${m.content.substring(0, 100)}`)
        );
        
        this.responseCache.set(cacheKey, result);
        chatLogger.debug('Groq 回應已快取', { cacheKey });
      }
      
      // 返回 Groq API 回應
      return result;
    };
    
    try {
      // 使用重試機制調用 API
      return await withRetry(callApi, {
        maxRetries: 3,
        initialDelay: 500,
        maxDelay: 5000,
        logPrefix: 'Groq',
        // 訂制重試條件，只重試服務器錯誤和速率限制
        isRetryable: (error) => {
          if (error instanceof ExternalApiError) {
            // 5xx 或 429 (Too Many Requests) 才重試
            return error.statusCode >= 500 || error.statusCode === 429;
          }
          return false;
        }
      });
    } catch (error) {
      // 報告服務失敗
      serviceDegradation.reportFailure('Groq', error instanceof Error ? error : new Error(String(error)));
      
      // 如果是已知的外部 API 錯誤，直接重新拋出
      if (error instanceof ExternalApiError) {
        throw error;
      }
      
      // 將其他錯誤包裝為外部 API 錯誤
      chatLogger.error('未處理的 Groq API 錯誤', error);
      throw new ExternalApiError(
        '與 Groq API 通信時發生錯誤: ' + (error instanceof Error ? error.message : '未知錯誤'),
        'Groq',
        500
      );
    }
  }
  
  /**
   * 執行增強型聊天 (RAG 整合)
   * @param options 聊天完成選項
   * @param limit FAQ 搜尋結果限制數量
   * @param threshold 最低相似度閾值
   * @returns Groq API 回應
   */
  async enhancedChat(
    options: ChatCompletionOptions,
    limit: number = 3,
    threshold: number = 0.3
  ): Promise<GroqChatResponse> {
    // 如果快取啟用且適合快取 RAG 結果 (非圖片查詢)
    if (this.cacheConfig.enabled && this.cacheConfig.cacheRagResults && !options.image) {
      // 為 RAG 查詢建立快取鍵
      const cacheKey = createCacheKey(
        'groq-rag',
        options.model || DEFAULT_MODEL,
        options.temperature || DEFAULT_TEMPERATURE,
        options.maxTokens || DEFAULT_MAX_TOKENS,
        limit,
        threshold,
        options.messages.map(m => `${m.role}:${m.content.substring(0, 100)}`)
      );
      
      // 嘗試從快取中獲取 RAG 結果
      const cachedResponse = this.responseCache.get(cacheKey);
      if (cachedResponse) {
        chatLogger.info('從快取獲取 RAG 增強聊天結果', {
          model: options.model || DEFAULT_MODEL,
          cacheHit: true,
          messageCount: options.messages.length
        });
        return cachedResponse;
      }
    }
    // 將整合的 RAG 整合邏輯封裝為函數
    const enhancedChatWithRAG = async (): Promise<GroqChatResponse> => {
      chatLogger.info('開始增強聊天處理');
      
      // 獲取相關 FAQ 結果
      let faqs: FaqSearchResult[] = [];
      
      // 僅處理用戶角色的最後一條消息
      const userMessages = options.messages.filter(m => m.role === 'user');
      if (userMessages.length === 0) {
        // 沒有用戶消息，直接調用 Groq API
        chatLogger.info('未發現用戶消息，直接調用標準 API');
        return this.callGroqApi(options);
      }
      
      const lastUserMessage = userMessages[userMessages.length - 1];
      const query = typeof lastUserMessage.content === 'string' 
        ? lastUserMessage.content 
        : ''; // 如果不是字符串（如多模態消息），則使用空字符串
      
      if (!query) {
        // 沒有有效查詢，直接調用標準 API
        chatLogger.info('發現空查詢，跳過 FAQ 搜索');
        return this.callGroqApi(options);
      }
        
      chatLogger.info('嘗試查找相關FAQ', {
        queryPreview: `${query.substring(0, 50)}${query.length > 50 ? '...' : ''}`,
        queryLength: query.length
      });
      
      // 使用 withFallback 來處理 Pinecone 搜索失敗的情況
      faqs = await withFallback<FaqSearchResult[]>(
        async () => {
          // 主要策略：使用 Pinecone 搜索
          const pineconeClient = createPineconeClient(this.env);
          
          // 搜索相關 FAQ
          return await pineconeClient.searchFaqs(query, { limit, threshold });
        },
        async () => {
          // 降級策略：返回空數組
          chatLogger.warn('Pinecone 搜索失敗，返回空的搜索結果');
          return [];
        },
        {
          shouldFallback: (error: any) => {
            // 記錄錯誤
            chatLogger.error('FAQ 搜索失敗，啟動降級策略', {
              error: error instanceof Error ? error.message : String(error),
              errorType: error instanceof Error ? error.name : typeof error
            });
            return true; // 總是啟動降級
          },
          logPrefix: 'Pinecone-FAQ-Search'
        }
      );
      
      chatLogger.info('FAQ 搜索結果', {
        faqCount: faqs.length,
        categories: faqs.map(f => f.category).filter(Boolean)
      });
      
      // 如果找到相關 FAQ，創建增強的系統提示詞
      if (faqs.length > 0) {
        chatLogger.info('使用 RAG 增強的提示詞');
        const enhancedSystemPrompt = createEnhancedSystemPrompt(faqs);
        const finalOptions = { ...options, messages: [enhancedSystemPrompt, ...options.messages] };
        const response = await this.callGroqApiWithSystemPrompt(options, enhancedSystemPrompt);
        
        // 如果快取啟用且適合快取 RAG 結果 (非圖片查詢)
        if (this.cacheConfig.enabled && this.cacheConfig.cacheRagResults && !options.image) {
          // 為 RAG 查詢建立快取鍵
          const cacheKey = createCacheKey(
            'groq-rag',
            options.model || DEFAULT_MODEL,
            options.temperature || DEFAULT_TEMPERATURE,
            options.maxTokens || DEFAULT_MAX_TOKENS,
            limit,
            threshold,
            options.messages.map(m => `${m.role}:${m.content.substring(0, 100)}`)
          );
          
          this.responseCache.set(cacheKey, response);
          chatLogger.debug('RAG 增強聊天結果已快取', { cacheKey });
        }
        
        return response;
      } else {
        // 沒有找到相關 FAQ，使用基本系統提示詞
        chatLogger.info('未找到相關 FAQ，使用標準提示詞');
        return this.callGroqApi(options);
      }
    };
    
    // 實現多層降級策略
    return withFallback<GroqChatResponse>(
      // 主要策略：使用 RAG 增強的聊天
      enhancedChatWithRAG,
      // 降級策略 1：使用標準系統提示詞調用 API
      async () => {
        chatLogger.warn('嘗試 RAG 失敗，降級為標準查詢');
        return this.callGroqApi(options);
      },
      {
        // 判斷何時需要降級
        shouldFallback: (error: any) => {
          chatLogger.error('增強聊天失敗，啟動降級', {
            error: error instanceof Error ? error.message : String(error),
            errorType: error instanceof Error ? error.name : typeof error
          });
          return true; // 正式環境中總是降級，以確保用戶體驗
        },
        logPrefix: 'Groq-RAG-Fallback'
      }
    );
  }
  
  /**
   * 清理資源
   */
  cleanup(): void {
    // 清理快取資源
    this.responseCache.shutdown();
    chatLogger.debug('清理 Groq 服務資源');
  }
  
  /**
   * 清除回應快取
   * @returns 清除的快取項目數量
   */
  clearResponseCache(): number {
    const size = this.responseCache.size();
    this.responseCache.clear();
    chatLogger.info('已清除 Groq 回應快取', { clearedItems: size });
    return size;
  }
  
  /**
   * 獲取快取統計資訊
   * @returns 快取統計資訊
   */
  getCacheStats(): { size: number, enabled: boolean, ttl: number, maxSize: number, cacheRagResults: boolean } {
    return {
      size: this.responseCache.size(),
      enabled: this.cacheConfig.enabled,
      ttl: this.cacheConfig.ttl,
      maxSize: this.cacheConfig.maxSize,
      cacheRagResults: this.cacheConfig.cacheRagResults
    };
  }
  
  /**
   * 使用自定義系統提示詞調用 Groq API
   * @param options 聊天完成選項
   * @param systemPrompt 自定義系統提示詞
   * @returns Groq API 回應
   */
  async callGroqApiWithSystemPrompt(
    options: ChatCompletionOptions,
    systemPrompt: ChatMessage
  ): Promise<GroqChatResponse> {
    // 創建一個新的 options 對象，但不包括原來可能存在的系統提示詞
    const userMessages = options.messages.filter((msg: ChatMessage) => msg.role !== 'system');
    
    // 在所有其他消息前添加系統提示詞
    const messagesWithSystemPrompt = [systemPrompt, ...userMessages];
    
    // 調用 Groq API
    return this.callGroqApi({
      ...options,
      messages: messagesWithSystemPrompt
    });
  }
}
