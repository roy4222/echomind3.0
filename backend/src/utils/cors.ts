/**
 * 允許的來源列表
 */
const ALLOWED_ORIGINS = [
  'https://echomind3-0.pages.dev',    // 原有 Cloudflare Pages 網址
  'https://a6447ec7.echomind4.pages.dev', // 之前部署的 Cloudflare Pages 網址
  'https://7afc54f9.echomind4.pages.dev',    // 之前部署的 Cloudflare Pages 網址
  'https://c5b90724.echomind4.pages.dev',    // 最新部署的 Cloudflare Pages 網址
  'http://localhost:3000',            // 本地開發環境
  'https://localhost:3000',
  'https://echomind3.roy422.ggff.net',
];

/**
 * 檢查請求來源是否被允許
 * @param origin 請求來源
 * @returns 是否為允許的來源
 */
function isOriginAllowed(origin: string | null): boolean {
  return !origin || ALLOWED_ORIGINS.includes(origin);
}

/**
 * 獲取適合特定請求的 CORS 標頭
 * @param request 請求對象
 * @returns CORS 標頭對象
 */
export function getCorsHeadersForRequest(request: Request): HeadersInit {
  const origin = request.headers.get('Origin');
  
  return {
    'Access-Control-Allow-Origin': isOriginAllowed(origin) ? (origin || '*') : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };
}

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
 * @param request Request 對象
 * @returns Response 對象，用於響應 OPTIONS 請求
 */
export function handleCors(request: Request): Response {
  return new Response(null, {
    status: 204, // No content
    headers: getCorsHeadersForRequest(request)
  });
}

/**
 * 添加 CORS 標頭到已有的標頭對象
 * @param headers 現有的標頭對象
 * @param request 請求對象（用於獲取 Origin）
 * @returns 添加了 CORS 標頭的新標頭對象
 */
export function withCorsHeaders(headers: HeadersInit = {}, request?: Request): Headers {
  const newHeaders = new Headers(headers);
  
  // 使用特定請求的 CORS 標頭或默認標頭
  const corsHeadersToUse = request 
    ? getCorsHeadersForRequest(request) 
    : corsHeaders;
  
  Object.entries(corsHeadersToUse).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  return newHeaders;
}