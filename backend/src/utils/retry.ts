/**
 * 重試工具
 * 提供自動重試邏輯和錯誤處理機制
 */

import { logger } from './logger';
import { ExternalApiError } from './errorHandler';

/**
 * 指數退避重試選項
 */
export interface RetryOptions {
  /** 最大重試次數 */
  maxRetries?: number;
  /** 初始延遲（毫秒） */
  initialDelay?: number;
  /** 最大延遲（毫秒） */
  maxDelay?: number;
  /** 退避因子 */
  factor?: number;
  /** 是否添加隨機抖動 */
  jitter?: boolean;
  /** 判斷錯誤是否可重試的函數 */
  isRetryable?: (error: any) => boolean;
  /** 重試前的回調函數 */
  onRetry?: (error: any, attempt: number, delay: number) => void;
  /** 日誌前綴（用於識別不同服務） */
  logPrefix?: string;
}

/**
 * 預設重試選項
 */
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelay: 300,
  maxDelay: 10000,
  factor: 2,
  jitter: true,
  logPrefix: '重試'
};

/**
 * 判斷錯誤是否可重試
 * @param error 錯誤對象
 * @returns 是否可重試
 */
export function isRetryableError(error: any): boolean {
  // 如果是我們自定義的外部 API 錯誤，檢查狀態碼
  if (error instanceof ExternalApiError) {
    // 5xx 錯誤通常表示服務器端問題，可以重試
    // 429 表示請求過多，需要重試
    return error.statusCode >= 500 || error.statusCode === 429;
  }
  
  // 檢查常見的網絡錯誤
  if (error instanceof Error) {
    const networkErrors = [
      'ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'EPIPE',
      'ENOTFOUND', 'ENETUNREACH', 'EAI_AGAIN'
    ];
    
    // 檢查錯誤訊息中是否包含網絡錯誤關鍵字
    for (const networkError of networkErrors) {
      if (error.message.includes(networkError)) {
        return true;
      }
    }
    
    // 檢查是否為超時錯誤
    if (error.message.includes('timeout') || error.message.includes('timed out')) {
      return true;
    }
  }
  
  return false;
}

/**
 * 指數退避重試函數
 * 使用指數退避策略重試函數，當遇到暫時性錯誤時自動重試
 * 
 * @param fn 要重試的異步函數
 * @param options 重試選項
 * @returns 函數執行結果，如果全部重試失敗則拋出最後一個錯誤
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = DEFAULT_RETRY_OPTIONS.maxRetries,
    initialDelay = DEFAULT_RETRY_OPTIONS.initialDelay,
    maxDelay = DEFAULT_RETRY_OPTIONS.maxDelay,
    factor = DEFAULT_RETRY_OPTIONS.factor,
    jitter = DEFAULT_RETRY_OPTIONS.jitter,
    logPrefix = DEFAULT_RETRY_OPTIONS.logPrefix,
    isRetryable = isRetryableError,
    onRetry
  } = options;

  let attempt = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      
      // 如果達到最大重試次數或錯誤不符合重試條件，拋出錯誤
      if (attempt >= maxRetries! || !isRetryable(error)) {
        throw error;
      }
      
      // 計算下一次重試的延遲時間（指數退避）
      let delay = Math.min(initialDelay! * Math.pow(factor!, attempt - 1), maxDelay!);
      
      // 添加隨機抖動，避免多個客戶端同時重試
      if (jitter) {
        delay = delay * (0.5 + Math.random() * 0.5);
      }
      
      // 記錄重試信息
      logger.warn(`${logPrefix}: 嘗試重試 (${attempt}/${maxRetries})，延遲 ${Math.round(delay)}ms`, {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorName: error instanceof Error ? error.name : 'Unknown',
        attempt,
        delay: Math.round(delay)
      });
      
      // 調用重試回調函數
      if (onRetry) {
        onRetry(error, attempt, delay);
      }
      
      // 等待延遲時間後進行下一次重試
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * 降級策略選項
 */
export interface FallbackOptions {
  /** 判斷是否應該降級的函數 */
  shouldFallback?: (error: any) => boolean;
  /** 降級前的回調函數 */
  onFallback?: (error: any) => void;
  /** 日誌前綴 */
  logPrefix?: string;
}

