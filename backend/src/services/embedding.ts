import { Env } from '../index';
import { vectorLogger } from '../utils/logger';
import { ExternalApiError } from '../utils/errorHandler';
import { withRetry, serviceDegradation } from '../utils/retry';

/**
 * 生成文本的向量嵌入
 * 使用 Cohere 的嵌入 API
 * @param text 需要嵌入的文本
 * @param env 環境變數
 * @returns 向量嵌入
 */
export async function generateEmbedding(text: string, env?: Env): Promise<number[]> {
  // 從 env 對象獲取 API 金鑰
  const cohereApiKey = env?.COHERE_API_KEY;
  
  // 檢查 API 金鑰是否存在
  if (!cohereApiKey) {
    // 如果沒有 API 金鑰，記錄警告並返回隨機生成的模擬嵌入向量
    vectorLogger.warn('未設定 Cohere API 金鑰，將使用模擬嵌入');
    // 生成 1024 維的隨機向量，值在 -0.05 到 0.05 之間
    return generateFallbackEmbedding(1024);
  }
  
  // 將基本的嵌入部分抽取為一個函數，方便重試
  const fetchEmbedding = async (): Promise<number[]> => {
    // 記錄正在處理的文本（顯示前 50 個字符，超過則顯示省略號）
    vectorLogger.info('正在生成嵌入向量', {
      textPreview: `${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
      textLength: text.length
    });
    
    // 調用 Cohere API 生成嵌入向量
    const response = await fetch('https://api.cohere.ai/v1/embed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // 設置內容類型為 JSON
        'Authorization': `Bearer ${cohereApiKey}`, // 設置 API 認證
        'Accept': 'application/json' // 指定接受 JSON 格式的回應
      },
      body: JSON.stringify({
        texts: [text], // 要嵌入的文本數組
        model: 'embed-multilingual-v3.0', // 使用多語言嵌入模型
        truncate: 'END', // 如果文本過長，從末尾截斷
        input_type: 'search_document', // 指定輸入類型為搜索文檔
        embedding_types: ["float"] // 指定嵌入類型為浮點數
      })
    });
    
    // 檢查 API 回應是否成功
    if (!response.ok) {
      // 如果回應不成功，解析錯誤信息並拋出異常
      const errorData = await response.json();
      vectorLogger.error('Cohere API 返回錯誤', errorData);
      
      // 使用 ExternalApiError 拋出較詳細的錯誤訊息
      const statusCode = response.status;
      const errorMessage = errorData.message || `HTTP 錯誤 ${statusCode}`;
      
      // 判斷是否應該重試
      // 5xx 是服務器錯誤，429 是請求超出限制，這兩種情況可以重試
      const retryable = statusCode >= 500 || statusCode === 429;
      
      throw new ExternalApiError(
        errorMessage,
        'Cohere',
        statusCode,
        retryable,
        errorData
      );
    }
    
    // 解析 API 回應
    const data = await response.json();
    // 記錄回應中包含的字段，用於調試
    vectorLogger.debug('Cohere API 響應成功', {
      availableFields: Object.keys(data)
    });
    
    // 報告服務成功
    serviceDegradation.reportSuccess('Cohere');
    
    // 處理不同版本 API 的回應格式
    let embedding;
    if (data.embeddings && Array.isArray(data.embeddings)) {
      // 處理舊版 API 格式（直接數組）
      vectorLogger.debug('使用舊版 API 格式 (embeddings[])', {
        vectorDimension: data.embeddings[0].length
      });
      embedding = data.embeddings[0];
    } else if (data.embeddings && data.embeddings.float) {
      // 處理新版 API V2 格式（嵌套在 float 屬性中）
      vectorLogger.debug('使用新版 API V2 格式 (embeddings.float)', {
        vectorDimension: data.embeddings.float[0].length
      });
      embedding = data.embeddings.float[0];
    } else {
      // 如果無法識別回應格式，拋出錯誤
      vectorLogger.error('無法從回應中獲取嵌入向量', data);
      throw new ExternalApiError('無法解析 Cohere API 回應中的嵌入向量', 'Cohere', 500, false);
    }
    
    // 返回生成的嵌入向量
    return embedding;
  };
  
  try {
    // 使用重試機制調用嵌入重試函數
    return await withRetry(fetchEmbedding, {
      maxRetries: 3,
      initialDelay: 500,
      maxDelay: 5000,
      logPrefix: 'Cohere'
    });
  } catch (error) {
    // 報告服務失敗
    serviceDegradation.reportFailure('Cohere', error instanceof Error ? error : new Error(String(error)));
    
    // 捕獲並記錄任何錯誤
    vectorLogger.error('生成嵌入失敗，啟動降級操作', error);
    
    // 發生錯誤時返回一個模擬嵌入（1024 維隨機向量）
    vectorLogger.warn('返回模擬嵌入作為降級方案');
    return generateFallbackEmbedding(1024);
  }
}

/**
 * 生成模擬嵌入向量（降級方案）
 * @param dimension 向量維度
 * @returns 模擬嵌入向量
 */
function generateFallbackEmbedding(dimension: number = 1024): number[] {
  return Array(dimension).fill(0).map(() => (Math.random() - 0.5) * 0.1);
}