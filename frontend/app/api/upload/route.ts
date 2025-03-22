import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// 開發模式下使用模擬上傳
const isDevelopment = process.env.NODE_ENV === 'development';
const useRealUpload = process.env.USE_REAL_UPLOAD === 'true';

// S3 客戶端實例
let s3Client: S3Client | null = null;

/**
 * 初始化 S3 客戶端
 */
const getS3Client = () => {
  if (s3Client) return s3Client;
  
  // 檢查環境變數
  const r2ApiEndpoint = process.env.R2_API_ENDPOINT;
  const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
  const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  
  if (!r2ApiEndpoint || !r2AccessKeyId || !r2SecretAccessKey) {
    throw new Error('缺少 R2 配置環境變數');
  }
  
  s3Client = new S3Client({
    region: 'auto',
    endpoint: r2ApiEndpoint,
    credentials: {
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
    },
    forcePathStyle: true
  });
  
  return s3Client;
};

/**
 * 將 File 轉換為 Buffer
 */
async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * 處理上傳請求
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;
    
    console.log('處理上傳請求:', { 
      fileName: file.name, 
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      path,
      mode: isDevelopment ? '開發環境' : '生產環境',
      uploadMethod: (isDevelopment && !useRealUpload) ? '模擬上傳' : '實際 R2 上傳'
    });
    
    // 開發環境且非強制使用真實上傳時，使用模擬上傳
    if (isDevelopment && !useRealUpload) {
      // 模擬處理延遲
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 分析路徑以確定需要返回的圖片類型
      const isAvatar = path.includes('avatars');
      
      // 使用真實可存取的圖片 URL (使用 Placeholder 服務)
      const mockUrl = isAvatar 
        ? 'https://via.placeholder.com/150' // 頭像使用 150x150 的圖片
        : 'https://via.placeholder.com/500'; // 聊天圖片使用 500x500 的圖片
      
      return NextResponse.json({ 
        success: true, 
        url: mockUrl
      });
    }
    
    // 生產環境或強制使用真實上傳時，使用 R2 上傳
    try {
      // 確保存在所需環境變數
      const r2Bucket = process.env.R2_BUCKET;
      const r2Endpoint = process.env.NEXT_PUBLIC_R2_ENDPOINT;
      
      if (!r2Bucket || !r2Endpoint) {
        throw new Error('缺少 R2 桶或端點配置');
      }
      
      // 獲取 S3 客戶端
      const client = getS3Client();
      
      // 轉換文件為 Buffer
      const buffer = await fileToBuffer(file);
      
      // 上傳到 R2
      await client.send(
        new PutObjectCommand({
          Bucket: r2Bucket,
          Key: path,
          Body: buffer,
          ContentType: file.type,
        })
      );
      
      // 構建檔案 URL
      const fileUrl = `https://${r2Endpoint}/${path}`;
      console.log('檔案上傳成功，URL:', fileUrl);
      
      return NextResponse.json({ 
        success: true, 
        url: fileUrl
      });
    } catch (uploadError) {
      console.error('R2 上傳錯誤:', uploadError);
      return NextResponse.json(
        { 
          success: false, 
          error: uploadError instanceof Error ? uploadError.message : '上傳處理錯誤'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('上傳 API 錯誤:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '上傳處理錯誤' },
      { status: 500 }
    );
  }
} 