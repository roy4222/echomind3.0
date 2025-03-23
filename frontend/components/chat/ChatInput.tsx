/**
 * 聊天輸入框組件
 * 提供使用者輸入訊息並發送的介面
 */

import { useState, FormEvent } from 'react';
import { Send, Database, Sparkles, ChevronDown, Search, Paperclip, ArrowUp, Link, Brain } from 'lucide-react';

interface ChatInputProps {
  /** 提交訊息的回調函數 */
  onSubmit: (input: string) => Promise<void>;
  /** 是否正在載入中 */
  isLoading: boolean;
}

// 模型選項 (僅用於 UI 展示)
const MODEL_OPTIONS = [
  { 
    id: 'default', 
    name: 'Llama 3.1 8B Instant', 
    icon: '⚡', 
    description: '高效能即時回應，適合日常知識管理任務'
  },
  { 
    id: 'advanced', 
    name: 'Deepseek R1 Distill Llama 70B', 
    icon: '🧠', 
    description: '知識豐富，適合複雜問題與深度理解任務'
  },
  { 
    id: 'creative', 
    name: 'Qwen 2.5 32B', 
    icon: '💎', 
    description: '平衡效能與資源，優秀的跨語言能力'
  },
];

/**
 * 聊天輸入框組件
 * @param props - 組件屬性
 * @returns 聊天輸入框 JSX 元素
 */
export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  // 輸入值狀態
  const [inputValue, setInputValue] = useState('');
  // UI 狀態
  const [isDbSearchActive, setIsDbSearchActive] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState(MODEL_OPTIONS[0].id);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  /**
   * 表單提交處理函數
   * @param e - 表單事件
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // 檢查輸入是否為空
    if (!inputValue.trim() || isLoading) return;
    
    try {
      // 提交訊息 (注意：目前僅傳遞輸入值，不傳遞模型或搜尋選項)
      await onSubmit(inputValue);
      // 清空輸入框
      setInputValue('');
    } catch (error) {
      console.error('提交訊息失敗:', error);
    }
  };

  // 處理模型選擇
  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setIsModelDropdownOpen(false);
  };

  // 切換資料庫搜尋狀態 (僅前端視覺效果)
  const toggleDbSearch = () => {
    setIsDbSearchActive(!isDbSearchActive);
  };

  // 取得當前選擇的模型
  const selectedModel = MODEL_OPTIONS.find(m => m.id === selectedModelId) || MODEL_OPTIONS[0];

  return (
    <div className="relative w-full">
      {/* 輸入框和按鈕 */}
      <div className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-visible">
        <form onSubmit={handleSubmit} className="flex flex-col">          
          {/* 輸入區域 */}
          <div className="flex items-center px-4 py-4 bg-white dark:bg-gray-900 rounded-2xl">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="輸入您的問題..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (inputValue.trim() && !isLoading) {
                    handleSubmit(e as unknown as FormEvent);
                  }
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`p-2 rounded-full ${
                inputValue.trim() && !isLoading
                  ? 'text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                  : 'text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-800 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
          
          {/* 功能按鈕區域 */}
          <div className="flex items-center justify-between px-3 py-2 gap-2 border-t border-gray-200 dark:border-gray-800">
            {/* 左側功能 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              
              <button
                type="button"
                onClick={toggleDbSearch}
                className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm ${
                  isDbSearchActive
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <Database className="h-4 w-4" />
                <span>資料庫搜尋</span>
              </button>
            </div>
            
            {/* 右側模型選擇 */}
            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
              >
                <span className="text-orange-500 dark:text-orange-400">{selectedModel.icon}</span>
                <span>{selectedModel.name}</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </button>
              
              {isModelDropdownOpen && (
                <div className="absolute top-0 right-0 transform -translate-y-full mt-[-8px] w-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                  <div className="py-2 px-3 border-b border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-600 dark:text-gray-300">
                    選擇模型
                  </div>
                  <div className="py-1">
                    {MODEL_OPTIONS.map(model => (
                      <button
                        key={model.id}
                        onClick={() => handleModelSelect(model.id)}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          model.id === selectedModelId ? 'bg-gray-100 dark:bg-gray-700' : ''
                        }`}
                      >
                        <span className="text-lg text-orange-500 dark:text-orange-400">{model.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900 dark:text-white">{model.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {model.id === 'default' 
                              ? model.description 
                              : model.id === 'advanced' 
                                ? model.description 
                                : model.description}
                          </div>
                        </div>
                        {model.id === selectedModelId && (
                          <span className="text-orange-500 dark:text-orange-400">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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