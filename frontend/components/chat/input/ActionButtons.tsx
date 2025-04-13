/**
 * 功能按鈕組件 - 包含圖片上傳和資料庫搜尋功能
 */
import { Database, Paperclip, Globe } from 'lucide-react';
import { ActionButtonsProps } from '@/lib/types/chat';

/**
 * 功能按鈕組件
 * @param props - 組件屬性
 * @param props.isDbSearchActive - 資料庫搜尋模式是否啟用
 * @param props.toggleDbSearch - 切換資料庫搜尋模式的函數
 * @param props.isWebSearchActive - 網絡搜尋模式是否啟用
 * @param props.toggleWebSearch - 切換網絡搜尋模式的函數
 * @param props.handleImageUpload - 處理圖片上傳的函數
 * @param props.selectedModelId - 當前選擇的模型ID
 * @param props.fileInputRef - 檔案輸入元素的參考
 * @returns 功能按鈕 JSX 元素
 */
export function ActionButtons({
  isDbSearchActive,
  toggleDbSearch,
  isWebSearchActive,
  toggleWebSearch,
  handleImageUpload,
  selectedModelId,
  fileInputRef
}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 md:gap-2">
      {/* 附件上傳按鈕 - 只有選擇 Maverick 模型時才可用 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
        id="image-upload"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`p-2 rounded-md ${
          selectedModelId === 'maverick'
            ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800'
            : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
        }`}
        disabled={selectedModelId !== 'maverick'}
        title={selectedModelId === 'maverick' ? '上傳圖片' : '只有 Llama 4 Maverick 模型支援圖片上傳'}
        aria-label="上傳圖片"
      >
        <Paperclip className="h-5 w-5" />
      </button>
      
      {/* 資料庫搜尋切換按鈕 - 切換是否啟用學業資料庫搜尋功能 */}
      <button
        type="button"
        onClick={toggleDbSearch}
        className={`flex items-center gap-1 px-2 py-1 md:px-3 md:py-2 rounded-full text-sm ${
          isDbSearchActive
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-700'
            : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700'
        }`}
        aria-label={isDbSearchActive ? '停用資料庫搜尋' : '啟用資料庫搜尋'}
      >
        <Database className="h-4 w-4" />
        <span className="hidden sm:inline">學業資料庫搜尋{isDbSearchActive ? ' (已啟用)' : ''}</span>
      </button>

      {/* 網絡搜尋切換按鈕 - 切換是否啟用網絡搜尋功能 */}
      <button
        type="button"
        onClick={toggleWebSearch}
        className={`flex items-center gap-1 px-2 py-1 md:px-3 md:py-2 rounded-full text-sm ${
          isWebSearchActive
            ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400 border-2 border-green-300 dark:border-green-700'
            : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700'
        }`}
        aria-label={isWebSearchActive ? '停用網絡搜尋' : '啟用網絡搜尋'}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">網絡搜尋{isWebSearchActive ? ' (已啟用)' : ''}</span>
      </button>
    </div>
  );
}
