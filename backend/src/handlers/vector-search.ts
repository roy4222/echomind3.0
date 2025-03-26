import { Env } from '../index';
import { getCorsHeadersForRequest } from '../utils/cors';
import { PineconeClient } from '../services/pinecone';

/**
 * 處理向量搜索請求
 * @param request 請求對象
 * @param env 環境變數
 * @returns 回應對象
 */
export async function handleVectorSearch(request: Request, env: Env): Promise<Response> {
  // 添加 CORS 標頭
  const headers = { ...getCorsHeadersForRequest(request), 'Content-Type': 'application/json' };
  const requestId = crypto.randomUUID();
  
  console.log(`🔍 [${requestId}] 開始處理向量搜索請求`);
  
  try {
    // 驗證請求方法
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: { message: '方法不允許' } 
      }), { 
        status: 405, 
        headers 
      });
    }
    
    // 解析請求數據
    const requestData = await request.json() as {
      query: string;
      topK?: number;
      category?: string;
      minImportance?: number;
    };
    
    const { query, topK = 3, category, minImportance } = requestData;
    
    console.log(`🔍 [${requestId}] 搜索參數:`, {
      query,
      topK,
      category,
      minImportance
    });
    
    // 檢查必要參數
    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: { message: '請提供有效的查詢' } 
      }), { 
        status: 400, 
        headers 
      });
    }
    
    // 檢查是否有提供必要的環境變數
    if (!env.PINECONE_API_KEY) {
      console.error(`🔴 [${requestId}] 錯誤: 缺少 PINECONE_API_KEY 環境變數`);
      return new Response(JSON.stringify({
        success: false,
        error: {
          message: '伺服器配置錯誤: 缺少 API 金鑰'
        }
      }), { 
        status: 500, 
        headers 
      });
    }
    
    // 記錄 Pinecone 環境配置
    console.log(`🔍 [${requestId}] Pinecone 環境配置:`, {
      API_KEY: env.PINECONE_API_KEY ? '已設置' : '未設置',
      ENVIRONMENT: env.PINECONE_ENVIRONMENT,
      INDEX: env.PINECONE_INDEX,
      INDEX_NAME: env.PINECONE_INDEX_NAME,
      API_URL: env.PINECONE_API_URL
    });
    
    // 創建 Pinecone 客戶端
    const pinecone = new PineconeClient(
      env.PINECONE_API_KEY,
      env.PINECONE_ENVIRONMENT,
      env.PINECONE_INDEX || env.PINECONE_INDEX_NAME || '',
      env,
      env.PINECONE_API_URL
    );
    
    // 調用 Pinecone 進行向量搜索
    console.log(`🔍 [${requestId}] 執行向量搜索`);
    const results = await pinecone.searchFaqs(query, topK, 0.3);
    
    // 根據類別和重要性過濾結果
    let filteredResults = results;
    
    if (category) {
      filteredResults = filteredResults.filter(item => 
        item.category && item.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (minImportance !== undefined && typeof minImportance === 'number') {
      console.log(`🔍 [${requestId}] 篩選重要性閾值: ${minImportance}`);
      // 檢查在篩選前是否有結果
      console.log(`🔍 [${requestId}] 篩選前結果數量: ${filteredResults.length}`);
      
      const beforeFilterCount = filteredResults.length;
      filteredResults = filteredResults.filter(item => {
        const importance = (item as any).importance;
        // 如果未定義重要性，默認為 1.0 (允許通過)
        const effectiveImportance = importance !== undefined ? importance : 1.0;
        return effectiveImportance >= minImportance;
      });
      
      console.log(`🔍 [${requestId}] 重要性篩選後結果數量: ${filteredResults.length}, 移除了: ${beforeFilterCount - filteredResults.length} 個結果`);
    }
    
    console.log(`🔍 [${requestId}] 搜索結果:`, {
      total: results.length,
      filtered: filteredResults.length
    });
    
    // 記錄詳細的結果內容
    if (filteredResults.length > 0) {
      console.log(`🔍 [${requestId}] 返回結果詳情:`);
      filteredResults.forEach((result, index) => {
        console.log(`🔍 [${requestId}] 結果 #${index + 1}:`, {
          id: result.id,
          question: result.question.substring(0, 50) + (result.question.length > 50 ? '...' : ''),
          score: result.score,
          importance: (result as any).importance,
          category: result.category
        });
      });
    } else {
      console.log(`🔍 [${requestId}] 沒有匹配的結果可返回`);
    }
    
    // 返回成功回應
    return new Response(JSON.stringify({
      success: true,
      results: filteredResults
    }), { 
      status: 200, 
      headers 
    });
    
  } catch (error) {
    console.error(`🔴 [${requestId}] 向量搜索處理錯誤:`, error);
    
    // 返回錯誤回應
    return new Response(JSON.stringify({
      success: false,
      error: {
        message: error instanceof Error ? error.message : '處理向量搜索請求時發生錯誤'
      }
    }), { 
      status: 500, 
      headers 
    });
  }
} 