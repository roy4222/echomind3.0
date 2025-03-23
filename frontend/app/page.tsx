'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shouldResetChat, setShouldResetChat] = useState(false);
  
  // 當使用者從側邊欄點擊「開啟新對話」時，處理 URL 參數
  useEffect(() => {
    // 檢查 URL 參數是否包含 new=true
    const isNewChat = searchParams.get('new') === 'true';
    
    console.log('首頁 - URL參數:', Array.from(searchParams.entries()));
    console.log('首頁 - isNewChat:', isNewChat);
    
    if (isNewChat) {
      console.log('首頁 - 設置重置聊天標記為 true');
      setShouldResetChat(true);
      
      // 移除 URL 中的 new 參數，但不刷新頁面
      console.log('首頁 - 替換 URL，移除 new 參數');
      router.replace('/', { scroll: false });
    }
  }, [searchParams, router]);
  
  return (
    <div className="w-full h-full">
      <ChatInterface key={shouldResetChat ? 'new-chat' : 'existing-chat'} />
    </div>
  );
}