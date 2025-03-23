import { useState } from 'react';
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

// Workers API 網址
const WORKER_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://echomind-api.roy422roy.workers.dev';

/**
 * 檔案上傳結果
 */
interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * 檔案上傳狀態
 */
export interface UploadState {
  uploading: boolean;
  progress: number;
  result: UploadResult | null;
  error: string | null;
}

/**
 * 檔案上傳選項
 */
export interface UploadOptions {
  /** 檔案存放路徑 */
  path: string;
  /** 允許的檔案類型 */
  acceptedFileTypes?: string[];
  /** 最大檔案大小 (bytes) */
  maxFileSize?: number;
}

/**
 * 上傳服務 Hook
 * @param options 上傳選項
 * @returns 上傳狀態和上傳函數
 */
export function useUpload(options: UploadOptions) {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    result: null,
    error: null
  });

  /**
   * 上傳檔案
   * @param file 要上傳的檔案
   */
  const uploadFile = async (file: File): Promise<UploadResult> => {
    // 檢查檔案類型
    if (options.acceptedFileTypes && !options.acceptedFileTypes.includes(file.type)) {
      return {
        success: false,
        error: `不支援的檔案類型: ${file.type}。請上傳 ${options.acceptedFileTypes.join(', ')} 格式的檔案。`
      };
    }

    // 檢查檔案大小
    if (options.maxFileSize && file.size > options.maxFileSize) {
      const maxSizeMB = (options.maxFileSize / (1024 * 1024)).toFixed(2);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        success: false,
        error: `檔案太大: ${fileSizeMB}MB。最大允許大小為 ${maxSizeMB}MB。`
      };
    }

    try {
      // 設置上傳中狀態
      setState({
        uploading: true,
        progress: 10,
        result: null,
        error: null
      });

      // 建立 FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', options.path);

      // 模擬上傳進度
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 200);

      // 直接調用 Workers 上傳 API
      const response = await fetch(`${WORKER_API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      // 清除進度計時器
      clearInterval(progressInterval);

      // 處理回應
      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.error || '上傳失敗'
        };
      }

      const data = await response.json();
      return {
        success: true,
        url: data.url
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '上傳過程發生錯誤'
      };
    } finally {
      // 完成上傳，設置最終狀態
      setState(prev => ({
        ...prev,
        uploading: false,
        progress: 100
      }));
    }
  };

  /**
   * 執行上傳並更新狀態
   * @param file 要上傳的檔案
   */
  const upload = async (file: File) => {
    const result = await uploadFile(file);
    setState({
      uploading: false,
      progress: result.success ? 100 : 0,
      result,
      error: result.error || null
    });
    return result;
  };

  return {
    state,
    upload
  };
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
      const apiUrl = WORKER_API_URL;
      
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