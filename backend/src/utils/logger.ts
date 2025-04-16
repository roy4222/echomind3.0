/**
 * 日誌系統
 * 提供分級日誌記錄功能和統一的日誌輸出格式
 */

/**
 * 日誌級別枚舉
 */
export enum LogLevel {
  DEBUG = 0,  // 調試信息，僅開發環境使用
  INFO = 1,   // 一般信息，記錄正常流程
  WARN = 2,   // 警告信息，可能的問題但不影響主要功能
  ERROR = 3,  // 錯誤信息，影響功能但系統仍可運行
  FATAL = 4   // 致命錯誤，導致系統無法正常運行
}

/**
 * 日誌配置接口
 */
interface LoggerConfig {
  minLevel: LogLevel;        // 最小日誌級別（低於此級別的日誌不會輸出）
  includeTimestamp: boolean; // 是否包含時間戳
  includeRequestId: boolean; // 是否包含請求ID
}

/**
 * 日誌顏色及圖標映射
 */
const LOG_STYLES = {
  [LogLevel.DEBUG]: { emoji: '🔍', color: '\x1b[36m' }, // 青色
  [LogLevel.INFO]:  { emoji: '🔵', color: '\x1b[34m' }, // 藍色
  [LogLevel.WARN]:  { emoji: '⚠️', color: '\x1b[33m' }, // 黃色
  [LogLevel.ERROR]: { emoji: '🔴', color: '\x1b[31m' }, // 紅色
  [LogLevel.FATAL]: { emoji: '💥', color: '\x1b[35m' }  // 紫色
};

/**
 * 日誌級別名稱映射
 */
const LOG_LEVEL_NAMES = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL'
};

/**
 * 默認日誌配置
 */
const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: LogLevel.INFO,
  includeTimestamp: true,
  includeRequestId: true
};

/**
 * 格式化輸出對象
 * 移除大型或敏感數據
 */
function formatObject(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // 處理數組
  if (Array.isArray(obj)) {
    // 如果數組過長，只保留前幾項
    if (obj.length > 5) {
      return [...obj.slice(0, 5).map(formatObject), `...及其他 ${obj.length - 5} 項`];
    }
    return obj.map(formatObject);
  }

  // 處理對象
  const result: Record<string, any> = {};
  
  // 敏感字段列表（需要遮蔽的字段）
  const sensitiveFields = ['password', 'token', 'key', 'secret', 'credential', 'authorization'];
  
  for (const [key, value] of Object.entries(obj)) {
    // 檢查是否為敏感字段
    const isKeywordSensitive = sensitiveFields.some(field => 
      key.toLowerCase().includes(field.toLowerCase()));
    
    // 處理敏感字段
    if (isKeywordSensitive) {
      result[key] = '[已隱藏]';
      continue;
    }
    
    // 處理大型字符串（如base64圖片）
    if (typeof value === 'string' && value.length > 200) {
      result[key] = `${value.substring(0, 100)}... [截斷，共 ${value.length} 字符]`;
      continue;
    }
    
    // 處理嵌套對象
    if (value && typeof value === 'object') {
      result[key] = formatObject(value);
      continue;
    }
    
    // 其他值直接保留
    result[key] = value;
  }
  
  return result;
}

/**
 * 日誌記錄器類
 */
export class Logger {
  private config: LoggerConfig;
  private context: string;
  
