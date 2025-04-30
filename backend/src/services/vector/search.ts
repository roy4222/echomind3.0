/**
 * 搜尋相關邏輯
 */
import { generateEmbedding } from '../embedding';
import { FaqSearchResult, VectorSearchConfig, DEFAULT_SEARCH_CONFIG, PineconeMatch } from '../../types/vector';
import { SimilarityService } from './similarity';
import { vectorLogger, LogLevel } from '../../utils/logger';
import { ExternalApiError } from '../../utils/errorHandler';
import { Env } from '../../index';

/**
 * Pinecone 搜尋服務
 * 提供向量搜尋相關功能
 */
export class PineconeSearch {
  /**
   * Pinecone API 金鑰
   */
  private apiKey: string;
  
  /**
   * Pinecone 環境名稱
   */
  private environment: string;
  
  /**
   * Pinecone 索引名稱
   */
  private indexName: string;
  
  /**
   * 環境變數配置
   */
  private env?: Env;
  
  /**
   * 完整 API URL (可選)
   */
  private fullApiUrl?: string;
  
  /**
   * 建立 Pinecone 搜尋服務
   * @param apiKey Pinecone API 金鑰
   * @param environment Pinecone 環境
   * @param indexName Pinecone 索引名稱
   * @param env 環境變數
   * @param fullApiUrl 完整的 Pinecone API URL (可選)
   */
  constructor(apiKey: string, environment: string, indexName: string, env?: Env, fullApiUrl?: string) {
    this.apiKey = apiKey;
    this.environment = environment;
    this.indexName = indexName;
    this.env = env;
    this.fullApiUrl = fullApiUrl;
  }
  
  /**
   * 處理查詢預處理，提取關鍵詞
   * @param query 原始查詢文本
   * @returns 處理後的查詢文本
   */
  preprocessQuery(query: string): string {
    // 簡單的停用詞列表 (可擴充)
    const stopwords = ['的', '了', '和', '與', '在', '是', '我', '有', '這', '那', '怎麼', '如何', '請問', '可以', '嗎'];
    
    // 移除標點符號
    let processedQuery = query.replace(/[.,。，、！？!?;；:：()（）{}「」""]/g, ' ');
    
    // 分詞並移除停用詞 (簡易版)
    let words = processedQuery.split(/\s+/).filter(word => word.length > 0);
    words = words.filter(word => !stopwords.includes(word));
    
    // 如果過濾後的詞太少，回退到原始查詢
    if (words.length < 2) {
      vectorLogger.debug('預處理後關鍵詞太少，使用原始查詢', { 
        originalQuery: query, 
        processedWords: words 
      });
      return query;
    }
    
    // 重組查詢
    const processedQueryText = words.join(' ');
    
    vectorLogger.debug('查詢預處理完成', { 
      originalQuery: query, 
      processedQuery: processedQueryText,
      keywordsExtracted: words
    });
    
    return processedQueryText;
  }
  
  /**
   * 整合相似的 FAQ 結果
   * @param results 原始 FAQ 搜尋結果
   * @returns 整合後的結果
   */
  integrateSimilarFaqs(results: FaqSearchResult[]): FaqSearchResult[] {
    if (results.length <= 1) {
      return results;
    }
    
    // 評估整合的閾值 - 問題相似度至少要達到這個相似度才考慮整合
    const INTEGRATION_THRESHOLD = 0.65;
    const MAX_RESULTS_TO_INTEGRATE = 5; // 限制整合的最大數量
    
    // 存儲已經被整合的結果 ID
    const integratedIds = new Set<string>();
    
    // 存儲整合後的結果
    const integratedResults: FaqSearchResult[] = [];
    
    // 先根據分數排序，確保我們先處理更相關的結果
    const sortedResults = [...results].sort((a: FaqSearchResult, b: FaqSearchResult) => b.score - a.score);
    
    for (let i = 0; i < sortedResults.length; i++) {
      const currentFaq = sortedResults[i];
      
      // 如果當前 FAQs 已經被整合到其他結果中，則跳過
      if (integratedIds.has(currentFaq.id)) {
        continue;
      }
      
      // 初始化新的整合結果
      const integratedFaq: FaqSearchResult = {
        ...currentFaq,
        integrated: false,
        integratedFrom: []
      };
      
      let integratedCount = 0;
      
      // 尋找可以整合的其他相似 FAQ
      for (let j = i + 1; j < sortedResults.length; j++) {
        // 限制整合數量
        if (integratedCount >= MAX_RESULTS_TO_INTEGRATE) {
          break;
        }
        
        const otherFaq = sortedResults[j];
        
        // 如果已經被整合，則跳過
        if (integratedIds.has(otherFaq.id)) {
          continue;
        }
        
        // 計算問題相似度 - 簡單的詞彙重疊分析
        const similarity = SimilarityService.calculateQuestionSimilarity(currentFaq.question, otherFaq.question);
        
        // 也可以根據分類和標籤判斷相關性
        let categoryMatch = false;
        if (currentFaq.category && otherFaq.category && 
            currentFaq.category === otherFaq.category) {
          categoryMatch = true;
        }
        
        // 如果相似度超過閾值或分類相匹配，進行整合
        if (similarity > INTEGRATION_THRESHOLD || categoryMatch) {
          // 結合答案，移除重復內容
          const integratedAnswer = SimilarityService.combineAnswers(integratedFaq.answer, otherFaq.answer);
          
          // 更新整合結果
          integratedFaq.answer = integratedAnswer;
          integratedFaq.integrated = true;
          
          // 記錄整合來源
          if (!integratedFaq.integratedFrom) {
            integratedFaq.integratedFrom = [];
          }
          integratedFaq.integratedFrom.push(otherFaq.id);
          
          // 記錄已整合的 ID
          integratedIds.add(otherFaq.id);
          integratedCount++;
          
          vectorLogger.debug('整合相似 FAQs', {
            primaryId: currentFaq.id,
            integratedId: otherFaq.id,
            similarity: similarity,
            categoryMatch: categoryMatch
          });
        }
      }
      
      // 將整合的結果添加到結果列表
      integratedResults.push(integratedFaq);
    }
    
    vectorLogger.info('FAQ 整合完成', {
      originalResults: results.length,
      integratedResults: integratedResults.length,
      reductionRate: (results.length - integratedResults.length) / results.length
    });
    
    return integratedResults;
  }
  
