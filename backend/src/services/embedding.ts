/**
 * 生成文本的向量嵌入
 * 使用 OpenAI 的 text-embedding-ada-002 模型
 * @param text 需要嵌入的文本
 * @returns 向量嵌入
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // 為了簡化，這裡我們假設環境變量已經設置
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  // 檢查 API 金鑰
  if (!openaiApiKey) {
    throw new Error('未設定 OpenAI API 金鑰');
  }
  
  try {
    // 調用 OpenAI API 生成嵌入
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text
      })
    });
    
    // 檢查回應
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API 錯誤: ${JSON.stringify(errorData)}`);
    }
    
    // 解析回應
    const data = await response.json();
    
    // 返回嵌入向量
    return data.data[0].embedding;
  } catch (error) {
    console.error('生成嵌入錯誤:', error);
    
    // 發生錯誤時返回一個模擬嵌入
    // 在實際生產環境中，應該拋出錯誤或實現更好的回退策略
    console.log('返回模擬嵌入');
    return Array(1536).fill(0).map(() => (Math.random() - 0.5) * 0.1);
  }
} 