  /**
   * 創建日誌記錄器實例
   * @param context 日誌上下文名稱
   * @param config 日誌配置
   */
  constructor(context: string = 'App', config: Partial<LoggerConfig> = {}) {
    this.context = context;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * 設置日誌級別
   * @param level 日誌級別
   */
  setMinLevel(level: LogLevel): void {
    this.config.minLevel = level;
  }
  
  /**
   * 格式化日誌消息
   * @param level 日誌級別
   * @param message 日誌消息
   * @param requestId 請求ID
   * @param details 詳細信息
   * @returns 格式化後的日誌對象
   */
  private formatLogMessage(
    level: LogLevel,
    message: string,
    requestId?: string,
    details?: any
  ): { formatted: string, data: any } {
    const { emoji } = LOG_STYLES[level];
    const levelName = LOG_LEVEL_NAMES[level];
    
    // 組裝日誌前綴
    let prefix = `${emoji} [${this.context}] [${levelName}]`;
    
    // 添加請求ID
    if (this.config.includeRequestId && requestId) {
      prefix += ` [${requestId}]`;
    }
    
    // 添加時間戳
    if (this.config.includeTimestamp) {
      const timestamp = new Date().toISOString();
      prefix += ` [${timestamp}]`;
    }
    
    // 處理詳細信息
    const processedDetails = details ? formatObject(details) : undefined;
    
    return {
      formatted: `${prefix} ${message}`,
      data: processedDetails
    };
  }
  
  /**
   * 記錄日誌
   * @param level 日誌級別
   * @param message 日誌消息
   * @param requestId 請求ID
   * @param details 詳細信息
   */
  /**
   * 記錄日誌
   * @param level 日誌級別
   * @param message 日誌消息
   * @param detailsOrRequestId 詳細信息或請求ID
   * @param extraDetails 額外的詳細信息，只在 detailsOrRequestId 為請求ID 時使用
   */
  private log(level: LogLevel, message: string, detailsOrRequestId?: any, extraDetails?: any): void {
    // 檢查日誌級別
    if (level < this.config.minLevel) {
      return;
    }
    
    let requestId: string | undefined;
    let details: any;
    
    // 判斷參數類型
    if (typeof detailsOrRequestId === 'string') {
      requestId = detailsOrRequestId;
      details = extraDetails;
    } else {
      requestId = undefined;
      details = detailsOrRequestId;
    }
    
    const { formatted, data } = this.formatLogMessage(level, message, requestId, details);
    
    // 根據日誌級別選擇輸出方法
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formatted, data);
        break;
      case LogLevel.INFO:
        console.log(formatted, data);
        break;
      case LogLevel.WARN:
        console.warn(formatted, data);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formatted, data);
        break;
    }
  }
  
  /**
   * 記錄調試級別日誌
   * @param message 日誌消息
   * @param detailsOrRequestId 詳細信息或請求ID
   * @param extraDetails 額外的詳細信息，只在 detailsOrRequestId 為請求ID 時使用
   */
  debug(message: string, detailsOrRequestId?: any, extraDetails?: any): void {
    this.log(LogLevel.DEBUG, message, detailsOrRequestId, extraDetails);
  }
  
  /**
   * 記錄信息級別日誌
   * @param message 日誌消息
   * @param detailsOrRequestId 詳細信息或請求ID
   * @param extraDetails 額外的詳細信息，只在 detailsOrRequestId 為請求ID 時使用
   */
  info(message: string, detailsOrRequestId?: any, extraDetails?: any): void {
    this.log(LogLevel.INFO, message, detailsOrRequestId, extraDetails);
  }
  
  /**
   * 記錄警告級別日誌
   * @param message 日誌消息
   * @param detailsOrRequestId 詳細信息或請求ID
   * @param extraDetails 額外的詳細信息，只在 detailsOrRequestId 為請求ID 時使用
   */
  warn(message: string, detailsOrRequestId?: any, extraDetails?: any): void {
    this.log(LogLevel.WARN, message, detailsOrRequestId, extraDetails);
  }
  
  /**
   * 記錄錯誤級別日誌
   * @param message 日誌消息
   * @param detailsOrRequestId 詳細信息或請求ID
   * @param extraDetails 額外的詳細信息，只在 detailsOrRequestId 為請求ID 時使用
   */
  error(message: string, detailsOrRequestId?: any, extraDetails?: any): void {
    this.log(LogLevel.ERROR, message, detailsOrRequestId, extraDetails);
  }
  
  /**
   * 記錄致命錯誤級別日誌
   * @param message 日誌消息
   * @param detailsOrRequestId 詳細信息或請求ID
   * @param extraDetails 額外的詳細信息，只在 detailsOrRequestId 為請求ID 時使用
   */
  fatal(message: string, detailsOrRequestId?: any, extraDetails?: any): void {
    this.log(LogLevel.FATAL, message, detailsOrRequestId, extraDetails);
  }
  
  /**
   * 記錄錯誤對象
   * @param error 錯誤對象
   * @param requestId 請求ID
   * @param message 可選的附加消息
   */
  logError(error: Error | unknown, requestId?: string, message?: string): void {
    const errorMessage = message || 'Unexpected error occurred';
    
    if (error instanceof Error) {
      this.error(
        `${errorMessage}: ${error.message}`,
        requestId,
        {
          name: error.name,
          stack: error.stack,
          ...(error as any)
        }
      );
    } else {
      this.error(
        errorMessage,
        requestId,
        { error }
      );
    }
  }
  
  /**
   * 創建一個子日誌記錄器
   * @param subContext 子上下文名稱
   * @param config 覆蓋配置
   */
  createSubLogger(subContext: string, config: Partial<LoggerConfig> = {}): Logger {
    const contextName = `${this.context}:${subContext}`;
    return new Logger(contextName, { ...this.config, ...config });
  }
  
  /**
   * 創建一個請求專屬的日誌記錄器
   * @param requestId 請求ID
   */
  forRequest(requestId: string): RequestLogger {
    return new RequestLogger(this, requestId);
  }
}

/**
 * 請求專屬的日誌記錄器
 * 自動添加請求ID到所有日誌
 */
export class RequestLogger {
  private logger: Logger;
  private requestId: string;
  
  constructor(logger: Logger, requestId: string) {
    this.logger = logger;
    this.requestId = requestId;
  }
  
  debug(message: string, details?: any): void {
    this.logger.debug(message, this.requestId, details);
  }
  
  info(message: string, details?: any): void {
    this.logger.info(message, this.requestId, details);
  }
  
  warn(message: string, details?: any): void {
    this.logger.warn(message, this.requestId, details);
  }
  
  error(message: string, details?: any): void {
    this.logger.error(message, this.requestId, details);
  }
  
  fatal(message: string, details?: any): void {
    this.logger.fatal(message, this.requestId, details);
  }
  
  logError(error: Error | unknown, message?: string): void {
    this.logger.logError(error, this.requestId, message);
  }
  
  /**
   * 記錄請求開始
   * @param request 請求對象
   */
  logRequestStart(request: Request): void {
    this.info('請求開始', {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('User-Agent'),
      origin: request.headers.get('Origin'),
      referer: request.headers.get('Referer'),
      contentType: request.headers.get('Content-Type')
    });
  }
  
  /**
   * 記錄請求結束
   * @param response 響應對象
   * @param processingTime 處理時間(毫秒)
   */
  logRequestEnd(response: Response, processingTime: number): void {
    this.info(`請求完成: ${response.status}, 耗時 ${processingTime}ms`, {
      status: response.status,
      statusText: response.statusText,
      processingTime
    });
  }
}

// 創建全局日誌記錄器實例
export const logger = new Logger('EchoMind');

// 為各個模塊創建專用日誌記錄器
export const apiLogger = logger.createSubLogger('API');
export const chatLogger = logger.createSubLogger('Chat');
export const faqLogger = logger.createSubLogger('FAQ');
export const vectorLogger = logger.createSubLogger('Vector');
export const uploadLogger = logger.createSubLogger('Upload');
export const envLogger = logger.createSubLogger('Env');
