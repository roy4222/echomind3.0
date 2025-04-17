/**
 * 模型配置管理
 * 提供不同模型的配置參數和顯示名稱
 */

/**
 * 模型配置介面
 */
export interface ModelConfig {
  /** 模型名稱 (API 使用的名稱) */
  name: string;
  /** 模型顯示名稱 (用於 UI 顯示) */
  displayName: string;
  /** 溫度參數 (控制回答的隨機性) */
  temperature: number;
  /** 最大生成 token 數 */
  maxTokens: number;
  /** 是否支援圖片輸入 */
  supportsImages?: boolean;
  /** 模型描述 */
  description?: string;
}

/**
 * 模型類型映射
 */
export interface ModelMapping {
  [key: string]: ModelConfig;
}

/**
 * 預設模型類型
 * 與前端 DEFAULT_MODEL_ID = 'maverick' 保持一致
 */
export const DEFAULT_MODEL_TYPE = 'maverick';

/**
 * 預設配置參數
 */
export const DEFAULT_MODEL = 'meta-llama/llama-4-maverick-17b-128e-instruct';  // 預設使用的語言模型
export const DEFAULT_TEMPERATURE = 0.7;  // 預設的溫度參數
export const DEFAULT_MAX_TOKENS = 2048;  // 預設的最大 token 數

/**
 * 模型參數映射表
 * 提供不同模型的配置參數和顯示名稱
 * 與前端 MODEL_OPTIONS 保持一致
 */
export const MODEL_MAPPING: ModelMapping = {
  default: {
    name: 'llama-3.1-8b-instant',
    displayName: 'Llama 3.1 8B Instant',
    temperature: 0.7,
    maxTokens: 2048,
    description: '快速且高效的模型，適合一般對話使用'
  },
  advanced: {
    name: 'deepseek-r1-distill-llama-70b',
    displayName: 'Deepseek R1 Distill Llama 70B',
    temperature: 0.5,
    maxTokens: 4096,
    description: '知識豐富，適合複雜問題與深度理解任務'
  },
  creative: {
    name: 'qwen-qwq-32b',
    displayName: 'Qwen QWQ 32B',
    temperature: 0.9,
    maxTokens: 3072,
    description: '平衡效能與資源，優秀的跨語言能力'
  },
  maverick: {
    name: 'meta-llama/llama-4-maverick-17b-128e-instruct',
    displayName: 'Llama 4 Maverick 17B',
    temperature: 0.7,
    maxTokens: 4096,
    supportsImages: true,
    description: '最新且強大多模態模型，支援圖像與文字輸入'
  }
};

/**
 * 獲取模型配置
 * @param modelType 模型類型 (default, advanced, creative, maverick)
 * @returns 模型配置
 */
export function getModelConfig(modelType: string): ModelConfig {
  return MODEL_MAPPING[modelType] || MODEL_MAPPING.default;
}

/**
 * 檢查模型是否支援圖片
 * @param modelName 模型名稱
 * @returns 是否支援圖片
 */
export function modelSupportsImages(modelName: string): boolean {
  // 檢查所有模型配置
  for (const key in MODEL_MAPPING) {
    const config = MODEL_MAPPING[key];
    if (config.name === modelName) {
      return !!config.supportsImages;
    }
  }
  return false;
}