  /**
   * 執行向量搜尋
   * @param query 查詢文本
   * @param embedding 查詢向量嵌入
   * @param config 搜尋配置
   * @returns 搜尋結果
   */
  async executeVectorSearch(query: string, embedding: number[], config: VectorSearchConfig): Promise<FaqSearchResult[]> {
    // Pinecone 索引 URL - 直接使用完整URL或組合
    let url: string;
    if (this.fullApiUrl) {
      // 使用完整的 API URL
      url = `${this.fullApiUrl.replace(/\/$/, '')}/query`;
      vectorLogger.debug(`使用完整 Pinecone API URL: ${url}`);
    } else {
      // 創建 Pinecone API URL - 處理不同環境的 URL 格式
      let baseUrl: string;
      if (this.environment === 'gcp-starter') {
        // GCP-Starter 環境使用不同的 URL 格式
        baseUrl = `https://${this.indexName}.svc.${this.environment}.pinecone.io`;
      } else {
        // 標準環境格式
        baseUrl = `https://${this.indexName}-${this.environment}.svc.${this.environment}.pinecone.io`;
      }
      url = `${baseUrl}/query`;
      
      vectorLogger.debug(`使用組合的 Pinecone API URL: ${url}`, {
        indexName: this.indexName,
        environment: this.environment
      });
    }
    
    vectorLogger.info('開始查詢 Pinecone', {
      query: query.substring(0, 50) + (query.length > 50 ? '...' : ''),
      limit: config.limit,
      threshold: config.threshold
    });
    
    // 準備向量搜尋參數
    const searchParams = {
      vector: embedding,
      topK: Math.min(config.limit * 2, 20), // 獲取更多候選項，以便進行後處理篩選
      includeMetadata: true,
      includeValues: false,
      namespace: '', // 確保在未指定命名空間時使用默認空間
      filter: {}, // 可以根據實際需求添加過濾條件
      sparseVector: undefined // 用於混合搜索，目前未使用
    };
    
    vectorLogger.debug('Pinecone 搜索參數配置', {
      topK: searchParams.topK,
      originalLimit: config.limit,
      dynamicThreshold: config.threshold
    });
    
    // 發送請求到 Pinecone
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': this.apiKey
      },
      body: JSON.stringify(searchParams)
    });
    
    // 檢查回應狀態
    if (!response.ok) {
      let errorDetails: any;
      const statusCode = response.status;
      let errorMessage = `Pinecone API 錯誤: HTTP ${statusCode}`;

      try {
        // 嘗試解析錯誤回應為 JSON
        const responseBody = await response.json();
        errorDetails = responseBody;
        vectorLogger.error('收到 Pinecone 錯誤回應詳情', responseBody);
        errorMessage += ` - ${responseBody.message || '未知錯誤'}`;
      } catch (jsonError) {
        vectorLogger.error('Pinecone 回應解析錯誤', jsonError);
        const textResponse = await response.text();
        errorDetails = { rawResponse: textResponse };
        errorMessage += ` - ${textResponse}`;
      }
      
      // 判斷是否應該重試
      // 5xx 是服務器錯誤，429 是請求超出限制，這兩種情況可以重試
      const retryable = statusCode >= 500 || statusCode === 429;
      
      throw new ExternalApiError(
        errorMessage,
        'Pinecone',
        statusCode,
        retryable,
        errorDetails
      );
    }
    
    // 解析回應數據
    const data = await response.json();
    vectorLogger.info('收到 Pinecone 回應', {
      matchesCount: data.matches?.length || 0,
      namespace: data.namespace
    });
    
    // 處理結果
    const results: FaqSearchResult[] = [];
    
    if (data.matches && data.matches.length > 0) {
      // 計算動態閾值
      const dynamicThreshold = SimilarityService.calculateDynamicThreshold(query, config.threshold);
      
      // 首先收集所有符合動態閾值的匹配項
      const validMatches = data.matches.filter((match: PineconeMatch) => match.score >= dynamicThreshold);
      
      // 記錄篩選結果
      vectorLogger.debug('動態閾值篩選結果', {
        totalMatches: data.matches.length,
        matchesAboveThreshold: validMatches.length,
        dynamicThreshold,
        originalThreshold: config.threshold
      });
      
      // 對結果進行後處理和增強
      for (const match of validMatches as PineconeMatch[]) {
        // 獲取問題和分類信息
        const questionLower = (match.metadata.question || '').toLowerCase();
        const category = match.metadata.category || 'general';
        const tags = match.metadata.tags || [];
        const importance = match.metadata.importance || 1.0;
        
        // 1. 改進的文本相似度計算
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);
        
        // 計算精確詞彙匹配率
        let wordMatchCount = 0;
        for (const word of queryWords) {
          if (questionLower.includes(word)) {
            wordMatchCount++;
          }
        }
        
        const wordMatchRatio = queryWords.length > 0 ? wordMatchCount / queryWords.length : 0;
        
        // 2. 加權因子計算
        // 精確文本匹配加權: 0.35 (調整後)
        // 語義相似度加權: 0.55 (調整後)
        // 重要性加權: 0.1 
        const textMatchWeight = 0.35;
        const semanticWeight = 0.55;
        const importanceWeight = 0.1;
        
        // 計算各組成部分的分數
        let textMatchScore = 0;
        
        // 檢查是否有完全匹配
        if (questionLower === queryLower) {
          textMatchScore = 1.0; // 完全匹配給予最高分
        } 
        // 檢查是否包含完整查詢
        else if (questionLower.includes(queryLower)) {
          textMatchScore = 0.8; // 包含整個查詢字串給予高分
        }
        // 檢查詞彙匹配率
        else {
          textMatchScore = wordMatchRatio * 0.6; // 基於詞彙匹配率給分
        }
        
        // 使用原始向量相似度作為語義相似度
        const semanticScore = match.score;
        
        // 計算標籤相關性分數
        let tagBoost = 1.0;
        // 檢查查詢與標籤的相關性
        for (const tag of tags) {
          if (queryLower.includes(tag.toLowerCase())) {
            tagBoost += 0.1; // 每個匹配的標籤增加 0.1 的提升
          }
        }
        
        // 3. 最終加權相似度計算
        const weightedScore = (
          textMatchScore * textMatchWeight +
          semanticScore * semanticWeight +
          (importance * importanceWeight)
        ) * tagBoost;
        
        // 4. 相關性分數校準 (使用 sigmoid 函數)
        const scaledScore = SimilarityService.calibrateScore(weightedScore);
        
        // 創建結果對象
        const result: FaqSearchResult = {
          id: match.id,
          question: match.metadata.question || '',
          answer: match.metadata.answer || '',
          category: category,
          tags: tags,
          importance: importance,
          metadata: match.metadata,
          score: scaledScore,
          originalScore: match.score, // 保存原始分數用於調試
          textMatchScore: textMatchScore, // 保存文本匹配分數
          semanticScore: semanticScore, // 保存語義相似度分數
          tagBoost: tagBoost // 保存標籤提升因子
        };
        results.push(result);
      }
      
      // 5. 進行內容整合，合併相似問題的答案
      const mergedResults = this.integrateSimilarFaqs(results);
      
      // 根據最終分數重新排序結果
      mergedResults.sort((a, b) => b.score - a.score);
      
      // 截取到用戶要求的限制數量
      if (mergedResults.length > config.limit) {
        mergedResults.splice(config.limit);
      }
      
      // 將整合後的結果賦值回 results
      results.length = 0;
      results.push(...mergedResults);
    }
    
    return results;
  }
}
