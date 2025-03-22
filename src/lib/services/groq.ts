/**
 * 引入聊天相關的型別定義
 */
import type { ChatMessage, ChatCompletionOptions, ChatResponse, GroqChatResponse } from '@/lib/types/chat';

/**
 * Groq 服務類別
 * 用於處理與 Groq API 的通訊
 */
class GroqService {
  /** 預設使用的語言模型 */
  private defaultModel: string = 'llama-3.1-8b-instant';

  /**
   * 發送聊天請求到 Groq API
   * @param options - 聊天配置選項
   * @param options.messages - 聊天訊息歷史
   * @param options.model - 使用的語言模型，預設為 llama-3.1-8b-instant
   * @param options.temperature - 溫度參數，控制回應的隨機性，預設為 0.7
   * @param options.maxTokens - 最大生成的 token 數量，預設為 2048
   * @param options.stream - 是否使用串流回應，預設為 false
   * @returns 回傳 API 的回應資料
   */
  async chat({
    messages,
    model = this.defaultModel,
    temperature = 0.7,
    maxTokens = 2048,
    stream = false,
  }: ChatCompletionOptions): Promise<GroqChatResponse> {
    try {
      // 檢查是否為靜態環境（根據 Next.js 配置的 output: 'export'）
      // 在靜態環境中，我們直接返回模擬回應
      if (typeof window !== 'undefined') {
        // 只在客戶端嘗試 API 請求
        try {
          // 嘗試發送 POST 請求到 API 端點
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages,
              model,
              temperature,
              maxTokens,
              stream,
            }),
          });

          // 檢查回應狀態
          if (!response.ok) {
            throw new Error('API 請求失敗');
          }

          // 解析回應資料
          const data = await response.json() as ChatResponse;
          
          // 檢查 API 回應是否成功
          if (!data.success) {
            throw new Error(data.error?.message || 'API 請求失敗');
          }

          return data.data as GroqChatResponse;
        } catch (apiError) {
          console.error('API 請求失敗，使用模擬回應。', apiError);
          // 使用模擬回應作為回退方案
        }
      } else {
        console.log('靜態環境中運行，使用模擬回應');
      }
      
      // 在靜態環境或 API 請求失敗時使用模擬回應
      return this.getMockResponse(messages);
    } catch (error) {
      console.error('聊天請求錯誤:', error);
      throw error;
    }
  }

  /**
   * 生成模擬回應
   * @param messages 使用者訊息
   * @returns 模擬的API回應
   */
  private getMockResponse(messages: ChatMessage[]): GroqChatResponse {
    // 獲取最後一條使用者訊息
    const lastUserMessage = messages[messages.length - 1].content || '';
    
    // 簡單的關鍵詞回應機制
    let responseContent = '';
    
    if (lastUserMessage.includes('你好') || lastUserMessage.includes('嗨') || lastUserMessage.includes('哈囉')) {
      responseContent = '您好！很高興為您服務。我是輔仁大學資管系的AI助手EchoMind。有什麼我能幫助您的嗎？';
    } else if (lastUserMessage.includes('課程') || lastUserMessage.includes('學習') || lastUserMessage.includes('教學')) {
      responseContent = '輔仁大學資管系提供多樣化的課程，包括程式設計、資料庫管理、網路應用等。如果您有特定課程的問題，可以告訴我更多細節。';
    } else if (lastUserMessage.includes('專題') || lastUserMessage.includes('專案') || lastUserMessage.includes('project')) {
      responseContent = '資管系的專題是培養實務能力的重要環節。學生通常會在大三或大四時，組隊完成一個與資訊管理相關的專案，從需求分析、設計到實作都需要參與。';
    } else if (lastUserMessage.includes('就業') || lastUserMessage.includes('工作') || lastUserMessage.includes('職涯')) {
      responseContent = '資管系畢業生有多元的就業方向，包括：系統分析師、程式開發、資料分析師、專案管理、數位行銷等。根據近年調查，本系畢業生就業率相當高。';
    } else if (lastUserMessage.includes('老師') || lastUserMessage.includes('教授') || lastUserMessage.includes('師資')) {
      responseContent = '輔仁大學資管系擁有優秀的師資陣容，包括多位專精於不同領域的教授，如資料科學、人工智慧、電子商務、資訊安全等方面的專家。';
    } else if (lastUserMessage.includes('實習') || lastUserMessage.includes('產業實習') || lastUserMessage.includes('實務經驗')) {
      responseContent = '輔仁大學資管系重視學生的實務經驗，提供產業實習機會，讓學生能在實際工作環境中應用所學知識，培養專業技能和工作態度，增加就業競爭力。';
    } else if (lastUserMessage.includes('社團') || lastUserMessage.includes('學生活動') || lastUserMessage.includes('課外活動')) {
      responseContent = '輔仁大學提供豐富的學生活動和社團選擇，資管系學生可以參加相關的技術社團，如程式設計社、資料科學社等，也可以參與系上舉辦的各種活動，拓展人際關係和培養團隊合作能力。';
    } else if (lastUserMessage.includes('考研') || lastUserMessage.includes('研究所') || lastUserMessage.includes('深造')) {
      responseContent = '許多資管系學生畢業後選擇繼續深造，可報考資訊管理、資訊工程、企業管理等相關研究所。本系畢業生在研究所的表現普遍優秀，歷年考取國內外知名大學的比例較高。';
    } else if (lastUserMessage.includes('證照') || lastUserMessage.includes('考證') || lastUserMessage.includes('認證')) {
      responseContent = '資管系學生可以考取多種專業證照，如資料庫管理（Oracle、SQL Server）、網路（CCNA）、程式設計（OCPJP）、專案管理（PMP）、雲端服務（AWS、Azure）等證照，有助於提升就業競爭力。';
    } else if (lastUserMessage.includes('國際交流') || lastUserMessage.includes('交換生') || lastUserMessage.includes('留學')) {
      responseContent = '輔仁大學與全球多所大學有合作關係，資管系學生可以申請交換生計畫，前往國外大學學習一學期或一學年，拓展國際視野，提升語言能力和跨文化溝通能力。';
    } else if (lastUserMessage.includes('設備') || lastUserMessage.includes('實驗室') || lastUserMessage.includes('資源')) {
      responseContent = '資管系擁有多個專業實驗室，如雲端運算實驗室、資料科學實驗室、人工智慧實驗室等，提供先進的硬體設備和軟體資源，支援教學和研究需求。學生也可以使用這些資源進行專題研究和專案開發。';
    } else {
      // 預設回應
      responseContent = `您好！我是輔仁大學資管系的AI助手EchoMind。您的訊息是：「${lastUserMessage}」。我可以為您提供關於輔仁大學資管系的課程、師資、就業方向、專題等資訊。請問您想了解哪方面的內容呢？`;
    }
    
    // 生成回應
    return {
      id: 'mock-' + Date.now(),
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: this.defaultModel,
      choices: [
        {
          message: {
            role: 'assistant',
            content: responseContent,
          },
          index: 0,
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };
  }

  /**
   * 使用串流模式發送聊天請求
   * @param options - 聊天配置選項
   * @returns 回傳串流模式的聊天回應
   */
  async streamChat(options: ChatCompletionOptions) {
    return this.chat({ ...options, stream: true });
  }
}

// 建立單例實例
export const groqService = new GroqService();
