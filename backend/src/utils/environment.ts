/**
 * 環境變數驗證工具
 * 提供集中的環境變數驗證和訪問功能
 */

import { Env } from '../index';
import { ValidationError } from './errorHandler';

/**
 * 環境變數分組
 */
interface EnvGroups {
  // Pinecone 相關環境變數
  pinecone: {
    PINECONE_API_KEY: string;
    PINECONE_ENVIRONMENT: string;
    PINECONE_INDEX: string;
    PINECONE_API_URL?: string;
  };
  
  // Cohere 相關環境變數
  cohere: {
    COHERE_API_KEY: string;
  };
  
  // Groq 相關環境變數
  groq: {
    GROQ_API_KEY: string;
  };
  
  // R2 相關環境變數
  r2: {
    R2_API_ENDPOINT: string;
    R2_ACCESS_KEY_ID: string;
    R2_SECRET_ACCESS_KEY: string;
    R2_BUCKET: string;
    R2_ENDPOINT: string;
  };
  
  // Firebase 相關環境變數
  firebase: {
    FIREBASE_PROJECT_ID: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;
  };
  
  // Python API 相關環境變數
  pythonApi?: {
    PYTHON_API_URL: string;
  };
}

/**
 * 驗證環境變數
 * @param env 環境變數對象
 * @param requiredVars 必要的環境變數列表
 * @param groupName 環境變數組名稱
 * @throws ValidationError 如果缺少必要的環境變數
 */
function validateEnvVars(
  env: Env,
  requiredVars: string[],
  groupName: string
): void {
  const missingVars = requiredVars.filter(varName => !env[varName as keyof Env]);
  
  if (missingVars.length > 0) {
    throw new ValidationError(
      `缺少必要的${groupName}環境變數: ${missingVars.join(', ')}`,
      { missingVars, group: groupName }
    );
  }
}

/**
 * 環境變數管理器
 * 提供集中的環境變數驗證和訪問功能
 */
export class EnvironmentManager {
  private env: Env;
  private validated: Set<string> = new Set();
  
  constructor(env: Env) {
    this.env = env;
  }
  
  /**
   * 驗證所有環境變數
   * @throws ValidationError 如果缺少必要的環境變數
   */
  validateAll(): void {
    // 驗證 Pinecone 環境變數
    this.validatePinecone();
    
    // 驗證 Cohere 環境變數
    this.validateCohere();
    
    // 驗證 Groq 環境變數
    this.validateGroq();
    
    // 驗證 R2 環境變數
    this.validateR2();
    
    // 驗證 Firebase 環境變數
    this.validateFirebase();
    
    console.log('✅ 所有必要的環境變數已驗證通過');
  }
  
  /**
   * 驗證 Pinecone 環境變數
   * @returns Pinecone 環境變數對象
   * @throws ValidationError 如果缺少必要的環境變數
   */
  validatePinecone(): EnvGroups['pinecone'] {
    if (!this.validated.has('pinecone')) {
      validateEnvVars(
        this.env,
        ['PINECONE_API_KEY', 'PINECONE_ENVIRONMENT'],
        'Pinecone'
      );
      
      // 檢查 PINECONE_INDEX 和 PINECONE_INDEX_NAME (兩者至少需要一個)
      if (!this.env.PINECONE_INDEX && !this.env.PINECONE_INDEX_NAME) {
        throw new ValidationError(
          '缺少必要的 Pinecone 環境變數: PINECONE_INDEX 或 PINECONE_INDEX_NAME',
          { missingVars: ['PINECONE_INDEX/PINECONE_INDEX_NAME'], group: 'Pinecone' }
        );
      }
      
      this.validated.add('pinecone');
    }
    
    return {
      PINECONE_API_KEY: this.env.PINECONE_API_KEY,
      PINECONE_ENVIRONMENT: this.env.PINECONE_ENVIRONMENT,
      PINECONE_INDEX: this.env.PINECONE_INDEX || this.env.PINECONE_INDEX_NAME || '',
      PINECONE_API_URL: this.env.PINECONE_API_URL
    };
  }
  
  /**
   * 驗證 Cohere 環境變數
   * @returns Cohere 環境變數對象
   */
  validateCohere(): EnvGroups['cohere'] {
    if (!this.validated.has('cohere')) {
      // 如果沒有 Cohere API 金鑰，記錄警告但不拋出錯誤
      if (!this.env.COHERE_API_KEY) {
        console.warn('⚠️ 缺少 Cohere API 金鑰，將使用模擬嵌入向量');
      }
      this.validated.add('cohere');
    }
    
    return {
      COHERE_API_KEY: this.env.COHERE_API_KEY || ''
    };
  }
  
  /**
   * 驗證 Groq 環境變數
   * @returns Groq 環境變數對象
   * @throws ValidationError 如果缺少必要的環境變數
   */
  validateGroq(): EnvGroups['groq'] {
    if (!this.validated.has('groq')) {
      validateEnvVars(this.env, ['GROQ_API_KEY'], 'Groq');
      this.validated.add('groq');
    }
    
    return {
      GROQ_API_KEY: this.env.GROQ_API_KEY
    };
  }
  
  /**
   * 驗證 R2 環境變數
   * @returns R2 環境變數對象
   * @throws ValidationError 如果缺少必要的環境變數
   */
  validateR2(): EnvGroups['r2'] {
    if (!this.validated.has('r2')) {
      validateEnvVars(
        this.env,
        [
          'R2_API_ENDPOINT',
          'R2_ACCESS_KEY_ID',
          'R2_SECRET_ACCESS_KEY',
          'R2_BUCKET',
          'R2_ENDPOINT'
        ],
        'R2'
      );
      this.validated.add('r2');
    }
    
    return {
      R2_API_ENDPOINT: this.env.R2_API_ENDPOINT,
      R2_ACCESS_KEY_ID: this.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: this.env.R2_SECRET_ACCESS_KEY,
      R2_BUCKET: this.env.R2_BUCKET,
      R2_ENDPOINT: this.env.R2_ENDPOINT
    };
  }
  
  /**
   * 驗證 Firebase 環境變數
   * @returns Firebase 環境變數對象
   * @throws ValidationError 如果缺少必要的環境變數
   */
  validateFirebase(): EnvGroups['firebase'] {
    if (!this.validated.has('firebase')) {
      validateEnvVars(
        this.env,
        [
          'FIREBASE_PROJECT_ID',
          'FIREBASE_CLIENT_EMAIL',
          'FIREBASE_PRIVATE_KEY'
        ],
        'Firebase'
      );
      this.validated.add('firebase');
    }
    
    return {
      FIREBASE_PROJECT_ID: this.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: this.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: this.env.FIREBASE_PRIVATE_KEY
    };
  }
  
  /**
   * 驗證 Python API 環境變數
   * @returns Python API 環境變數對象
   */
  validatePythonApi(): EnvGroups['pythonApi'] | undefined {
    if (this.env.PYTHON_API_URL) {
      return {
        PYTHON_API_URL: this.env.PYTHON_API_URL
      };
    }
    
    return undefined;
  }
  
  /**
   * 獲取環境變數值
   * @param key 環境變數鍵名
   * @returns 環境變數值
   */
  get<K extends keyof Env>(key: K): Env[K] {
    return this.env[key];
  }
}

// 導出環境變數管理器實例創建函數
export function createEnvironmentManager(env: Env): EnvironmentManager {
  return new EnvironmentManager(env);
}
