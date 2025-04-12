/**
 * 圖片預覽組件
 */
import { ImagePreviewProps } from './types';

/**
 * 圖片預覽組件 - 類似 Grok 的內嵌式縮圖設計
 * @param props - 組件屬性
 * @returns 圖片預覽 JSX 元素
 */
export function ImagePreview({ uploadedImage, removeUploadedImage, fileName }: ImagePreviewProps) {
  if (!uploadedImage) return null;

  return (
    <div className="px-4 pt-3">
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-md p-2 pr-3">
        {/* 縮圖 */}
        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
          <img 
            src={uploadedImage} 
            alt="縮圖" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* 檔案名稱 */}
        <div className="flex-1 truncate text-sm text-gray-700 dark:text-gray-300">
          {fileName || '已上傳圖片'}
        </div>
        
        {/* 關閉按鈕 */}
        <button 
          type="button" 
          onClick={removeUploadedImage}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          aria-label="移除圖片"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
