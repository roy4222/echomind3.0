'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">匿名留言板</h1>
      
      {/* 留言表單 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
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
          <button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '發佈中...' : '發佈留言'}
          </button>
        </form>
      </div>
      
      {/* 留言列表 */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            目前還沒有留言，成為第一個留言的人吧！
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <p className="text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-wrap break-words">
                {message.content}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{formatTime(message.createdAt)}</span>
                <button 
                  onClick={() => handleLike(message.id)}
                  className="flex items-center gap-1 hover:text-blue-500 transition"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="lucide lucide-thumbs-up"
                  >
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                  <span>{message.likes}</span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
