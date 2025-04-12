/**
 * API 服務基礎類別
 * 處理與後端 Workers API 的通訊
 */
export class ApiService {
  private baseUrl: string;

  constructor() {
    // 使用與 ChatInput.tsx 相同的環境變數
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  /**
   * 發送 GET 請求
   * @param endpoint API 端點
   * @param options 請求選項
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...options
    });
  }

  /**
   * 發送 POST 請求
   * @param endpoint API 端點
   * @param data 請求數據
   * @param options 請求選項
   */
  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
  }

  /**
   * 發送 API 請求
   * @param endpoint API 端點
   * @param options 請求選項
   */
  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // 獲取身份驗證令牌
    const token = await this.getAuthToken();
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
      });

      if (!response.ok) {
        throw new Error(`API 請求失敗: ${response.statusText}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error('API 請求錯誤:', error);
      throw error;
    }
  }
  
  /**
   * 獲取身份驗證令牌
   * @returns 用戶令牌或 null
   */
  private async getAuthToken(): Promise<string | null> {
    // 從 Firebase 獲取當前用戶令牌
    // 這需要根據您的身份驗證實現來調整
    try {
      // Firebase 令牌獲取邏輯
      // 暫時返回 null，後續會實現
      return null;
    } catch (error) {
      console.error('獲取認證令牌失敗:', error);
      return null;
    }
  }

  /**
   * 測試 API 連接狀態
   * @param endpoint 要測試的端點
   * @returns 連接測試結果
   */
  async testConnection(endpoint: string = '/api/health'): Promise<{
    success: boolean;
    statusCode?: number;
    message: string;
    timeMs: number;
  }> {
    const startTime = Date.now();
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log(`測試 API 連接: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const timeMs = Date.now() - startTime;
      
      if (!response.ok) {
        return {
          success: false,
          statusCode: response.status,
          message: `服務端回應錯誤: ${response.status} ${response.statusText}`,
          timeMs
        };
      }
      
      return {
        success: true,
        statusCode: response.status,
        message: `連接成功 (${response.status})`,
        timeMs
      };
    } catch (error) {
      const timeMs = Date.now() - startTime;
      return {
        success: false,
        message: `連接失敗: ${error instanceof Error ? error.message : '未知錯誤'}`,
        timeMs
      };
    }
  }
  
  /**
   * 測試向量搜尋 API
   * @returns 向量搜尋 API 測試結果
   */
  async testVectorSearch(): Promise<{
    success: boolean;
    pingSuccess?: boolean;
    searchSuccess?: boolean;
    message: string;
    details?: any;
  }> {
    console.log('測試向量搜尋 API...');
    const testQuery = "這是一個測試查詢";
    
    try {
      const searchUrl = `${this.baseUrl}/api/faq`;
      console.log('向量搜尋測試 URL:', searchUrl);
      
      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: testQuery,
          topK: 1,
        }),
      });
      
      if (!response.ok) {
        let errorMsg = `向量搜尋端點回應錯誤: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMsg += ` - ${JSON.stringify(errorData)}`;
        } catch (e) {
          // 解析 JSON 失敗，忽略
        }
        
        console.error(errorMsg);
        return {
          success: false,
          pingSuccess: true,
          searchSuccess: false,
          message: errorMsg,
        };
      }
      
      const data = await response.json();
      console.log('向量搜尋測試回應:', data);
      
      if (!data.success) {
        return {
          success: false,
          pingSuccess: true,
          searchSuccess: false,
          message: `向量搜尋端點回應錯誤: ${data.error?.message || 'Unknown error'}`,
          details: data.error,
        };
      }
      
      return {
        success: true,
        pingSuccess: true,
        searchSuccess: true,
        message: `向量搜尋測試成功，找到 ${data.results?.length || 0} 個結果`,
        details: {
          resultsCount: data.results?.length || 0,
          firstResult: data.results?.[0] ? {
            id: data.results[0].id,
            score: data.results[0].score,
          } : null,
        },
      };
    } catch (error) {
      const errorMsg = `向量搜尋測試失敗: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMsg);
      
      return {
        success: false,
        message: errorMsg,
      };
    }
  }

}

// 建立並匯出默認的 API 服務實例
export const apiService = new ApiService(); 