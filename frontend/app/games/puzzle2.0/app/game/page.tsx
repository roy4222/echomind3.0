'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { PuzzleGame } from '../components/PuzzleGame';
import Link from 'next/link';

export default function GamePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const theme = searchParams.get('theme') || '1';
  const difficulty = parseInt(searchParams.get('difficulty') || '4', 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-4 flex justify-between items-center bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-3">
          <Link 
            href="/"
            className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all transform hover:scale-105 shadow-md font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            返回主頁
          </Link>
          
          <div className="text-xl font-bold text-gray-800 hidden md:block">
            拼圖挑戰  
          </div>
          
          <div className="w-24 md:w-36">
            {/* 空白區域平衡兩側 */}
          </div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-6">
          <PuzzleGame theme={theme} difficulty={difficulty} />
        </div>
      </div>
    </div>
  );
} 