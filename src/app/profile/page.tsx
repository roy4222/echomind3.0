'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Camera, Mail, User as UserIcon, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateUserProfile } from '@/lib/utils/auth';
import { uploadAvatar } from '@/lib/utils/upload';
import { toast } from 'sonner';

/**
 * 個人資料頁面組件
 * 允許用戶查看和編輯個人資料，包括頭像、用戶名等
 */
export default function ProfilePage() {
  // 獲取用戶認證狀態和路由
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // 狀態管理
  const [isEditing, setIsEditing] = useState(false); // 是否處於編輯模式
  const [isUploading, setIsUploading] = useState(false); // 是否正在上傳頭像
  const fileInputRef = useRef<HTMLInputElement>(null); // 文件輸入框引用
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    photoURL: '',
  });

  // 監聽用戶認證狀態
  useEffect(() => {
    if (!loading && !user) {
      // 未登入時重定向到登入頁
      router.push('/login');
    } else if (user) {
      // 已登入時初始化表單數據
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
      });
    }
  }, [user, loading, router]);

  /**
   * 處理表單輸入變化
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * 處理頭像點擊事件
   */
  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * 處理文件選擇變化
   * 上傳新頭像到 Firebase Storage
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      const downloadURL = await uploadAvatar(file, user.uid);
      await updateUserProfile(undefined, downloadURL);
      setFormData(prev => ({ ...prev, photoURL: downloadURL }));
    } catch (error) {
      console.error('頭像上傳失敗:', error);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * 處理表單提交
   * 更新用戶資料
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUserProfile(
        formData.displayName,
        formData.photoURL
      );
      setIsEditing(false);
    } catch (error) {
      console.error('更新失敗:', error);
    }
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
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        {/* 頭部區域 - 包含頭像和基本信息 */}
        <div className="mb-8 text-center">
          <div className="relative mx-auto mb-4 h-32 w-32">
            <div 
              className={cn(
                "relative h-full w-full overflow-hidden rounded-full border-4 border-gray-200 dark:border-gray-700",
                isEditing && "cursor-pointer hover:opacity-80"
              )}
              onClick={handleAvatarClick}
            >
              {isUploading ? (
                // 上傳中顯示加載動畫
                <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                </div>
              ) : formData.photoURL ? (
                // 顯示用戶頭像
                <img
                  src={formData.photoURL}
                  alt={formData.displayName || '用戶頭像'}
                  className="h-full w-full object-cover"
                />
              ) : (
                // 無頭像時顯示默認圖標
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-700">
                  <UserIcon className="h-16 w-16" />
                </div>
              )}
            </div>
            {/* 編輯模式下顯示上傳按鈕和文件輸入 */}
            {isEditing && (
              <>
                <button
                  className="absolute bottom-0 right-0 rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
                  onClick={handleAvatarClick}
                >
                  <Camera className="h-5 w-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            )}
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {formData.displayName || '未設置名稱'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {formData.email}
          </p>
        </div>

        {/* 表單區域 - 用戶資料編輯表單 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* 用戶名稱輸入框 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                用戶名稱
              </label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={cn(
                    "w-full rounded-lg border bg-white py-2 pl-10 pr-3 text-gray-700 shadow-sm",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400",
                    !isEditing && "cursor-not-allowed opacity-75"
                  )}
                  placeholder="請輸入用戶名稱"
                />
              </div>
            </div>

            {/* 電子郵件輸入框（禁用） */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                電子郵件
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 py-2 pl-10 pr-3 text-gray-700 opacity-75 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300"
                />
              </div>
            </div>
          </div>

          {/* 加入時間顯示（禁用） */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              加入時間
            </label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleString() : '未知'}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 py-2 pl-10 pr-3 text-gray-700 opacity-75 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300"
              />
            </div>
          </div>

          {/* 操作按鈕區域 */}
          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      displayName: user?.displayName || '',
                      email: user?.email || '',
                      photoURL: user?.photoURL || '',
                    });
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  保存
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                編輯資料
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 