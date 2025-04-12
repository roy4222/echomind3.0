/**
 * 圖片預覽組件
 */
import { ImagePreviewProps } from '@/lib/types/chat';

/**
 * 圖片預覽組件 - 類似 Grok 的內嵌式縮圖設計
 * @param props - 組件屬性
 * @returns 圖片預覽 JSX 元素
 */
export function ImagePreview({ image, onRemove, getFileName }: ImagePreviewProps) {
  if (!image) return null;
  
  const fileName = getFileName();

  return (
    <div className="px-4 pt-3">
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-md p-2 pr-3">
        {/* 縮圖 */}
        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
          <img 
            src={image} 
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
          onClick={onRemove}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          aria-label="移除圖片"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
