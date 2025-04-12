/**
 * 聊天輸入框組件
 * 提供使用者輸入訊息並發送的介面
 */
import { ArrowUp } from 'lucide-react';
import { ChatInputProps } from '@/lib/types/chat';
import { useChatInput } from './useChatInput';
import { ModelSelector } from './ModelSelector';
import { ImagePreview } from './ImagePreview';
import { ActionButtons } from './ActionButtons';

/**
 * 聊天輸入框組件
 * @param props - 組件屬性
 * @returns 聊天輸入框 JSX 元素
 */
export function ChatInput({ onSubmit, onSendMessage, isLoading }: ChatInputProps) {
  const {
    inputValue,
    setInputValue,
    isDbSearchActive,
    toggleDbSearch,
    selectedModelId,
    setSelectedModelId,
    isModelDropdownOpen,
    setIsModelDropdownOpen,
    isSearching,
    uploadedImage,
    fileInputRef,
    handleImageUpload,
    removeUploadedImage,
    handleSubmit,
    getFileName
  } = useChatInput({ onSubmit, onSendMessage, isLoading });

  return (
    <div className="relative w-full">
      {/* 輸入框和按鈕 */}
      <div className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-visible">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* 如果資料庫搜尋模式啟用，顯示提示 */}
          {isDbSearchActive && (
            <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 text-xs text-blue-700 dark:text-blue-300 rounded-t-2xl border-b border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center gap-1">
                <span>資料庫搜尋模式已啟用 - 您的問題將在輔大資管專業知識庫中搜尋相關資訊</span>
              </div>
            </div>
          )}
          
          {/* 已上傳圖片顯示區域 - Grok 風格 */}
          {uploadedImage && selectedModelId === 'maverick' && (
            <ImagePreview 
              image={uploadedImage} 
              onRemove={removeUploadedImage} 
              getFileName={getFileName}
            />
          )}
          
          {/* 輸入區域 */}
          <div className="flex items-center px-4 py-4 bg-white dark:bg-gray-900 rounded-2xl">
            <input
              type="text"
              placeholder={isDbSearchActive ? "搜尋輔大資管專業知識庫..." : "輸入訊息..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading || isSearching}
            />
            
            {/* 發送按鈕 */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading || isSearching}
              className={`ml-2 flex h-8 w-8 items-center justify-center rounded-full ${
                inputValue.trim() && !isLoading && !isSearching
                  ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                  : 'text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-800 cursor-not-allowed'
              }`}
            >
              {isSearching ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-blue-400" />
              ) : (
                <ArrowUp className="h-5 w-5" />
              )}
            </button>
          </div>
          
          {/* 功能按鈕區域 - 提供附加功能如上傳文件和資料庫搜尋 */}
          <div className="flex items-center justify-between px-3 py-2 gap-2 border-t border-gray-200 dark:border-gray-800">
            {/* 左側功能按鈕群組 */}
            <ActionButtons 
              isDbSearchActive={isDbSearchActive}
              toggleDbSearch={toggleDbSearch}
              handleImageUpload={handleImageUpload}
              selectedModelId={selectedModelId}
              fileInputRef={fileInputRef}
            />
            
            {/* 右側模型選擇 */}
            <ModelSelector 
              selectedModelId={selectedModelId}
              setSelectedModelId={setSelectedModelId}
              isModelDropdownOpen={isModelDropdownOpen}
              setIsModelDropdownOpen={setIsModelDropdownOpen}
            />
          </div>
        </form>
      </div>
      
      {/* 底部警告標語 */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        AI 可能產生不準確資訊。請勿提供個人敏感資料，並謹慎核實重要資訊。
      </div>
    </div>
  );
}
