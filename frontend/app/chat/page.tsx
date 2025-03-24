'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * 聊天頁面重定向
 * 將所有對 /chat 的請求重定向到首頁，同時保留所有 URL 參數
 */
export default function ChatRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // 將所有參數帶到首頁
    const params = new URLSearchParams(searchParams);
    router.replace(`/?${params.toString()}`);
  }, [router, searchParams]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500 dark:text-gray-400">重新導向中...</p>
    </div>
  );
} 