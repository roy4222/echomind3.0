/**
 * 請求處理器模組
 * 提供統一的請求處理和錯誤捕獲流程
 */
import { Env } from '../index';
import { getCorsHeadersForRequest } from './cors';
import { logger } from './logger';

/**
 * 基本請求處理器介面
 */
export type RequestHandler = (request: Request, env: Env, requestId?: string) => Promise<Response>;

/**
 * 建立統一格式的回應
 * @param data 回應數據
 * @param status HTTP 狀態碼
 * @param request 請求對象 (用於添加 CORS 標頭)
 * @param requestId 請求 ID
 * @returns Response 對象
 */
export function createResponse(
  data: any,
  status: number = 200,
  request?: Request,
  requestId?: string
): Response {
  // 判斷是成功還是錯誤回應
  const isSuccess = status >= 200 && status < 300;
  
  // 建立回應主體
  const body = {
    success: isSuccess,
    ...(isSuccess 
      ? { data } 
      : { error: typeof data === 'string' ? { message: data } : data }),
    ...(requestId ? { requestId } : {})
  };
  
  // 建立回應標頭
  const headers = new Headers({
    'Content-Type': 'application/json'
  });
  
  // 添加 CORS 標頭
  if (request) {
    const corsHeaders = getCorsHeadersForRequest(request);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      headers.append(key, value);
    });
  }
  
  // 建立並返回 Response 對象
  return new Response(JSON.stringify(body), {
    status,
    headers
  });
}

/**
 * 建立請求處理器
 * @param handler 處理函數
 * @param options 選項
 * @returns 增強的請求處理器
 */
export function createRequestHandler(
  handler: RequestHandler,
  options: {
    requireAuth?: boolean;
    logRequest?: boolean;
    logResponse?: boolean;
  } = {}
): RequestHandler {
  const { 
    requireAuth = false,
    logRequest = true,
    logResponse = true 
  } = options;
  
  return async (request: Request, env: Env): Promise<Response> => {
    // 生成請求 ID
    const requestId = generateRequestId();
    
    try {
      // 記錄請求開始
      if (logRequest) {
        const url = new URL(request.url);
        logger.info(`請求開始`, { 
          requestId,
          method: request.method,
          path: url.pathname,
          searchParams: Object.fromEntries(url.searchParams.entries()),
          timestamp: new Date().toISOString()
        });
      }
      
      // TODO: 如果需要身份驗證，在這裡添加驗證邏輯
      
      // 執行處理器函數
      const response = await handler(request, env, requestId);
      
      // 記錄請求完成
      if (logResponse) {
        logger.info(`請求完成`, {
          requestId,
          status: response.status,
          timestamp: new Date().toISOString()
        });
      }
      
      return response;
    } catch (error) {
      // 處理錯誤
      logger.error(`請求錯誤`, {
        requestId,
        error: error instanceof Error 
          ? { name: error.name, message: error.message, stack: error.stack }
          : String(error),
        timestamp: new Date().toISOString()
      });
      
      // 建立錯誤回應
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStatus = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;
      
      return createResponse(
        { message: errorMessage },
        errorStatus,
        request,
        requestId
      );
    }
  };
}

/**
 * 產生隨機 ID
 */
export function generateRequestId(): string {
  return `req-${Math.random().toString(36).substring(2, 15)}-${Date.now().toString(36)}`;
}
