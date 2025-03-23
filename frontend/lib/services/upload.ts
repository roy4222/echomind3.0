import { toast } from 'sonner';

/**
 * 上傳設定常數
 */
export const UPLOAD_CONSTANTS = {
  // 最大檔案大小 (10MB)
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  // 允許的圖片類型
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

/**
 * 取得適用的 API URL
 */
function getApiUrl(): string {
  // 直接使用配置的 API URL
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://echomind-api.roy422roy.workers.dev';
}

/**
 * 檔案上傳服務
 * 提供檔案上傳相關功能，與後端 Worker API 通訊完成檔案上傳
 */
export class UploadService {
  /**
   * 上傳檔案到雲端存儲
   * @param file 要上傳的檔案
   * @param path 存儲路徑
   */
  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const apiUrl = getApiUrl();
      
      console.log('準備上傳檔案...', {
        path,
        fileType: file.type,
        fileSize: file.size,
        apiEndpoint: `${apiUrl}/api/upload`
      });

      // 檢查檔案大小
      if (file.size > UPLOAD_CONSTANTS.MAX_FILE_SIZE) {
        const sizeMB = UPLOAD_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024);
        toast.error(`檔案大小不能超過 ${sizeMB}MB`);
        throw new Error('檔案過大');
      }

      // 建立 FormData 對象
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', path);

      // 發送上傳請求到API
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include' // 添加憑證支援，確保 Cookie 能夠跨域傳送
      });

      if (!response.ok) {
        let errorMessage = `上傳失敗: ${response.statusText}`;
        try {
          // 嘗試獲取詳細錯誤信息
          const errorBody = await response.text();
          console.error('API 錯誤詳情:', errorBody);
        } catch (e) {}
        
        throw new Error(errorMessage);
      }

      const data = await response.json() as { success: boolean; url: string; error?: string };
      
      if (!data.success) {
        throw new Error(data.error || '上傳失敗');
      }

      console.log('檔案上傳成功，URL:', data.url);
      return data.url;
    } catch (error) {
      console.error('檔案上傳失敗:', error);
      toast.error('檔案上傳失敗，請稍後再試');
      throw error;
    }
  }

  /**
   * 上傳用戶頭像
   * @param file 頭像檔案
   * @param userId 用戶 ID
   */
  async uploadAvatar(file: File, userId: string): Promise<string> {
    // 驗證檔案類型
    if (!UPLOAD_CONSTANTS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('請上傳有效的圖片檔案 (JPEG, PNG, GIF, WebP)');
      throw new Error('無效的檔案類型');
    }

    // 驗證檔案大小
    if (file.size > UPLOAD_CONSTANTS.MAX_FILE_SIZE) {
      const sizeMB = UPLOAD_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024);
      toast.error(`圖片大小不能超過 ${sizeMB}MB`);
      throw new Error('檔案過大');
    }

    // 生成檔案路徑
    const extension = file.name.split('.').pop() || 'jpg';
    const path = `avatars/${userId}/${Date.now()}.${extension}`;

    return this.uploadFile(file, path);
  }
  
  /**
   * 上傳聊天相關圖片
   * @param file 圖片檔案
   * @param chatId 聊天 ID
   */
  async uploadChatImage(file: File, chatId: string): Promise<string> {
    // 驗證檔案類型
    if (!UPLOAD_CONSTANTS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('請上傳有效的圖片檔案 (JPEG, PNG, GIF, WebP)');
      throw new Error('無效的檔案類型');
    }
    
    // 生成檔案路徑
    const extension = file.name.split('.').pop() || 'jpg';
    const path = `chats/${chatId}/images/${Date.now()}.${extension}`;
    
    return this.uploadFile(file, path);
  }
}

// 建立並匯出默認的上傳服務實例
export const uploadService = new UploadService();

// 為了向後兼容，也匯出客戶端別名
export const uploadClient = uploadService; 