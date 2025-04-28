'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { chatHistoryService } from '@/lib/services/chatHistory';
import { ChatHistory } from '@/lib/types/chat';
import { authService } from '@/lib/utils/auth';
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { toast } from 'sonner';
import Link from 'next/link';
import { Calendar, Clock, MessageSquare, Trash2, Edit, Loader2, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 聊天歷史頁面
 * 顯示用戶的聊天歷史記錄，允許用戶查看、刪除歷史對話
 */
export default function ChatHistoryPage() {
  // 狀態管理
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]); // 儲存所有聊天歷史
  const [isLoading, setIsLoading] = useState(true); // 載入狀態
  const router = useRouter(); // Next.js 路由
  const { user } = useAuth(); // 從認證上下文獲取當前用戶

  /**
   * 當用戶狀態變更時載入聊天歷史
   * 此 useEffect 會在用戶登入狀態改變時觸發
   * 負責從資料庫獲取用戶的所有聊天記錄
   */
  useEffect(() => {
    const loadChatHistories = async () => {
      // 如果用戶未登入，停止載入並設置載入狀態為完成
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // 設置服務的用戶 ID 並獲取所有聊天記錄
        authService.setUserId(user.uid);
        const histories = await chatHistoryService.getAllChats();
        setChatHistories(histories);
      } catch (error) {
        // 錯誤處理
        console.error('載入聊天歷史失敗:', error);
        toast.error('無法載入聊天歷史');
      } finally {
        // 無論成功或失敗都設置載入狀態為完成
        setIsLoading(false);
      }
    };

    loadChatHistories();
  }, [user]); // 依賴於用戶狀態

  /**
   * 處理刪除聊天記錄
   * 當用戶點擊刪除按鈕時觸發此函數
   * 會顯示確認對話框，並在確認後從資料庫中刪除聊天記錄
   * 
   * @param chatId - 要刪除的聊天 ID
   * @param e - 點擊事件，用於阻止事件冒泡
   */
  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    // 防止事件冒泡和默認行為，避免觸發 Link 的導航
    e.preventDefault();
    e.stopPropagation();
    
    // 檢查用戶是否登入
    if (!user) return;
    
    // 確認刪除操作
    if (confirm('確定要刪除這個聊天記錄嗎？此操作無法復原。')) {
      try {
        // 嘗試刪除聊天記錄
        const success = await chatHistoryService.deleteChat(chatId);
        if (success) {
          // 從本地狀態中移除已刪除的聊天，更新 UI
          setChatHistories(chatHistories.filter(chat => chat.id !== chatId));
          toast.success('聊天記錄已刪除');
        }
      } catch (error) {
        // 錯誤處理
        console.error('刪除聊天記錄失敗:', error);
        toast.error('無法刪除聊天記錄');
      }
    }
  };

  // 如果用戶未登入，顯示登入提示
  // 使用 motion 元件提供動畫效果
  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}  // 初始狀態：透明度為0，向下偏移20px
        animate={{ opacity: 1, y: 0 }}   // 動畫結束狀態：完全顯示，回到原位
        transition={{ duration: 0.5 }}   // 動畫持續時間：0.5秒
        className="flex h-[70vh] items-center justify-center"
      >
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <motion.div
            initial={{ scale: 0.9 }}     // 初始狀態：縮小到90%
            animate={{ scale: 1 }}       // 動畫結束狀態：恢復到原始大小
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">請先登入</h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">您需要登入以查看聊天歷史記錄。</p>
            <motion.button 
              onClick={() => router.push('/login')}  // 點擊時導航到登入頁面
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all"
              whileHover={{ scale: 1.05 }}  // 懸停時放大效果
              whileTap={{ scale: 0.95 }}    // 點擊時縮小效果
            >
              前往登入
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // 用戶已登入時的主要內容
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* 頁面標題和新對話按鈕 */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}  // 初始狀態：向上偏移並透明
          animate={{ y: 0, opacity: 1 }}    // 動畫結束狀態：回到原位並完全顯示
          transition={{ duration: 0.3 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">聊天歷史記錄</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/chat?new=true')}  // 點擊時導航到新聊天頁面
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>新對話</span>
          </motion.button>
        </motion.div>

        {/* 根據載入狀態和聊天記錄數量顯示不同內容 */}
        {/* AnimatePresence 允許元素在移除時也有動畫效果 */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            // 載入中顯示旋轉動畫
            <motion.div 
              key="loading"  // 為 AnimatePresence 提供唯一 key
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}  // 元素移除時的動畫
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <Loader2 className="h-16 w-16 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 animate-pulse">正在載入您的聊天記錄...</p>
            </motion.div>
          ) : chatHistories.length === 0 ? (
            // 沒有聊天記錄時顯示空狀態
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <motion.div 
                className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                animate={{ 
                  boxShadow: ["0px 0px 0px rgba(59, 130, 246, 0.5)", "0px 0px 20px rgba(59, 130, 246, 0.3)", "0px 0px 0px rgba(59, 130, 246, 0.5)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}  // 無限重複的脈動效果
              >
                <MessageSquare className="h-12 w-12 text-blue-500 dark:text-blue-400" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">沒有聊天記錄</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                您還沒有儲存任何聊天記錄，立即開始您的第一個 AI 對話吧！
              </p>
              <motion.button 
                onClick={() => router.push('/chat?new=true')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:shadow-lg flex items-center mx-auto gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageSquare className="h-4 w-4" />
                <span>開始第一個對話</span>
              </motion.button>
            </motion.div>
          ) : (
            // 顯示聊天記錄列表
            <motion.div 
              key="chats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <AnimatePresence>
                {/* 使用 map 遍歷所有聊天記錄並渲染 */}
                {chatHistories.map((chat, index) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}  // 依序顯示，每項延遲 0.05 秒
                  >
                    <Link
                      href={`/chat?id=${chat.id}`}  // 點擊時導航到對應的聊天頁面
                      className="block"
                    >
                      <motion.div 
                        className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-all shadow-sm hover:shadow-md"
                        whileHover={{ 
                          y: -3,  // 懸停時向上移動
                          scale: 1.01,  // 輕微放大
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"  // 增強陰影
                        }}
                        whileTap={{ scale: 0.98 }}  // 點擊時縮小
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            {/* 聊天標題 */}
                            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                              <span className="inline-block h-2 w-2 rounded-full bg-blue-500 animate-pulse mr-1"></span>
                              {chat.title}
                            </h3>
                            {/* 聊天元數據：日期、最後更新時間、訊息數量 */}
                            <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
                              {/* 創建日期標籤 */}
                              <motion.div 
                                className="flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full"
                                whileHover={{ scale: 1.05 }}
                              >
                                <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                                <span className="text-blue-700 dark:text-blue-300 font-medium">
                                  {new Date(chat.createdAt).toLocaleDateString('zh-TW')}
                                </span>
                              </motion.div>
                              {/* 最後更新時間標籤 */}
                              <motion.div 
                                className="flex items-center px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-full"
                                whileHover={{ scale: 1.05 }}
                              >
                                <Clock className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                                <span className="text-green-700 dark:text-green-300 font-medium">
                                  {formatDistanceToNow(new Date(chat.lastUpdated), {
                                    addSuffix: true,  // 添加「前」字
                                    locale: zhTW  // 使用繁體中文本地化
                                  })}
                                </span>
                              </motion.div>
                              {/* 訊息數量標籤 */}
                              <motion.div 
                                className="flex items-center px-2 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full"
                                whileHover={{ scale: 1.05 }}
                              >
                                <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                                <span className="text-purple-700 dark:text-purple-300 font-medium">
                                  {chat.messageCount || (chat.messages && chat.messages.length) || 0} 則訊息
                                </span>
                              </motion.div>
                            </div>
                          </div>
                          {/* 操作按鈕區域 */}
                          <div className="flex space-x-2">
                            {/* 刪除按鈕 */}
                            <motion.button
                              onClick={(e) => handleDeleteChat(chat.id, e)}  // 點擊時調用刪除函數
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                              whileHover={{ 
                                scale: 1.1, 
                                backgroundColor: 'rgba(254, 202, 202, 0.2)',
                                boxShadow: "0 0 10px rgba(254, 202, 202, 0.3)"
                              }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="h-5 w-5" />
                              <span className="sr-only">刪除</span>  {/* 螢幕閱讀器專用文字 */}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 