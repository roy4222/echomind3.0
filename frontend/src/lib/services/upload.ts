import { apiService } from './api';
import { toast } from 'sonner';

/**
 * 檔案上傳服務
 * 與後端 Worker API 通訊完成檔案上傳
 */
export class UploadService {
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

      // 建立 FormData 對象
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', path);

      // 發送上傳請求到 Worker API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        // 注意：使用 FormData 時不設定 Content-Type，瀏覽器會自動添加
      });

      if (!response.ok) {
        throw new Error(`上傳失敗: ${response.statusText}`);
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
    if (!file.type.startsWith('image/')) {
      toast.error('請上傳圖片檔案');
      throw new Error('無效的檔案類型');
    }

    // 驗證檔案大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      toast.error('圖片大小不能超過 5MB');
      throw new Error('檔案過大');
    }

    // 生成檔案路徑
    const extension = file.name.split('.').pop();
    const path = `avatars/${userId}/${Date.now()}.${extension}`;

    return this.uploadFile(file, path);
  }
}

// 建立並匯出默認的上傳服務實例
export const uploadService = new UploadService(); 