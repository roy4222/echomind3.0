'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthActions } from '@/hooks/useAuthActions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useAuthActions();
  
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError('發送重設密碼郵件失敗，請檢查您的電子郵件是否正確');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            忘記密碼
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            請輸入您的電子郵件，我們將發送重設密碼的連結
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/50">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {success ? (
          <div className="space-y-6">
            <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/50">
              <p className="text-sm text-green-700 dark:text-green-200">
                重設密碼的郵件已發送至您的信箱，請檢查您的郵件並按照指示操作。
              </p>
            </div>
            <div className="flex justify-center">
              <Link
                href="/login"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                <ArrowLeft className="h-4 w-4" />
                返回登入頁面
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                電子郵件
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                placeholder="xxxx@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:hover:bg-blue-400"
            >
              {isLoading ? '發送中...' : '發送重設密碼郵件'}
            </button>

            <div className="flex justify-center">
              <Link
                href="/login"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                <ArrowLeft className="h-4 w-4" />
                返回登入頁面
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 