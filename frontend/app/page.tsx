'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChatInterface } from '@/components/chat/ChatInterface';

/**
 * 網站首頁 - 聊天介面
 */
export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 取得 URL 參數
  const chatId = searchParams.get('id');
  const isNewChat = searchParams.get('new') === 'true';
  
  // 處理URL參數的效果，例如清除 new=true 參數
  const handleResetUrl = () => {
    if (isNewChat) {
      // 移除 URL 中的 new 參數，但不刷新頁面
      router.replace('/', { scroll: false });
    }
  };
  
  return (
    <div className="w-full h-full">
      <ChatInterface 
        chatId={chatId} 
        isNewChat={isNewChat}
        onResetUrl={handleResetUrl}
      />
    </div>
  );
}