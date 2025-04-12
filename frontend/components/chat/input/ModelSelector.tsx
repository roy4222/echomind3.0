/**
 * 模型選擇器組件
 * 提供用戶選擇不同AI模型的下拉選單界面
 */
import { ChevronDown, Check } from 'lucide-react';
import { ModelSelectorProps } from '@/lib/types/model';
import { MODEL_OPTIONS } from './constants';

/**
 * 模型選擇器組件
 * @param props - 組件屬性
 * @param props.selectedModelId - 當前選中的模型ID
 * @param props.setSelectedModelId - 設置選中模型ID的函數
 * @param props.isModelDropdownOpen - 下拉選單是否開啟
 * @param props.setIsModelDropdownOpen - 設置下拉選單開啟狀態的函數
 * @returns 模型選擇器 JSX 元素
 */
export function ModelSelector({
  selectedModelId,
  setSelectedModelId,
  isModelDropdownOpen,
  setIsModelDropdownOpen
}: ModelSelectorProps) {
  /**
   * 切換模型下拉選單開啟/關閉狀態
   */
  const toggleModelDropdown = () => {
    setIsModelDropdownOpen(!isModelDropdownOpen);
  };

  /**
   * 選擇特定模型並關閉下拉選單
   * @param modelId - 要選擇的模型 ID
   */
  const selectModel = (modelId: string) => {
    setSelectedModelId(modelId);
    setIsModelDropdownOpen(false);
  };

  // 從模型選項中找出當前選中的模型
  const selectedModel = MODEL_OPTIONS.find(model => model.id === selectedModelId);

  // 渲染模型圖標
  const renderModelIcon = (icon: string) => {
    if (icon.startsWith('<svg')) {
      return <span dangerouslySetInnerHTML={{ __html: icon }} className="text-blue-400 dark:text-blue-300" />;
    }
    return <span className="text-lg">{icon}</span>;
  };

  return (
    <div className="relative">
      {/* 模型下拉選單 - 只在開啟狀態顯示 */}
      {isModelDropdownOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-64 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden z-10">
          {/* 下拉選單標題 */}
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium">
            選擇模型
          </div>
          
          {/* 可滾動的模型選項列表 */}
          <div className="max-h-80 overflow-y-auto">
            {MODEL_OPTIONS.map(model => (
              <div
                key={model.id}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col ${
                  model.id === selectedModelId ? 'bg-gray-100/80 dark:bg-gray-800/50' : ''
                }`}
                onClick={() => selectModel(model.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {renderModelIcon(model.icon)}
                    <span className="text-gray-800 dark:text-gray-100 font-medium">{model.name}</span>
                  </div>
                  {/* 顯示選中標記 */}
                  {model.id === selectedModelId && (
                    <Check size={18} className="text-blue-500 dark:text-blue-400" />
                  )}
                </div>
                {/* 模型描述 */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{model.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 當前選中模型的按鈕 - 用於開關下拉選單 */}
      <button
        type="button"
        onClick={toggleModelDropdown}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
        aria-label="選擇模型"
      >
        {selectedModel && (
          <>
            {renderModelIcon(selectedModel.icon)}
            <span>{selectedModel.name}</span>
            <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
          </>
        )}
      </button>
    </div>
  );
}
