// 測試 Pinecone 連接的簡單腳本
require('dotenv').config();
require('isomorphic-fetch');

async function testPineconeConnection() {
  console.log('開始測試 Pinecone 連接...');
  
  // 從環境變數獲取 API 密鑰和 URL
  const apiKey = process.env.PINECONE_API_KEY;
  const environment = process.env.PINECONE_ENVIRONMENT;
  const indexName = process.env.PINECONE_INDEX || process.env.PINECONE_INDEX_NAME;
  
  // 輸出環境變數，但隱藏密鑰的大部分內容
  console.log('環境變數:');
  console.log(`PINECONE_API_KEY: ${apiKey ? `${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}` : '未設置'}`);
  console.log(`PINECONE_ENVIRONMENT: ${environment || '未設置'}`);
  console.log(`PINECONE_INDEX/PINECONE_INDEX_NAME: ${indexName || '未設置'}`);
  
  if (!apiKey || !environment || !indexName) {
    console.error('錯誤: 請確保環境變數中設定了 PINECONE_API_KEY, PINECONE_ENVIRONMENT 和 PINECONE_INDEX (或 PINECONE_INDEX_NAME)');
    return;
  }
  
  try {
    // 構建 API URL
    const baseUrl = `https://${indexName}-${environment}.svc.${environment}.pinecone.io`;
    const url = `${baseUrl}/describe_index_stats`;
    
    console.log(`正在連接到 Pinecone 索引: ${indexName}`);
    console.log(`環境: ${environment}`);
    console.log(`URL: ${url}`);
    
    // 發送請求
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey
      }
    });
    
    // 檢查回應
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Pinecone API 錯誤: ${JSON.stringify(errorData)}`);
    }
    
    // 解析回應數據
    const data = await response.json();
    
    console.log('✅ 成功連接到 Pinecone!');
    console.log('索引統計資訊:');
    console.log(JSON.stringify(data, null, 2));
    
    // 如果索引為空，給出警告
    if (data.total_vector_count === 0) {
      console.warn('⚠️ 警告: 索引中沒有向量，請確保已上傳資料');
    } else {
      console.log(`📊 索引中共有 ${data.total_vector_count} 個向量`);
    }
    
  } catch (error) {
    console.error('❌ Pinecone 連接失敗:', error);
  }
}

// 執行測試
testPineconeConnection(); 