/**
 * 降級策略執行器
 * 如果主要策略失敗，嘗試執行備用策略
 * 
 * @param primaryFn 主要策略函數
 * @param fallbackFn 備用策略函數
 * @param options 降級選項
 * @returns 函數執行結果
 */
export async function withFallback<T>(
  primaryFn: () => Promise<T>,
  fallbackFn: () => Promise<T>,
  options: FallbackOptions = {}
): Promise<T> {
  const {
    shouldFallback = () => true,
    onFallback,
    logPrefix = '降級'
  } = options;
  
  try {
    // 嘗試執行主要策略
    return await primaryFn();
  } catch (error) {
    // 如果符合降級條件，執行備用策略
    if (shouldFallback(error)) {
      // 記錄降級信息
      logger.warn(`${logPrefix}: 主要策略失敗，啟動降級流程`, {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorName: error instanceof Error ? error.name : 'Unknown'
      });
      
      // 調用降級回調函數
      if (onFallback) {
        onFallback(error);
      }
      
      return await fallbackFn();
    }
    
    // 否則，重新拋出錯誤
    throw error;
  }
}

/**
 * 服務狀態類型
 */
type ServiceStatus = 'healthy' | 'degraded' | 'unavailable';

/**
 * 服務狀態信息
 */
interface ServiceState {
  status: ServiceStatus;
  lastCheck: number;
  failures: number;
  recoveryThreshold: number;
  lastError?: Error;
}

/**
 * API 服務降級管理器
 * 管理 API 服務的降級和恢復策略
 */
export class ServiceDegradationManager {
  private services: Map<string, ServiceState> = new Map();
  
  /**
   * 報告服務錯誤
   * @param serviceName 服務名稱
   * @param error 錯誤對象
   * @returns 當前服務狀態
   */
  reportFailure(serviceName: string, error?: Error): ServiceStatus {
    const service = this.getServiceState(serviceName);
    service.failures++;
    service.lastError = error;
    
    // 更新服務狀態
    if (service.failures >= service.recoveryThreshold) {
      service.status = 'unavailable';
    } else if (service.failures > 0) {
      service.status = 'degraded';
    }
    
    service.lastCheck = Date.now();
    this.services.set(serviceName, service);
    
    logger.warn(`服務 ${serviceName} 狀態更新為 ${service.status}`, {
      failures: service.failures,
      threshold: service.recoveryThreshold,
      errorMessage: error?.message
    });
    
    return service.status;
  }
  
  /**
   * 報告服務成功
   * @param serviceName 服務名稱
   * @returns 當前服務狀態
   */
  reportSuccess(serviceName: string): ServiceStatus {
    const service = this.getServiceState(serviceName);
    
    // 更新服務狀態
    if (service.status !== 'healthy') {
      // 如果之前不是健康狀態，記錄恢復正常
      logger.info(`服務 ${serviceName} 已恢復正常狀態`, {
        previousStatus: service.status,
        previousFailures: service.failures
      });
    }
    
    // 重置失敗計數
    service.failures = 0;
    service.status = 'healthy';
    service.lastCheck = Date.now();
    delete service.lastError;
    
    this.services.set(serviceName, service);
    
    return service.status;
  }
  
  /**
   * 檢查服務狀態
   * @param serviceName 服務名稱
   * @returns 服務狀態
   */
  getStatus(serviceName: string): ServiceStatus {
    return this.getServiceState(serviceName).status;
  }
  
  /**
   * 獲取服務狀態信息
   * @param serviceName
   * @returns 服務完整狀態
   */
  getServiceInfo(serviceName: string): ServiceState {
    return this.getServiceState(serviceName);
  }
  
  /**
   * 獲取服務狀態
   * @param serviceName 服務名稱
   * @returns 服務狀態對象
   */
  private getServiceState(serviceName: string): ServiceState {
    if (!this.services.has(serviceName)) {
      this.services.set(serviceName, {
        status: 'healthy',
        lastCheck: Date.now(),
        failures: 0,
        recoveryThreshold: 3
      });
    }
    
    return this.services.get(serviceName)!;
  }
}

// 創建全局服務降級管理器實例
export const serviceDegradation = new ServiceDegradationManager();
