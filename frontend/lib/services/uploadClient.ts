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
 * 檔案上傳客戶端服務
 * 與後端 Worker API 通訊完成檔案上傳
 */
export class UploadClientService {
  /**
   * 上傳檔案到雲端存儲
   * @param file 要上傳的檔案
   * @param path 存儲路徑
   */
  async uploadFile(file: File, path: string): Promise<string> {
    try {
      console.log('準備上傳檔案...', {
        path,
        fileType: file.type,
        fileSize: file.size
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

      // 獲取 API 基礎 URL
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      if (!apiBaseUrl) {
        console.error('未設定 API 基礎 URL');
        toast.error('系統配置錯誤，請聯絡管理員');
        throw new Error('API 基礎 URL 未設定');
      }

      // 發送上傳請求到 Worker API
      const response = await fetch(`${apiBaseUrl}/api/upload`, {
        method: 'POST',
        body: formData,
        // 注意：使用 FormData 時不設定 Content-Type，瀏覽器會自動添加
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `上傳失敗: ${response.statusText}`;
        console.error('上傳回應錯誤:', errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json() as { success: boolean; url: string; error?: string };
      
      if (!data.success) {
        const errorMessage = data.error || '上傳失敗';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      console.log('檔案上傳成功，URL:', data.url);
      toast.success('檔案上傳成功');
      return data.url;
    } catch (error) {
      console.error('檔案上傳失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '檔案上傳失敗，請稍後再試';
      toast.error(errorMessage);
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
}

// 建立並匯出默認的上傳客戶端服務實例
export const uploadClient = new UploadClientService(); 