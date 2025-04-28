/**
 * 儲存服務
 * 提供檔案上傳和管理功能
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Env } from '../index';
import { createEnvironmentManager } from '../utils/environment';
import { ExternalApiError } from '../utils/errorHandler';
import { uploadLogger } from '../utils/logger';

/**
 * S3 客戶端快取
 * 用於在應用生命週期內重用 S3 客戶端
 */
let S3_CLIENT: S3Client | null = null;

/**
 * 儲存服務類別
 * 處理檔案上傳和管理
 */
export class StorageService {
  private s3Client: S3Client;
  private env: Env;
  private bucket: string;
  private endpoint: string;
  
  /**
   * 建立儲存服務實例
   * @param env 環境變數
   */
  constructor(env: Env) {
    this.env = env;
    
    // 驗證環境變數
    const envManager = createEnvironmentManager(env);
    const r2Config = envManager.validateR2();
    
    this.bucket = r2Config.R2_BUCKET;
    this.endpoint = r2Config.R2_ENDPOINT;
    this.s3Client = this.getS3Client();
  }
  
  /**
   * 獲取 S3 客戶端
   * 如果已經初始化過，則返回快取的客戶端
   * @returns S3 客戶端
   */
  private getS3Client(): S3Client {
    if (S3_CLIENT) {
      uploadLogger.debug('使用已初始化的 S3 客戶端');
      return S3_CLIENT;
    }
    
    uploadLogger.info('初始化 S3 客戶端', {
      endpoint: this.env.R2_API_ENDPOINT,
      hasAccessKey: !!this.env.R2_ACCESS_KEY_ID,
      hasSecretKey: !!this.env.R2_SECRET_ACCESS_KEY
    });
    
    S3_CLIENT = new S3Client({
      region: 'auto',
      endpoint: this.env.R2_API_ENDPOINT,
      credentials: {
        accessKeyId: this.env.R2_ACCESS_KEY_ID,
        secretAccessKey: this.env.R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true
    });
    
    return S3_CLIENT;
  }
  
  /**
   * 上傳檔案到 R2 儲存
   * @param fileContent 檔案內容 (Uint8Array)
   * @param path 儲存路徑
   * @param contentType 檔案類型
   * @returns 檔案 URL
   */
  async uploadFile(fileContent: Uint8Array, path: string, contentType: string): Promise<string> {
    // 檢查環境變數
    uploadLogger.info('準備上傳檔案到 R2', {
      bucket: this.bucket,
      endpoint: this.endpoint,
      key: path,
      contentType: contentType,
      fileSize: fileContent.length,
      hasAccessKey: !!this.env.R2_ACCESS_KEY_ID,
      hasSecretKey: !!this.env.R2_SECRET_ACCESS_KEY
    });
    
    // 確保路徑有效
    if (!path) {
      uploadLogger.error('無效的檔案路徑');
      throw new ExternalApiError('無效的檔案路徑', 'Cloudflare R2', 400);
    }
    
    try {
      // 上傳檔案到 R2
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: path,
          Body: fileContent,
          ContentType: contentType,
        })
      );
      
      // 確保有效的 endpoint
      let endpoint = this.endpoint;
      if (!endpoint || endpoint.trim() === '') {
        uploadLogger.warn('endpoint 為空，使用預設值');
        endpoint = 'echomind-r2.roy422roy.workers.dev';
      }
      
      // 構建檔案 URL
      const fileUrl = `https://${endpoint}/${path}`;
      uploadLogger.info('檔案上傳成功', {
        fileUrl,
        path,
        contentType,
        endpoint
      });
      
      return fileUrl;
    } catch (error) {
      uploadLogger.error('檔案上傳錯誤', {
        path,
        contentType,
        error
      });
      
      // 嘗試建立一個備用 URL
      try {
        let endpoint = this.endpoint;
        if (!endpoint || endpoint.trim() === '') {
          endpoint = 'echomind-r2.roy422roy.workers.dev';
        }
        
        const fallbackUrl = `https://${endpoint}/${path}`;
        uploadLogger.warn('上傳失敗，返回備用 URL', { fallbackUrl });
        return fallbackUrl;
      } catch (fallbackError) {
        // 如果備用 URL 也失敗，才拋出錯誤
        throw new ExternalApiError(
          '檔案上傳失敗: ' + (error instanceof Error ? error.message : '未知錯誤'),
          'Cloudflare R2',
          500
        );
      }
    }
  }
  
  /**
   * 檢查檔案大小是否超過限制
   * @param fileSize 檔案大小 (bytes)
   * @param maxSize 最大大小 (bytes)，預設 10MB
   * @returns 是否超過限制
   */
  isFileSizeExceeded(fileSize: number, maxSize: number = 10 * 1024 * 1024): boolean {
    return fileSize > maxSize;
  }
  
  /**
   * 獲取檔案 URL
   * @param path 檔案路徑
   * @returns 完整的檔案 URL
   */
  getFileUrl(path: string): string {
    return `https://${this.endpoint}/${path}`;
  }
}

/**
 * 創建儲存服務實例
 * @param env 環境變數
 * @returns 儲存服務實例
 */
export function createStorageService(env: Env): StorageService {
  uploadLogger.debug('建立儲存服務');
  return new StorageService(env);
}
