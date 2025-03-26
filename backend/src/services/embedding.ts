import { Env } from '../index';

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
  
  // 檢查 API 金鑰
  if (!cohereApiKey) {
    console.warn('未設定 Cohere API 金鑰，將使用模擬嵌入');
    return Array(1024).fill(0).map(() => (Math.random() - 0.5) * 0.1);
  }
  
  try {
    console.log(`正在生成嵌入向量: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    
    // 調用 Cohere API 生成嵌入
    const response = await fetch('https://api.cohere.ai/v1/embed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cohereApiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        texts: [text],
        model: 'embed-multilingual-v3.0',
        truncate: 'END',
        input_type: 'search_document',
        embedding_types: ["float"]
      })
    });
    
    // 檢查回應
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cohere API 返回錯誤:', errorData);
      throw new Error(`Cohere API 錯誤: ${JSON.stringify(errorData)}`);
    }
    
    // 解析回應
    const data = await response.json();
    console.log(`Cohere API 響應成功，包含的字段:`, Object.keys(data));
    
    // 處理不同版本 API 的回應格式
    let embedding;
    if (data.embeddings && Array.isArray(data.embeddings)) {
      // 舊版 API 格式
      console.log(`使用舊版 API 格式 (embeddings[])，向量維度: ${data.embeddings[0].length}`);
      embedding = data.embeddings[0];
    } else if (data.embeddings && data.embeddings.float) {
      // 新版 API V2 格式
      console.log(`使用新版 API V2 格式 (embeddings.float)，向量維度: ${data.embeddings.float[0].length}`);
      embedding = data.embeddings.float[0];
    } else {
      console.error('無法從回應中獲取嵌入向量:', data);
      throw new Error('無法解析 Cohere API 回應中的嵌入向量');
    }
    
    return embedding;
  } catch (error) {
    console.error('生成嵌入錯誤:', error);
    
    // 發生錯誤時返回一個模擬嵌入
    console.log('返回模擬嵌入');
    return Array(1024).fill(0).map(() => (Math.random() - 0.5) * 0.1);
  }
} 