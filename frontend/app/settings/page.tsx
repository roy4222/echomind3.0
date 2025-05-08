'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  ArrowLeft, Moon, Sun, Volume2, VolumeX, Bell, BellOff, Globe, 
  User, Shield, Lock, LogOut, Save, Camera, RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  
  // 個人資料狀態
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    avatar: '/default-avatar.png',
    bio: '',
  });
  
  // 設定狀態
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    sound: true,
    language: '繁體中文',
  });

  // 密碼變更狀態
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 載入狀態
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // 載入設定
  useEffect(() => {
    // 從 localStorage 載入設定
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
      
      // 套用深色模式
      if (parsed.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // 模擬載入用戶資料
    if (user) {
      setProfile({
        displayName: user.displayName || '用戶_' + Math.floor(Math.random() * 1000),
        email: user.email || 'user@example.com',
        avatar: user.photoURL || '/default-avatar.png',
        bio: '嗨！我是一名 EchoMind 使用者。',
      });
    }
  }, [user]);
  
  // 儲存設定至 localStorage
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // 套用深色模式
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);
  
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
      
      // 顯示設定已更新通知
      toast.success(`${key === 'darkMode' ? '深色模式' : key === 'notifications' ? '推送通知' : '音效'} ${!settings[key] ? '已開啟' : '已關閉'}`);
    }
  };
  
  // 處理語言變更
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({
      ...settings,
      language: e.target.value,
    });
    
    toast.success(`語言已設為 ${e.target.value}`);
  };
  
  // 處理個人資料變更
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };
  
  // 處理密碼表單變更
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
  };
  
  // 儲存個人資料
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // 模擬 API 請求
    setTimeout(() => {
      setIsSaving(false);
      toast.success('個人資料已更新');
    }, 800);
  };
  
  // 變更密碼
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('新密碼與確認密碼不符');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast.error('新密碼必須至少8個字元');
      return;
    }
    
    setIsSaving(true);
    
    // 模擬 API 請求
    setTimeout(() => {
      setIsSaving(false);
      toast.success('密碼已成功更新');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }, 800);
  };
  
  // 登出
  const handleLogout = () => {
    if (logout) {
      logout();
      router.push('/login');
    }
  };
  
  // 載入中狀態
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          <p className="text-gray-600 dark:text-gray-300">載入中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-blue-500 hover:text-blue-700 transition"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回
          </button>
        </div>
        
        <div className="overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4">
            {/* 側邊選單 */}
            <div className="bg-gray-50 p-6 dark:bg-gray-900">
              <div className="mb-8 flex flex-col items-center">
                <div className="relative mb-3">
                  <img
                    src={profile.avatar}
                    alt="個人頭像"
                    className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                  />
                  <button className="absolute bottom-0 right-0 rounded-full bg-blue-500 p-1 text-white hover:bg-blue-600 transition">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {profile.displayName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profile.email}
                </p>
              </div>
              
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <User className="mr-3 h-5 w-5" />
                  個人資料
                </button>
                
                <button
                  onClick={() => setActiveTab('appearance')}
                  className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition ${
                    activeTab === 'appearance'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {settings.darkMode ? (
                    <Moon className="mr-3 h-5 w-5" />
                  ) : (
                    <Sun className="mr-3 h-5 w-5" />
                  )}
                  外觀與語言
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition ${
                    activeTab === 'notifications'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <Bell className="mr-3 h-5 w-5" />
                  通知設定
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition ${
                    activeTab === 'security'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <Shield className="mr-3 h-5 w-5" />
                  帳戶安全
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  登出
                </button>
              </nav>
            </div>
            
            {/* 內容區域 */}
            <div className="col-span-3 p-8">
              {/* 個人資料設定 */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    個人資料
                  </h2>
                  
                  <form onSubmit={handleSaveProfile}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          顯示名稱
                        </label>
                        <input
                          type="text"
                          name="displayName"
                          value={profile.displayName}
                          onChange={handleProfileChange}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          電子郵件
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          個人簡介
                        </label>
                        <textarea
                          name="bio"
                          value={profile.bio}
                          onChange={handleProfileChange}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                          rows={4}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            儲存中...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            儲存變更
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* 外觀設定 */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    外觀與語言
                  </h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200">
                        主題設定
                      </h3>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center">
                          {settings.darkMode ? (
                            <Moon className="mr-3 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <Sun className="mr-3 h-5 w-5 text-amber-500" />
                          )}
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
                    
                    <div>
                      <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200">
                        語言設定
                      </h3>
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          <select
                            value={settings.language}
                            onChange={handleLanguageChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="繁體中文">繁體中文</option>
                            <option value="English">English</option>
                            <option value="日本語">日本語</option>
                            <option value="한국어">한국어</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          主題和語言設定會自動儲存並套用到您的所有裝置。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 通知設定 */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    通知設定
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {settings.notifications ? (
                            <Bell className="mr-3 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <BellOff className="mr-3 h-5 w-5 text-gray-500" />
                          )}
                          <div>
                            <span className="block text-gray-700 dark:text-gray-300">
                              推送通知
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              接收重要事件的即時通知
                            </span>
                          </div>
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
                    </div>
                    
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {settings.sound ? (
                            <Volume2 className="mr-3 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <VolumeX className="mr-3 h-5 w-5 text-gray-500" />
                          )}
                          <div>
                            <span className="block text-gray-700 dark:text-gray-300">
                              通知音效
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              收到通知時播放音效
                            </span>
                          </div>
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
                    
                    <div className="pt-4">
                      <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/30">
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          請確保您已在瀏覽器中允許接收通知，以獲得最佳體驗。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 安全設定 */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    帳戶安全
                  </h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center">
                        <Lock className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        變更密碼
                      </h3>
                      
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            目前密碼
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            新密碼
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            minLength={8}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            確認新密碼
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            minLength={8}
                            required
                          />
                        </div>
                        
                        <div>
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            {isSaving ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                處理中...
                              </>
                            ) : (
                              '更新密碼'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                    
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                      <h3 className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                        登入活動
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        上次登入時間: {new Date().toLocaleString('zh-TW')}
                      </p>
                      <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition">
                        查看所有登入活動
                      </button>
                    </div>
                    
                    <div className="pt-4">
                      <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                        <h3 className="mb-2 font-medium text-red-700 dark:text-red-400">
                          危險區域
                        </h3>
                        <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                          刪除帳戶將永久移除所有資料，此操作無法撤銷。
                        </p>
                        <button className="text-sm rounded-lg px-4 py-2 text-white bg-red-600 hover:bg-red-700 transition">
                          刪除我的帳戶
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 