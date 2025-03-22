import { NextRequest, NextResponse } from 'next/server';
import type { FaqSearchResult } from '@/lib/types/chat';

// 模擬的 FAQ 資料
const MOCK_FAQ_DATA: FaqSearchResult[] = [
  {
    id: 'faq-1',
    question: '如何重置我的密碼？',
    answer: '點擊登入頁面的「忘記密碼」連結，然後按照指示進行操作。您將收到一封包含重置密碼連結的電子郵件。',
    score: 0.95,
    category: '帳戶',
    tags: ['密碼', '登入', '帳戶安全']
  },
  {
    id: 'faq-2',
    question: '如何更新我的個人資料？',
    answer: '登入後，點擊右上角的頭像，選擇「個人資料」，然後點擊「編輯資料」按鈕進行修改。',
    score: 0.92,
    category: '帳戶',
    tags: ['個人資料', '設定']
  },
  {
    id: 'faq-3',
    question: '應用程式支援哪些語言？',
    answer: '目前我們支援繁體中文和英文兩種語言。您可以在設定中切換語言。',
    score: 0.88,
    category: '功能',
    tags: ['語言', '設定', '本地化']
  },
  {
    id: 'faq-4',
    question: '如何刪除我的帳戶？',
    answer: '登入後，前往「設定」>「帳戶」>「刪除帳戶」。請注意，帳戶刪除後所有資料將無法恢復。',
    score: 0.85,
    category: '帳戶',
    tags: ['刪除帳戶', '隱私']
  },
  {
    id: 'faq-5',
    question: '客戶服務的聯繫方式？',
    answer: '您可以發送電子郵件至 support@example.com 或在工作時間（週一至週五 9:00-18:00）撥打 02-1234-5678。',
    score: 0.82,
    category: '支援',
    tags: ['客服', '聯繫']
  },
  {
    id: 'faq-6',
    question: '如何變更訂閱計劃？',
    answer: '登入後，前往「設定」>「訂閱」，然後選擇「變更計劃」。根據您的當前訂閱狀態，可能會有不同的升級或降級選項。',
    score: 0.79,
    category: '訂閱',
    tags: ['付款', '計劃', '訂閱']
  },
  {
    id: 'faq-7',
    question: '應用程式如何處理我的個人資料？',
    answer: '我們非常重視您的隱私。所有個人資料都按照我們的隱私政策進行處理，您可以在「設定」>「隱私」中查閱詳細內容。',
    score: 0.76,
    category: '隱私',
    tags: ['資料', '隱私', 'GDPR']
  }
];

export async function POST(request: NextRequest) {
  try {
    const { query, limit = 5 } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { 
          success: false,
          error: { 
            message: '查詢內容不能為空'
          }
        },
        { status: 400 }
      );
    }
    
    console.log('處理 FAQ 查詢:', { query, limit });
    
    // 模擬搜尋延遲
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 簡單模擬相關性搜尋
    // 實際應用中，這裡會使用向量搜尋或其他更高級的檢索方法
    const results = MOCK_FAQ_DATA
      .map(faq => {
        // 相關性計分簡單實現：檢查查詢詞是否出現在問題中
        const normalizedQuery = query.toLowerCase();
        const normalizedQuestion = faq.question.toLowerCase();
        
        // 計算簡單的匹配分數
        let matchScore = 0;
        
        // 完全匹配加分
        if (normalizedQuestion.includes(normalizedQuery)) {
          matchScore += 0.5;
        }
        
        // 關鍵詞匹配加分
        const queryWords = normalizedQuery.split(/\s+/);
        for (const word of queryWords) {
          if (word.length > 2 && normalizedQuestion.includes(word)) {
            matchScore += 0.2;
          }
        }
        
        // 融合原始分數和匹配分數
        const combinedScore = faq.score * 0.7 + matchScore * 0.3;
        
        return {
          ...faq,
          score: combinedScore
        };
      })
      .sort((a, b) => b.score - a.score) // 按分數降序排列
      .slice(0, limit); // 限制結果數量
    
    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('FAQ API 錯誤:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          message: error instanceof Error ? error.message : '處理 FAQ 請求時發生錯誤'
        }
      },
      { status: 500 }
    );
  }
} 