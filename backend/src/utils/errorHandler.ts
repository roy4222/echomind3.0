/**
 * 錯誤處理工具
 * 提供統一的錯誤回應格式和錯誤處理函數
 */

import { getCorsHeadersForRequest } from './cors';
import { logger } from './logger';

/**
 * 錯誤回應介面
 */
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
  requestId?: string;
}

/**
 * 成功回應介面
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  requestId?: string;
}

/**
 * API 回應類型
 */
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

/**
 * 建立錯誤回應
 * @param message 錯誤訊息
 * @param status HTTP 狀態碼
 * @param request 請求對象 (用於添加 CORS 標頭)
 * @param options 其他選項
 * @returns Response 對象
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  request?: Request,
  options?: {
    code?: string;
    details?: any;
    requestId?: string;
  }
): Response {
  const { code, details, requestId } = options || {};
  
  // 建立錯誤回應物件
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      ...(code ? { code } : {}),
      ...(details ? { details } : {})
    },
    ...(requestId ? { requestId } : {})
  };
  
  // 設定回應標頭
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  // 如果有請求對象，添加 CORS 標頭
  if (request) {
    Object.assign(headers, getCorsHeadersForRequest(request));
  }
  
  // 返回 Response 對象
  return new Response(JSON.stringify(errorResponse), {
    status,
    headers
  });
}

/**
 * 建立成功回應
 * @param data 回應數據
 * @param status HTTP 狀態碼
 * @param request 請求對象 (用於添加 CORS 標頭)
 * @param requestId 請求 ID
 * @returns Response 對象
 */
export function createSuccessResponse<T = any>(
  data: T,
  status: number = 200,
  request?: Request,
  requestId?: string
): Response {
  // 建立成功回應物件
  const successResponse: SuccessResponse<T> = {
    success: true,
    data,
    ...(requestId ? { requestId } : {})
  };
  
  // 設定回應標頭
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  // 如果有請求對象，添加 CORS 標頭
  if (request) {
    Object.assign(headers, getCorsHeadersForRequest(request));
  }
  
  // 返回 Response 對象
  return new Response(JSON.stringify(successResponse), {
    status,
    headers
  });
}

/**
 * 處理錯誤並返回統一的錯誤回應
 * @param error 錯誤對象
 * @param request 請求對象 (用於添加 CORS 標頭)
 * @param requestId 請求 ID
 * @returns Response 對象
 */
export function handleError(
  error: unknown,
  request?: Request,
  requestId?: string
): Response {
  // 記錄錯誤詳情
  logger.error('處理錯誤', requestId, error);
  
  // 根據錯誤類型提取訊息
  let message = '伺服器內部錯誤';
  let status = 500;
  let details = undefined;
  
  if (error instanceof Error) {
    message = error.message;
    
    // 記錄詳細錯誤資訊
    logger.error('錯誤詳情', requestId, {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // 處理特定類型的錯誤
    if (error.name === 'ValidationError') {
      status = 400; // 請求參數錯誤
    } else if (error.name === 'AuthenticationError') {
      status = 401; // 認證錯誤
    } else if (error.name === 'AuthorizationError') {
      status = 403; // 授權錯誤
    } else if (error.name === 'NotFoundError') {
      status = 404; // 資源不存在
    }
    
    // 提取錯誤詳情
    if ((error as any).details) {
      details = (error as any).details;
    }
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object') {
    // 嘗試從對象中提取訊息
    if ((error as any).message) {
      message = (error as any).message;
    } else {
      message = '未知錯誤';
      details = error;
    }
  }
  
  // 返回統一的錯誤回應
  return createErrorResponse(message, status, request, {
    details,
    requestId
  });
}

/**
 * 自定義錯誤類別 - 驗證錯誤
 */
export class ValidationError extends Error {
  details?: any;
  
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

/**
 * 自定義錯誤類別 - 認證錯誤
 */
export class AuthenticationError extends Error {
  constructor(message: string = '未授權：請先登入') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * 自定義錯誤類別 - 授權錯誤
 */
export class AuthorizationError extends Error {
  constructor(message: string = '禁止存取：權限不足') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

/**
 * 自定義錯誤類別 - 資源不存在錯誤
 */
export class NotFoundError extends Error {
  constructor(resource: string = '資源') {
    super(`找不到指定的${resource}`);
    this.name = 'NotFoundError';
  }
}

/**
 * 自定義錯誤類別 - 外部 API 錯誤
 */
export class ExternalApiError extends Error {
  statusCode: number;
  apiName: string;
  retryable: boolean;
  details?: any;
  
  constructor(message: string, apiName: string, statusCode: number = 500, retryable?: boolean, details?: any) {
    super(message);
    this.name = 'ExternalApiError';
    this.apiName = apiName;
    this.statusCode = statusCode;
    // 自動判斷是否可重試：5xx 和 429 (Too Many Requests) 通常可以重試
    this.retryable = retryable ?? (statusCode >= 500 || statusCode === 429);
    this.details = details;
  }
  
  /**
   * 判斷錯誤是否可重試
   * @returns 是否可重試
   */
  isRetryable(): boolean {
    return this.retryable;
  }
  
  /**
   * 創建一個可重試的 API 錯誤
   * @param message 錯誤訊息
   * @param apiName API 名稱
   * @param statusCode HTTP 狀態碼
   * @param details 錯誤詳情
   * @returns ExternalApiError 實例
   */
  static retryable(message: string, apiName: string, statusCode: number = 500, details?: any): ExternalApiError {
    return new ExternalApiError(message, apiName, statusCode, true, details);
  }
  
  /**
   * 創建一個不可重試的 API 錯誤
   * @param message 錯誤訊息
   * @param apiName API 名稱
   * @param statusCode HTTP 狀態碼
   * @param details 錯誤詳情
   * @returns ExternalApiError 實例
   */
  static nonRetryable(message: string, apiName: string, statusCode: number = 500, details?: any): ExternalApiError {
    return new ExternalApiError(message, apiName, statusCode, false, details);
  }
}
