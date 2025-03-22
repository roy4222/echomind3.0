import { NextRequest, NextResponse } from 'next/server';
import { handleChatCompletion } from './controller';

/**
 * POST 處理函數
 * 處理來自 /api/chat 的 POST 請求，連接到 Groq API
 */
export async function POST(request: NextRequest) {
  return handleChatCompletion(request);
}

/**
 * OPTIONS 處理函數
 * 處理跨域預檢請求
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 