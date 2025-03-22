'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Moon, Sun, Volume2, VolumeX, Bell, BellOff, Globe } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  // 設定狀態
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    sound: true,
    language: '繁體中文',
  });
  
  // 重定向未登入用戶
  if (!loading && !user) {
    router.push('/login');
    return null;
  }
  
  // 處理設定變更
  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings({
        ...settings,
        [key]: !settings[key],
      });
    }
  };
  
  // 處理語言變更
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({
      ...settings,
      language: e.target.value,
    });
  };
  
  // 載入中狀態
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="h-32 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回
        </button>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          設定
        </h1>
        
        <div className="space-y-6">
          {/* 外觀設定 */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
              外觀
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {settings.darkMode ? 
                    <Moon className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" /> : 
                    <Sun className="mr-3 h-5 w-5 text-yellow-500" />
                  }
                  <span className="text-gray-700 dark:text-gray-300">
                    深色模式
                  </span>
                </div>
                <button
                  onClick={() => handleToggle('darkMode')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.darkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span className="sr-only">切換深色模式</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          
          {/* 語言設定 */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
              語言
            </h2>
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <select
                value={settings.language}
                onChange={handleLanguageChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="繁體中文">繁體中文</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>
          
          {/* 通知設定 */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
              通知
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {settings.notifications ? 
                    <Bell className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" /> : 
                    <BellOff className="mr-3 h-5 w-5 text-gray-500" />
                  }
                  <span className="text-gray-700 dark:text-gray-300">
                    推送通知
                  </span>
                </div>
                <button
                  onClick={() => handleToggle('notifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.notifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span className="sr-only">切換通知</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {settings.sound ? 
                    <Volume2 className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" /> : 
                    <VolumeX className="mr-3 h-5 w-5 text-gray-500" />
                  }
                  <span className="text-gray-700 dark:text-gray-300">
                    音效
                  </span>
                </div>
                <button
                  onClick={() => handleToggle('sound')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.sound ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span className="sr-only">切換音效</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.sound ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          
          {/* 建設中提示 */}
          <div className="mt-8 rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
            <p className="text-center text-gray-500 dark:text-gray-400">
              更多設定選項開發中...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 