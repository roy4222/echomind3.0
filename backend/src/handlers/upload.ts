import { Env } from '../index';
import { corsHeaders } from '../utils/cors';
import { verifyAuth } from '../middlewares/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// S3 客戶端快取
let S3_CLIENT: S3Client | null = null;

/**
 * 初始化 S3 客戶端
 * @param env 環境變數
 * @returns S3 客戶端
 */
function getS3Client(env: Env): S3Client {
  if (S3_CLIENT) return S3_CLIENT;
  
  console.log('初始化 S3 客戶端...', {
    endpoint: env.R2_API_ENDPOINT,
    hasAccessKey: !!env.R2_ACCESS_KEY_ID,
    hasSecretKey: !!env.R2_SECRET_ACCESS_KEY
  });
  
  S3_CLIENT = new S3Client({
    region: 'auto',
    endpoint: env.R2_API_ENDPOINT,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true
  });
  
  return S3_CLIENT;
}

/**
 * 處理檔案上傳請求
 * @param request 請求對象
 * @param env 環境變數
 * @returns 回應對象
 */
export async function handleUpload(request: Request, env: Env): Promise<Response> {
  // 添加 CORS 標頭
  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };
  
  try {
    console.log('開始處理檔案上傳請求');
    
    // 檢查環境變數是否正確設置
    if (!env.R2_BUCKET || !env.R2_ENDPOINT || !env.R2_API_ENDPOINT) {
      console.error('缺少必要的 R2 環境變數:', {
        bucket: !!env.R2_BUCKET,
        endpoint: !!env.R2_ENDPOINT,
        apiEndpoint: !!env.R2_API_ENDPOINT
      });
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: '伺服器配置錯誤: R2 環境變數未設置' 
      }), { 
        status: 500, 
        headers 
      });
    }
    
    // 驗證請求方法
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '方法不允許' 
      }), { 
        status: 405, 
        headers 
      });
    }
    
    // 可選：驗證使用者身份
    // const authResult = await verifyAuth(request, env);
    // if (!authResult.isAuthenticated) {
    //   return new Response(JSON.stringify({ 
    //     success: false, 
    //     error: '未授權' 
    //   }), { 
    //     status: 401, 
    //     headers 
    //   });
    // }
    
    // 解析表單數據
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const path = formData.get('path') as string | null;
    
    // 檢查必要參數
    if (!file || !path) {
      console.log('缺少上傳參數:', { 
        hasFile: !!file, 
        hasPath: !!path 
      });
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: '缺少檔案或路徑參數' 
      }), { 
        status: 400, 
        headers 
      });
    }
    
    console.log('上傳檔案資訊:', {
      filename: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      uploadPath: path
    });
    
    // 檢查檔案大小（最大 10MB）
    if (file.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '檔案大小不能超過 10MB' 
      }), { 
        status: 400, 
        headers 
      });
    }
    
    // 初始化 S3 客戶端
    const s3Client = getS3Client(env);
    
    // 轉換檔案為 ArrayBuffer 並轉為 Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const fileContent = new Uint8Array(arrayBuffer);
    
    console.log('準備發送至 R2...', {
      bucket: env.R2_BUCKET,
      key: path,
      contentType: file.type
    });
    
    // 上傳檔案到 R2
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: env.R2_BUCKET,
          Key: path,
          Body: fileContent,
          ContentType: file.type,
        })
      );
    } catch (uploadError) {
      console.error('R2 上傳錯誤:', uploadError);
      return new Response(JSON.stringify({
        success: false,
        error: uploadError instanceof Error 
          ? `R2 上傳錯誤: ${uploadError.message}` 
          : 'R2 上傳失敗'
      }), { 
        status: 500, 
        headers 
      });
    }
    
    // 構建檔案 URL
    const fileUrl = `https://${env.R2_ENDPOINT}/${path}`;
    console.log('檔案上傳成功，URL:', fileUrl);
    
    // 返回成功回應
    return new Response(JSON.stringify({
      success: true,
      url: fileUrl
    }), { 
      status: 200, 
      headers 
    });
    
  } catch (error) {
    console.error('檔案上傳處理錯誤:', error);
    
    // 返回錯誤回應
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '處理檔案上傳時發生錯誤'
    }), { 
      status: 500, 
      headers 
    });
  }
} 