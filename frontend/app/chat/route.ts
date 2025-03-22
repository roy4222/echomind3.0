import { handleChatCompletion } from './controller';
import { NextResponse } from 'next/server';

/**
 * POST 處理函數
 * 處理來自 /api/chat 的 POST 請求
 */
export async function POST(request: Request) {
  try {
    return await handleChatCompletion(request);
  } catch (error) {
    console.error("API 處理錯誤:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          message: "處理請求時發生錯誤", 
          code: "SERVER_ERROR" 
        } 
      },
      { status: 500 }
    );
  }
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