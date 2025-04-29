import { Env } from '../index';
import { corsHeaders, getCorsHeadersForRequest } from '../utils/cors';
import { createStorageService } from '../services/storage';
import { createSuccessResponse, createErrorResponse, handleError, ValidationError } from '../utils/errorHandler';
import { uploadLogger } from '../utils/logger';

/**
 * 處理檔案上傳請求
 * @param request 請求對象
 * @param env 環境變數
 * @returns 回應對象
 */
export async function handleUpload(request: Request, env: Env): Promise<Response> {
  // 生成請求 ID 用於追蹤
  const requestId = crypto.randomUUID();
  const logger = uploadLogger.forRequest(requestId);
  
  try {
    logger.info('開始處理檔案上傳請求');
    
    // 驗證請求方法
    if (request.method !== 'POST') {
      return createErrorResponse('方法不允許', 405, request);
    }
    
    // 可選：驗證使用者身份
    // const authResult = await verifyAuth(request, env);
    // if (!authResult.isAuthenticated) {
    //   return createErrorResponse('未授權', 401, request);
    // }
    
    // 解析表單數據
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const path = formData.get('path') as string | null;
    
    // 檢查必要參數
    if (!file || !path) {
      logger.warn('缺少上傳參數', { 
        hasFile: !!file, 
        hasPath: !!path 
      });
      
      throw new ValidationError('缺少檔案或路徑參數');
    }
    
    logger.info('上傳檔案資訊', {
      filename: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      uploadPath: path
    });
    
    // 創建儲存服務
    const storageService = createStorageService(env);
    
    // 檢查檔案大小（最大 10MB）
    if (storageService.isFileSizeExceeded(file.size)) {
      throw new ValidationError('檔案大小不能超過 10MB');
    }
    
    // 轉換檔案為 ArrayBuffer 並轉為 Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const fileContent = new Uint8Array(arrayBuffer);
    
    // 上傳檔案到 R2
    const fileUrl = await storageService.uploadFile(fileContent, path, file.type);
    
    // 返回成功回應
    return createSuccessResponse(
      { success: true, url: fileUrl },
      200,
      request
    );
    
  } catch (error) {
    return handleError(error, request);
  }
}