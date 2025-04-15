/**
 * Groq 服務
 * 用於處理與 Groq API 的通訊以及 RAG 整合
 */
import { Env } from '../index';
import { createEnvironmentManager } from '../utils/environment';
import { ExternalApiError } from '../utils/errorHandler';
import type { ChatMessage, ChatCompletionOptions, GroqChatResponse, FaqSearchResult } from '../types/chat';
import { MODEL_MAPPING, getModelConfig, modelSupportsImages } from '../config/models';
import { PineconeClient } from './pinecone';

/**
 * 預設配置參數
 */
const DEFAULT_MODEL = getModelConfig('default').name;
const DEFAULT_TEMPERATURE = getModelConfig('default').temperature;
const DEFAULT_MAX_TOKENS = getModelConfig('default').maxTokens;

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
  private env: Env;
  
  /**
   * 建立 Groq 服務
   * @param env 環境變數
   */
  constructor(env: Env) {
    this.env = env;
  }
  
  /**
   * 調用 Groq API 
   * @param options 聊天完成選項
   * @returns Groq API 回應
   */
  async callGroqApi(
    { messages, model = DEFAULT_MODEL, temperature = DEFAULT_TEMPERATURE, maxTokens = DEFAULT_MAX_TOKENS, image }: ChatCompletionOptions
  ): Promise<GroqChatResponse> {
    try {
      const url = 'https://api.groq.com/openai/v1/chat/completions';
      
      // 建立環境變數管理器
      const envManager = createEnvironmentManager(this.env);
      
      // 根據前端選擇的模型 ID 映射到實際模型名稱和參數
      let actualModel = DEFAULT_MODEL;
      let actualTemperature = temperature;
      let actualMaxTokens = maxTokens;
      let modelDisplayName = '預設模型';
      
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
        
        console.log(`🔄 切換到模型: ${modelDisplayName} (ID: ${model})`);
        console.log(`📝 模型參數: 溫度=${actualTemperature}, 最大Tokens=${actualMaxTokens}`);
      } else if (model.includes('llama') || model.includes('deepseek') || model.includes('qwen')) {
        // 如果傳入的是完整模型名稱，直接使用
        actualModel = model;
        modelDisplayName = model;
        console.log(`🔄 使用直接指定的模型: ${model}`);
      } else {
        console.log(`⚠️ 未知模型 ID: ${model}，使用預設模型: ${DEFAULT_MODEL}`);
      }
      
      console.log('📊 Groq API 請求詳情:', {
        modelId: model,
        actualModel: actualModel,
        modelName: modelDisplayName,
        messagesCount: messages.length,
        temperature: actualTemperature,
        maxTokens: actualMaxTokens,
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
          
          console.log('✅ 已將圖片添加到用戶訊息中');
        } else {
          console.log('⚠️ 未找到用戶訊息，無法添加圖片');
        }
      }
      
      // 發送請求到 Groq API
      console.log(`🌐 發送請求到 Groq API (模型: ${modelDisplayName})...`);
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.env.GROQ_API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });
      const endTime = Date.now();
      console.log(`⏱️ Groq API 請求耗時: ${endTime - startTime}ms (模型: ${modelDisplayName})`);
      
      // 檢查回應狀態
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Groq API 回應錯誤:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData
        });
        
        // 使用專門的外部 API 錯誤類型
        throw new ExternalApiError(
          JSON.stringify(errorData),
          'Groq',
          response.status
        );
      }
      
      // 解析回應
      const responseData = await response.json() as GroqChatResponse;
      console.log(`✅ 模型 ${modelDisplayName} 回應成功:`, {
        model: responseData.model,
        usage: responseData.usage,
        responseCharCount: responseData.choices[0]?.message?.content?.length || 0
      });
      
      // 返回 Groq API 回應
      return responseData;
      
    } catch (error) {
      // 如果已經是 ExternalApiError，直接拋出
      if (error instanceof ExternalApiError) {
        throw error;
      }
      
      // 否則包裝為 ExternalApiError
      console.error('❌ Groq API 請求錯誤:', error);
      console.error('錯誤詳情:', error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : '未知錯誤類型');
      
      throw new ExternalApiError(
        error instanceof Error ? error.message : '與 Groq API 通訊時發生錯誤',
        'Groq'
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
    try {
      // 從最後一條用戶訊息獲取查詢文本
      const userMessages = options.messages.filter((msg: ChatMessage) => msg.role === 'user');
      const lastUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
      
      if (!lastUserMessage) {
        throw new Error('未找到用戶訊息');
      }
      
      const query = lastUserMessage.content;
      console.log(`🔍 RAG: 開始處理用戶查詢: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`);
      
      // 創建 Pinecone 客戶端
      const pinecone = new PineconeClient(
        this.env.PINECONE_API_KEY,
        this.env.PINECONE_ENVIRONMENT,
        this.env.PINECONE_INDEX || this.env.PINECONE_INDEX_NAME || '',
        this.env,
        this.env.PINECONE_API_URL
      );
      
      // 查詢相關 FAQ
      console.log(`🔍 RAG: 開始在向量資料庫中搜尋相關資訊 (限制: ${limit}, 閾值: ${threshold})`);
      const faqs = await pinecone.searchFaqs(query, limit, threshold);
      
      console.log(`🔍 RAG: 找到 ${faqs.length} 個相關答案`);
      
      // 如果找到相關 FAQ，創建增強的系統提示詞
      let finalOptions = { ...options };
      if (faqs.length > 0) {
        console.log(`🔄 RAG: 創建增強的系統提示詞，整合 ${faqs.length} 個相關知識點`);
        
        // 記錄找到的 FAQ
        faqs.forEach((faq, index) => {
          console.log(`🔄 RAG: FAQ #${index + 1}: "${faq.question.substring(0, 30)}..." (相似度: ${faq.score.toFixed(2)})`);
        });
        
        // 創建增強的系統提示詞
        const enhancedSystemPrompt = createEnhancedSystemPrompt(faqs);
        
        // 替換原始系統提示詞
        finalOptions = {
          ...options,
          messages: [
            ...options.messages
          ]
        };
        
        // 調用 Groq API 並返回結果
        console.log(`🤖 RAG: 使用增強提示詞調用 Groq API`);
        return this.callGroqApiWithSystemPrompt(finalOptions, enhancedSystemPrompt);
      } else {
        // 沒有找到相關 FAQ，使用基本系統提示詞
        console.log(`🤖 RAG: 未找到相關知識，使用基本系統提示詞`);
        return this.callGroqApi(options);
      }
    } catch (error) {
      console.error('❌ RAG 增強聊天錯誤:', error);
      
      // 降級策略: 如果 RAG 增強失敗，回退到直接調用 Groq
      console.log('🔄 RAG: 增強查詢失敗，降級為標準查詢');
      return this.callGroqApi(options);
    }
  }
  
  /**
   * 使用自定義系統提示詞調用 Groq API
   * @param options 聊天完成選項
   * @param systemPrompt 自定義系統提示詞
   * @returns Groq API 回應
   */
  private async callGroqApiWithSystemPrompt(
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
