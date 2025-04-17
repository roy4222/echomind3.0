'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Home } from 'lucide-react';

// 遊戲列表數據
const games = [
  {
    id: 'muyu',
    name: '電子木魚',
    description: '修身養性，積德行善',
    imageUrl: '/muyu.png',
    path: '/game/muyu',
    comingSoon: false,
  },
  {
    id: 'puzzle',
    name: '記憶拼圖',
    description: '訓練記憶力與專注力',
    imageUrl: '/images/puzzle.png',
    path: '/game/puzzle',
    comingSoon: true,
  },
  {
    id: 'quiz',
    name: '輔大知識王',
    description: '測試你對輔大的了解',
    imageUrl: '/images/quiz.png',
    path: '/game/quiz',
    comingSoon: true,
  },
];

export default function GamePage() {
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8 pb-16">
      <div className="container mx-auto px-4">
        
        
        <h1 className="text-4xl font-bold text-center mb-4 text-indigo-700 dark:text-indigo-300">
          EchoMind 遊戲中心
        </h1>
        <p className="text-lg text-center mb-12 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          在學習之餘，享受一些休閒時光。透過遊戲放鬆心情，提升專注力。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <motion.div
              key={game.id}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
              whileHover={{ y: -5 }}
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                {game.imageUrl && (
                  <div className="w-full h-full flex items-center justify-center">
                    {/* 遊戲圖片替代方案 */}
                    <div className="w-24 h-24 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                      {game.name.charAt(0)}
                    </div>
                  </div>
                )}
                
                {game.comingSoon && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    即將推出
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {game.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {game.description}
                </p>
                
                {!game.comingSoon ? (
                  <Link href={game.path} className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium">
                    開始遊戲
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center text-gray-500 dark:text-gray-400 font-medium cursor-not-allowed">
                    敬請期待
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
