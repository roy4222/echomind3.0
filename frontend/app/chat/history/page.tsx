'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { chatHistoryService, ChatHistory } from '@/lib/services/chatHistory';
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { toast } from 'sonner';
import Link from 'next/link';
import { Calendar, Clock, MessageSquare, Trash2, Edit, Loader2 } from 'lucide-react';

/**
 * 聊天歷史頁面
 * 顯示用戶的聊天歷史記錄
 */
export default function ChatHistoryPage() {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const loadChatHistories = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        chatHistoryService.setUserId(user.uid);
        const histories = await chatHistoryService.getAllChats();
        setChatHistories(histories);
      } catch (error) {
        console.error('載入聊天歷史失敗:', error);
        toast.error('無法載入聊天歷史');
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistories();
  }, [user]);

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    if (confirm('確定要刪除這個聊天記錄嗎？此操作無法復原。')) {
      try {
        const success = await chatHistoryService.deleteChat(chatId);
        if (success) {
          setChatHistories(chatHistories.filter(chat => chat.id !== chatId));
          toast.success('聊天記錄已刪除');
        }
      } catch (error) {
        console.error('刪除聊天記錄失敗:', error);
        toast.error('無法刪除聊天記錄');
      }
    }
  };

  if (!user) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">請先登入</h1>
          <p className="mb-6">您需要登入以查看聊天歷史記錄。</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            前往登入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">聊天歷史記錄</h1>
          <button 
            onClick={() => router.push('/chat?new=true')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            開始新對話
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
          </div>
        ) : chatHistories.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">沒有聊天記錄</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              您還沒有儲存任何聊天記錄
            </p>
            <button 
              onClick={() => router.push('/chat?new=true')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              開始第一個對話
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {chatHistories.map((chat) => (
              <Link
                href={`/chat?id=${chat.id}`}
                key={chat.id}
                className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg mb-1">{chat.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {new Date(chat.createdAt).toLocaleDateString('zh-TW')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {formatDistanceToNow(new Date(chat.lastUpdated), {
                            addSuffix: true,
                            locale: zhTW
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{chat.messages.length} 則訊息</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">刪除</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 