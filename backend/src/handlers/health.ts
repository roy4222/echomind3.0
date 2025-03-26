import { Env } from '../index';
import { getCorsHeadersForRequest } from '../utils/cors';

/**
 * 處理 API 健康檢查請求
 * @param request 請求對象
 * @param env 環境變數
 * @returns 回應對象
 */
export async function handleHealthCheck(request: Request, env: Env): Promise<Response> {
  // 添加 CORS 標頭
  const headers = getCorsHeadersForRequest(request);
  const requestId = crypto.randomUUID();
  
  console.log(`🔍 [${requestId}] 開始處理健康檢查請求`);
  
  try {
    const services = {
      api: true,
      python: false
    };
    
    let message = 'API 正常運行中';
    
    // 檢查 Python API 是否已配置
    if (env.PYTHON_API_URL) {
      try {
        console.log(`🔍 [${requestId}] 檢查 Python API 健康狀態`);
        const pythonHealthResponse = await fetch(`${env.PYTHON_API_URL}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (pythonHealthResponse.ok) {
          services.python = true;
          console.log(`✅ [${requestId}] Python API 健康檢查成功`);
        } else {
          message = `API 運行中，但 Python 服務不可用 (${pythonHealthResponse.status})`;
          console.warn(`⚠️ [${requestId}] Python API 健康檢查失敗: ${pythonHealthResponse.status}`);
        }
      } catch (error) {
        message = `API 運行中，但 Python 服務連接失敗`;
        console.error(`🔴 [${requestId}] Python API 連接錯誤:`, error);
      }
    } else {
      message = 'API 運行中，但未配置 Python API URL';
      console.warn(`⚠️ [${requestId}] 未配置 Python API URL`);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        status: 'ok',
        message,
        services,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error(`🔴 [${requestId}] 健康檢查處理錯誤:`, error);
    
    return new Response(
      JSON.stringify({
        success: false,
        status: 'error',
        message: error instanceof Error ? error.message : '處理健康檢查請求時發生錯誤',
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }
} 