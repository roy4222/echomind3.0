'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { RiThumbUpLine, RiSendPlaneFill, RiChat3Line } from 'react-icons/ri';

interface Message {
  id: string;
  content: string;
  createdAt: number;
  likes: number;
}

export default function AnonymousBoard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 模擬從後端加載留言
  useEffect(() => {
    const demoMessages: Message[] = [
      {
        id: '1',
        content: '今天的課程真的很有趣！',
        createdAt: Date.now() - 1000 * 60 * 60 * 2,
        likes: 5
      },
      {
        id: '2',
        content: '有人知道下週考試的範圍嗎？',
        createdAt: Date.now() - 1000 * 60 * 30,
        likes: 2
      },
      {
        id: '3',
        content: '圖書館的咖啡廳真的很棒，推薦給大家！',
        createdAt: Date.now() - 1000 * 60 * 10,
        likes: 8
      }
    ];
    
    setMessages(demoMessages);
  }, []);

  // 提交新留言
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      toast.error('留言內容不能為空');
      return;
    }
    
    setIsLoading(true);
    
    // 模擬API請求
    setTimeout(() => {
      const newMessageObj: Message = {
        id: Date.now().toString(),
        content: newMessage,
        createdAt: Date.now(),
        likes: 0
      };
      
      setMessages(prev => [newMessageObj, ...prev]);
      setNewMessage('');
      setIsLoading(false);
      toast.success('留言發佈成功！');
    }, 500);
  };

  // 點讚功能
  const handleLike = (id: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
      )
    );
    toast('感謝您的讚賞！', {
      icon: '👍',
      position: 'bottom-right',
      duration: 2000,
    });
  };

  // 格式化時間
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-TW', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            匿名留言板
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-300 mt-3">自由分享您的想法和意見</p>
        </div>
        
        {/* 留言表單 */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-10 border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <RiChat3Line className="text-blue-500 mr-2" size={20} />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">發表新留言</h2>
              </div>
              <textarea
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none transition"
                rows={4}
                placeholder="在此輸入您的匿名留言..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                maxLength={500}
              />
              <div className="text-right text-gray-500 text-sm mt-2">
                {newMessage.length}/500
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={isLoading || !newMessage.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? '發佈中...' : (
                <>
                  <RiSendPlaneFill size={18} />
                  發佈留言
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
        
        {/* 留言列表 */}
        <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-white flex items-center">
          <RiChat3Line className="text-blue-500 mr-2" size={20} />
          最新留言
        </h2>
        
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 text-gray-500 bg-white dark:bg-gray-800 rounded-xl shadow-md"
            >
              <div className="flex flex-col items-center">
                <RiChat3Line size={48} className="text-gray-300 mb-3" />
                <p>目前還沒有留言，成為第一個留言的人吧！</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-5">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
                >
                  <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap break-words text-lg">
                    {message.content}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                      {formatTime(message.createdAt)}
                    </span>
                    <motion.button 
                      onClick={() => handleLike(message.id)}
                      className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors px-3 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RiThumbUpLine size={18} />
                      <span className="font-medium">{message.likes}</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
