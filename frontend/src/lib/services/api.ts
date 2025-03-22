/**
 * API 服務基礎類別
 * 處理與後端 Workers API 的通訊
 */
export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
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
}

// 建立並匯出默認的 API 服務實例
export const apiService = new ApiService(); 