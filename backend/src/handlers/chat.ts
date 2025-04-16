import { Env } from '../index';
import { corsHeaders, getCorsHeadersForRequest } from '../utils/cors';
import { verifyAuth } from '../middlewares/auth';
import type { ChatMessage, ChatCompletionOptions, GroqChatResponse } from './../types/chat';
import { createSuccessResponse, createErrorResponse, handleError, ExternalApiError } from '../utils/errorHandler';
import { createEnvironmentManager } from '../utils/environment';
import { MODEL_MAPPING, getModelConfig, modelSupportsImages } from '../config/models';
import { GroqService } from '../services/groq';
import { chatLogger } from '../utils/logger';

/**
 * 系統提示詞設定
 * 定義 AI 助手的角色和行為準則
 */
const SYSTEM_PROMPT: ChatMessage = {
  role: 'system',
  content: `你是輔仁大學資訊管理學系的 AI 助手，名叫 EchoMind。
  - 使用繁體中文回答
  - 回答要簡潔但專業
  - 對學生要友善有耐心
  - 不確定的事情要誠實說不知道
  - 需要時可以使用 Markdown 格式美化回答
  - 專注於資管相關的學術、課程、就業諮詢
  - 避免討論政治、宗教等敏感話題`
};

/**
 * 預設配置參數
 */
const DEFAULT_MODEL = getModelConfig('default').name;
const DEFAULT_TEMPERATURE = getModelConfig('default').temperature;
const DEFAULT_MAX_TOKENS = getModelConfig('default').maxTokens;

/**
 * 處理聊天請求
 * @param request 請求對象
 * @param env 環境變數
 * @returns 回應對象
 */
export async function handleChat(request: Request, env: Env): Promise<Response> {
  // 生成請求 ID 用於追蹤
  const requestId = crypto.randomUUID();
  const logger = chatLogger.forRequest(requestId);
  
  logger.info('收到聊天請求', {
    url: request.url,
    method: request.method,
    origin: request.headers.get('Origin'),
    envCheck: {
      hasGroqApiKey: !!env.GROQ_API_KEY,
      apiKeyLength: env.GROQ_API_KEY ? `${env.GROQ_API_KEY.substring(0, 3)}...` : 0,
    }
  });
  
  try {
    // 驗證請求方法
    if (request.method !== 'POST') {
      console.log(`❌ [${requestId}] 請求失敗: 方法不允許 -`, request.method);
      return createErrorResponse('方法不允許', 405, request, { 
        code: 'method_not_allowed',
        requestId 
      });
    }
    
    // 解析請求數據
    const data = await request.json() as ChatCompletionOptions;
    console.log(`📝 [${requestId}] 請求內容摘要:`, {
      messagesCount: data.messages?.length || 0,
      requestedModel: data.model || DEFAULT_MODEL,
      temperature: data.temperature || DEFAULT_TEMPERATURE,
      maxTokens: data.maxTokens || DEFAULT_MAX_TOKENS,
      firstUserMessage: data.messages?.[0]?.content?.substring(0, 50) + '...' || '無內容'
    });
    
    // 檢查必要參數
    if (!data.messages || !Array.isArray(data.messages) || data.messages.length === 0) {
      console.log(`❌ [${requestId}] 請求失敗: 缺少聊天訊息`);
      return createErrorResponse('缺少聊天訊息', 400, request, { 
        code: 'missing_messages',
        requestId 
      });
    }
    
    // 建立 Groq 服務
    const groqService = new GroqService(env);
    
    console.log(`🔄 [${requestId}] 開始啟用 RAG 增強聊天...`);
    
    // 調用增強型聊天處理 (RAG)
    try {
      // 搜尋相關資訊並增強回應
      const groqResponse = await groqService.enhancedChat(data);
      
      console.log(`✅ [${requestId}] Groq API 調用成功 (使用 RAG 增強)`);
      console.log(`回應摘要:`, {
        model: groqResponse.model,
        totalTokens: groqResponse.usage?.total_tokens || 0,
        responseTime: new Date().toISOString(),
        firstResponseWords: groqResponse.choices[0]?.message?.content?.substring(0, 50) + '...' || '無內容'
      });
      
      // 返回成功回應
      return createSuccessResponse(groqResponse, 200, request, requestId);
    } catch (error) {
      // 處理 Groq API 特定錯誤
      console.error(`❌ [${requestId}] Groq API 調用失敗:`, error);
      
      // 如果是外部 API 錯誤，返回更具體的錯誤訊息
      if (error instanceof ExternalApiError) {
        return createErrorResponse(
          `AI 服務暫時不可用: ${error.message}`, 
          503, 
          request, 
          { code: 'groq_api_error', requestId }
        );
      }
      
      // 返回一般錯誤
      return createErrorResponse(
        error instanceof Error ? error.message : '處理聊天請求時發生錯誤',
        500,
        request,
        { requestId }
      );
    }
    
  } catch (error) {
    // 處理一般錯誤
    return handleError(error, request, requestId);
  }
}