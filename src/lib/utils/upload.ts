/**
 * 引入必要的 AWS S3 SDK 和 toast 通知組件
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { toast } from 'sonner';

/**
 * 檢查必要的環境變數是否存在
 * 如果缺少任何必要的環境變數,將拋出錯誤
 */
const checkEnvVariables = () => {
  const requiredEnvVars = {
    NEXT_PUBLIC_R2_API_ENDPOINT: process.env.NEXT_PUBLIC_R2_API_ENDPOINT,
    NEXT_PUBLIC_R2_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID,
    NEXT_PUBLIC_R2_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY,
    NEXT_PUBLIC_R2_BUCKET: process.env.NEXT_PUBLIC_R2_BUCKET,
    NEXT_PUBLIC_R2_ENDPOINT: process.env.NEXT_PUBLIC_R2_ENDPOINT,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('缺少必要的環境變數:', missingVars);
    throw new Error(`缺少必要的環境變數: ${missingVars.join(', ')}`);
  }
};

// S3 客戶端實例
let S3: S3Client | null = null;
let BUCKET_NAME: string | null = null;

/**
 * 初始化 Cloudflare R2 客戶端
 * 使用環境變數配置 S3 客戶端
 * @returns {S3Client} 配置好的 S3 客戶端實例
 */
const initS3Client = () => {
  if (S3) return S3;
  
  checkEnvVariables();
  
  S3 = new S3Client({
    region: 'auto',
    endpoint: process.env.NEXT_PUBLIC_R2_API_ENDPOINT,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true
  });
  
  BUCKET_NAME = process.env.NEXT_PUBLIC_R2_BUCKET!;
  
  return S3;
};

/**
 * 將 File 對象轉換為 Buffer
 * @param file - 要轉換的文件
 * @returns Promise<Buffer> - 轉換後的 Buffer
 */
const fileToBuffer = async (file: File): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(Buffer.from(reader.result));
      } else {
        reject(new Error('Failed to convert file to buffer'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * 上傳文件到 Cloudflare R2 存儲
 * @param file - 要上傳的文件
 * @param path - 文件在 R2 中的存儲路徑
 * @returns Promise<string> - 上傳成功後的文件訪問 URL
 * @throws 上傳失敗時拋出錯誤
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // 初始化 S3 客戶端
    const client = initS3Client();
    if (!BUCKET_NAME) {
      throw new Error("存儲桶名稱未設定");
    }
    
    console.log('正在上傳文件到 R2...', {
      bucket: BUCKET_NAME,
      path,
      fileType: file.type,
      fileSize: file.size
    });

    const buffer = await fileToBuffer(file);

    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: path,
        Body: buffer,
        ContentType: file.type,
      })
    );
    
    const fileUrl = `https://${process.env.NEXT_PUBLIC_R2_ENDPOINT}/${path}`;
    console.log('文件上傳成功，URL:', fileUrl);
    
    return fileUrl;
  } catch (error) {
    console.error('文件上傳失敗:', error);
    toast.error('文件上傳失敗，請稍後再試');
    throw error;
  }
};

/**
 * 上傳用戶頭像
 * @param file - 頭像文件
 * @param userId - 用戶 ID
 * @returns Promise<string> - 上傳成功後的頭像 URL
 * @throws {Error} 當文件類型不是圖片或大小超過限制時拋出錯誤
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