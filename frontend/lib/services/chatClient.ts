import type { ChatMessage, ChatCompletionOptions, ChatResponse, SimpleChatResponse, ChatRole } from '@/lib/types/chat';

/**
 * 聊天客戶端服務
 * 處理與聊天 API 的溝通
 */
export class ChatClientService {
  private baseUrl: string;

  constructor() {
    // 使用環境變數中的 API 基礎 URL，或回退到默認 Worker URL
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://echomind-api.roy422roy.workers.dev';
    console.log('🌐 初始化聊天客戶端，API基礎URL:', this.baseUrl);
  }

  /**
   * 發送聊天請求 (完整回應)
   * @param options 聊天選項
   * @returns 完整聊天回應
   */
  async chat(options: ChatCompletionOptions): Promise<ChatResponse> {
    const requestId = Math.random().toString(36).substring(2, 10);
    // 直接使用 Workers API 端點
    const apiUrl = `${this.baseUrl}/api/chat`;
    
    console.log(`📤 [${requestId}] 發送聊天請求到 ${apiUrl}:`, {
      messagesCount: options.messages?.length || 0,
      model: options.model || '默認模型',
      modelType: typeof options.model,
      modelIdValue: `"${options.model}"`, // 額外顯示原始值，便於檢查
      firstMessage: options.messages?.[0]?.content?.substring(0, 50) + '...' || '無內容'
    });
    
    // 打印完整請求體，方便調試
    console.log(`📦 [${requestId}] 完整請求體:`, JSON.stringify(options).substring(0, 500) + '...');
    
    const startTime = Date.now();
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      const endTime = Date.now();
      console.log(`⏱️ [${requestId}] API回應時間: ${endTime - startTime}ms, 狀態: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        let errorJson;
        try {
          errorJson = JSON.parse(errorText);
        } catch (e) {
          // 如果不是 JSON，保留原始文本
        }
        
        console.error(`❌ [${requestId}] API請求失敗:`, {
          status: response.status,
          statusText: response.statusText,
          errorData: errorJson || errorText
        });
        
        throw new Error(
          errorJson?.error?.message || 
          `伺服器錯誤 (${response.status}: ${response.statusText})`
        );
      }

      const data = await response.json() as ChatResponse;
      console.log(`✅ [${requestId}] API請求成功:`, {
        success: data.success,
        model: data.data?.model,
        requestedModel: options.model, // 顯示請求的模型 ID
        tokensUsed: data.data?.usage?.total_tokens,
        responseLength: data.data?.choices?.[0]?.message?.content?.length || 0
      });
      
      return data;
    } catch (error) {
      console.error(`❌ [${requestId}] 聊天請求錯誤:`, error);
      
      // 提供更詳細的錯誤信息
      const errorMessage = error instanceof Error 
        ? `${error.message} (${error.name}${error.cause ? ': ' + error.cause : ''})`
        : '聊天服務暫時不可用';
      
      console.error(`❌ [${requestId}] 詳細錯誤:`, {
        message: errorMessage,
        originalError: error
      });
      
      return {
        success: false,
        error: {
          message: errorMessage
        }
      };
    }
  }

  /**
   * 發送聊天訊息到後端 API
   * @param messages 聊天訊息列表
   * @param modelId 選擇的模型 ID（可選）
   * @param image 上傳的圖片 (base64 格式)
   */
  async sendMessage(
    messages: { role: string; content: string }[],
    modelId?: string,
    image?: string
  ): Promise<SimpleChatResponse> {
    try {
      console.log(`===== 發送聊天訊息 =====`);
      console.log(`訊息數量: ${messages.length}`);
      console.log(`選擇的模型 ID: "${modelId || 'default'}"`);
      console.log(`最後一條訊息: ${messages[messages.length - 1].content.substring(0, 50)}...`);
      console.log(`是否包含圖片: ${image ? '是' : '否'}`);

      // 將消息轉換為符合 ChatMessage 類型的格式
      const chatMessages: ChatMessage[] = messages.map(msg => ({
        role: msg.role as ChatRole,
        content: msg.content
      }));

      // 確保模型 ID 有值並且正確傳遞
      const actualModelId = modelId || 'default';
      console.log(`確認使用模型 ID: "${actualModelId}"`);

      // 構建請求對象，包含訊息和模型 ID
      const requestBody: ChatCompletionOptions = {
        messages: chatMessages,
        model: actualModelId  // 使用確認過的模型 ID
      };

      // 如果有圖片，添加到請求中
      if (image) {
        requestBody.image = image;
        console.log('已添加圖片到請求中');
      }

      console.log(`準備發送模型 ID: "${requestBody.model}"`);
      console.log(`請求對象類型: ${typeof requestBody}, model 欄位類型: ${typeof requestBody.model}`);
      
      const startTime = Date.now();
      const response = await this.chat(requestBody);
      const processingTime = Date.now() - startTime;

      if (!response.success || !response.data) {
        console.error('API 請求失敗:', response.error?.message);
        throw new Error(`API 請求失敗: ${response.error?.message || '未知錯誤'}`);
      }

      console.log(`API 響應時間: ${processingTime}ms`);
      console.log(`API 使用的模型: ${response.data.model}`);
      console.log(`API 請求成功`);
      console.log(`===== 聊天訊息結束 =====`);

      return {
        text: response.data.choices[0].message.content,
        processingTime,
      };
    } catch (error) {
      console.error('聊天請求錯誤:', error);
      throw error;
    }
  }
  
  /**
   * 發送FAQ查詢請求
   * @param query 用戶查詢
   * @param limit 返回結果數量限制
   * @returns FAQ搜尋結果
   */
  async searchFaq(query: string, limit: number = 5): Promise<any> {
    const requestId = Math.random().toString(36).substring(2, 10);
    const apiUrl = `${this.baseUrl}/api/faq`;
    
    console.log(`🔍 [${requestId}] 發送FAQ查詢到 ${apiUrl}:`, {
      query: query.substring(0, 50) + (query.length > 50 ? '...' : ''),
      limit
    });
    
    const startTime = Date.now();
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          limit
        }),
      });

      const endTime = Date.now();
      console.log(`⏱️ [${requestId}] FAQ回應時間: ${endTime - startTime}ms, 狀態: ${response.status}`);

      if (!response.ok) {
        console.error(`❌ [${requestId}] FAQ查詢失敗: ${response.statusText}`);
        throw new Error(`FAQ查詢失敗: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ [${requestId}] FAQ查詢成功:`, {
        success: data.success,
        resultsCount: data.results?.length || 0
      });
      
      return data;
    } catch (error) {
      console.error(`❌ [${requestId}] FAQ查詢失敗:`, error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'FAQ服務暫時不可用'
        }
      };
    }
  }
}

// 建立並匯出默認的聊天客戶端服務實例
export const chatClient = new ChatClientService();
