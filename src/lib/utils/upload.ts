import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';

/**
 * 上傳文件到 Firebase Storage
 * @param file - 要上傳的文件
 * @param path - 存儲路徑
 * @returns Promise<string> - 文件的下載 URL
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    
    // 上傳文件
    const snapshot = await uploadBytes(storageRef, file);
    
    // 獲取下載 URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('文件上傳失敗:', error);
    toast.error('文件上傳失敗，請稍後再試');
    throw error;
  }
};

/**
 * 上傳頭像
 * @param file - 頭像文件
 * @param userId - 用戶 ID
 * @returns Promise<string> - 頭像的下載 URL
 */
export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
  // 驗證文件類型
  if (!file.type.startsWith('image/')) {
    toast.error('請上傳圖片文件');
    throw new Error('Invalid file type');
  }

  // 驗證文件大小（最大 5MB）
  if (file.size > 5 * 1024 * 1024) {
    toast.error('圖片大小不能超過 5MB');
    throw new Error('File too large');
  }

  // 生成文件路徑
  const extension = file.name.split('.').pop();
  const path = `avatars/${userId}/${Date.now()}.${extension}`;

  return uploadFile(file, path);
}; 