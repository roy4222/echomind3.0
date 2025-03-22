/**
 * CORS 標頭
 * 允許所有來源訪問API
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

/**
 * 處理 CORS 預檢請求
 * @returns Response 對象，用於響應 OPTIONS 請求
 */
export function handleCors(): Response {
  return new Response(null, {
    status: 204, // No content
    headers: corsHeaders
  });
}

/**
 * 添加 CORS 標頭到已有的標頭對象
 * @param headers 現有的標頭對象
 * @returns 添加了 CORS 標頭的新標頭對象
 */
export function withCorsHeaders(headers: HeadersInit = {}): Headers {
  const newHeaders = new Headers(headers);
  
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  return newHeaders;
} 