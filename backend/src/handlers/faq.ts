import { Env } from '../index';
import { corsHeaders, getCorsHeadersForRequest } from '../utils/cors';
import { PineconeClient } from '../services/pinecone';
import type { FaqSearchResult } from './../types/chat';
import { createSuccessResponse, createErrorResponse, handleError, ValidationError } from '../utils/errorHandler';
import { faqLogger } from '../utils/logger';

/**
 * 處理 FAQ 查詢請求
 * @param request 請求對象
 * @param env 環境變數
 * @returns 回應對象
 */
export async function handleFaq(request: Request, env: Env): Promise<Response> {
  const requestId = crypto.randomUUID();
  const logger = faqLogger.forRequest(requestId);
  
  logger.info('開始處理 FAQ 查詢請求');
  
  try {
    // 驗證請求方法
    if (request.method !== 'POST') {
      return createErrorResponse('方法不允許', 405, request);
    }
    
    // 解析請求數據
    const requestData = await request.json() as {
      query: string;
      limit?: number;
      threshold?: number;
      category?: string;
      minImportance?: number;
      topK?: number; // 兼容 vector-search 端點
    };
    
    // 處理參數，支援兩種端點的參數命名
    const { 
      query, 
      limit = 5, 
      threshold = 0.1,
      category,
      minImportance,
      topK
    } = requestData;
    
    // 使用 topK 或 limit（兼容兩種端點）
    const resultLimit = topK || limit;
    
    logger.info('搜索參數', {
      query,
      limit: resultLimit,
      threshold,
      category: category || '未指定',
      minImportance: minImportance !== undefined ? minImportance : '未指定'
    });
    
    // 檢查必要參數
    if (!query || typeof query !== 'string') {
      throw new ValidationError('請提供有效的查詢');
    }
    
    // 創建 Pinecone 客戶端
    const pinecone = new PineconeClient(
      env.PINECONE_API_KEY,
      env.PINECONE_ENVIRONMENT,
      env.PINECONE_INDEX || env.PINECONE_INDEX_NAME || '',
      env,
      env.PINECONE_API_URL
    );
    
    // 調用 Pinecone 進行 FAQ 檢索
    const results = await pinecone.searchFaqs(query, resultLimit, threshold);
    
    // 根據類別和重要性過濾結果
    let filteredResults = results;
    
    // 按類別過濾（如果指定）
    if (category) {
      console.log(`❓ [${requestId}] 按類別過濾: ${category}`);
      filteredResults = filteredResults.filter(item => 
        item.category && item.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // 按重要性過濾（如果指定）
    if (minImportance !== undefined && typeof minImportance === 'number') {
      console.log(`❓ [${requestId}] 按重要性過濾，閾值: ${minImportance}`);
      const beforeFilterCount = filteredResults.length;
      
      filteredResults = filteredResults.filter(item => {
        const importance = (item as any).importance;
        // 如果未定義重要性，默認為 1.0 (允許通過)
        const effectiveImportance = importance !== undefined ? importance : 1.0;
        return effectiveImportance >= minImportance;
      });
      
      console.log(`❓ [${requestId}] 重要性過濾後結果數量: ${filteredResults.length}, 移除了: ${beforeFilterCount - filteredResults.length} 個結果`);
    }
    
    console.log(`❓ [${requestId}] 搜索結果:`, {
      total: results.length,
      filtered: filteredResults.length
    });
    
    // 記錄詳細的結果內容
    if (filteredResults.length > 0) {
      console.log(`❓ [${requestId}] 返回結果詳情:`);
      filteredResults.forEach((result, index) => {
        console.log(`❓ [${requestId}] 結果 #${index + 1}:`, {
          id: result.id,
          question: result.question.substring(0, 50) + (result.question.length > 50 ? '...' : ''),
          score: result.score,
          importance: (result as any).importance,
          category: result.category
        });
      });
    } else {
      console.log(`❓ [${requestId}] 沒有匹配的結果可返回`);
    }
    
    // 返回成功回應
    return createSuccessResponse({ 
      success: true,
      results: filteredResults 
    }, 200, request);
    
  } catch (error) {
    return handleError(error, request);
  }
}