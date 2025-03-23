/**
 * 聊天輸入框組件
 * 提供使用者輸入訊息並發送的介面
 */

import { useState, FormEvent } from 'react';
import { Send, Database, Sparkles, ChevronDown, Search, Paperclip, ArrowUp, Link, Brain } from 'lucide-react';
import React from 'react';

interface ChatInputProps {
  /** 提交訊息的回調函數 */
  onSubmit: (input: string, modelId?: string) => Promise<void>;
  /** 是否正在載入中 */
  isLoading: boolean;
}

// 模型選項 (僅用於 UI 展示)
const MODEL_OPTIONS = [
  { 
    id: 'default', 
    name: 'Llama 3.1 8B Instant', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="M16.361 10.26a.9.9 0 0 0-.558.47l-.072.148l.001.207c0 .193.004.217.059.353c.076.193.152.312.291.448c.24.238.51.3.872.205a.86.86 0 0 0 .517-.436a.75.75 0 0 0 .08-.498c-.064-.453-.33-.782-.724-.897a1.1 1.1 0 0 0-.466 0m-9.203.005c-.305.096-.533.32-.65.639a1.2 1.2 0 0 0-.06.52c.057.309.31.59.598.667c.362.095.632.033.872-.205c.14-.136.215-.255.291-.448c.055-.136.059-.16.059-.353l.001-.207l-.072-.148a.9.9 0 0 0-.565-.472a1 1 0 0 0-.474.007m4.184 2c-.131.071-.223.25-.195.383c.031.143.157.288.353.407c.105.063.112.072.117.136c.004.038-.01.146-.029.243c-.02.094-.036.194-.036.222c.002.074.07.195.143.253c.064.052.076.054.255.059c.164.005.198.001.264-.03c.169-.082.212-.234.15-.525c-.052-.243-.042-.28.087-.355c.137-.08.281-.219.324-.314a.365.365 0 0 0-.175-.48a.4.4 0 0 0-.181-.033c-.126 0-.207.03-.355.124l-.085.053l-.053-.032c-.219-.13-.259-.145-.391-.143a.4.4 0 0 0-.193.032m.39-2.195c-.373.036-.475.05-.654.086a4.5 4.5 0 0 0-.951.328c-.94.46-1.589 1.226-1.787 2.114c-.04.176-.045.234-.045.53c0 .294.005.357.043.524c.264 1.16 1.332 2.017 2.714 2.173c.3.033 1.596.033 1.896 0c1.11-.125 2.064-.727 2.493-1.571c.114-.226.169-.372.22-.602c.039-.167.044-.23.044-.523c0-.297-.005-.355-.045-.531c-.288-1.29-1.539-2.304-3.072-2.497a7 7 0 0 0-.855-.031zm.645.937a3.3 3.3 0 0 1 1.44.514c.223.148.537.458.671.662c.166.251.26.508.303.82c.02.143.01.251-.043.482c-.08.345-.332.705-.672.957a3 3 0 0 1-.689.348c-.382.122-.632.144-1.525.138c-.582-.006-.686-.01-.853-.042q-.856-.16-1.35-.68c-.264-.28-.385-.535-.45-.946c-.03-.192.025-.509.137-.776c.136-.326.488-.73.836-.963c.403-.269.934-.46 1.422-.512c.187-.02.586-.02.773-.002m-5.503-11a1.65 1.65 0 0 0-.683.298C5.617.74 5.173 1.666 4.985 2.819c-.07.436-.119 1.04-.119 1.503c0 .544.064 1.24.155 1.721c.02.107.031.202.023.208l-.187.152a5.3 5.3 0 0 0-.949 1.02a5.5 5.5 0 0 0-.94 2.339a6.6 6.6 0 0 0-.023 1.357c.091.78.325 1.438.727 2.04l.13.195l-.037.064c-.269.452-.498 1.105-.605 1.732c-.084.496-.095.629-.095 1.294c0 .67.009.803.088 1.266c.095.555.288 1.143.503 1.534c.071.128.243.393.264.407c.007.003-.014.067-.046.141a7.4 7.4 0 0 0-.548 1.873a5 5 0 0 0-.071.991c0 .56.031.832.148 1.279L3.42 24h1.478l-.05-.091c-.297-.552-.325-1.575-.068-2.597c.117-.472.25-.819.498-1.296l.148-.29v-.177c0-.165-.003-.184-.057-.293a.9.9 0 0 0-.194-.25a1.7 1.7 0 0 1-.385-.543c-.424-.92-.506-2.286-.208-3.451c.124-.486.329-.918.544-1.154a.8.8 0 0 0 .223-.531c0-.195-.07-.355-.224-.522a3.14 3.14 0 0 1-.817-1.729c-.14-.96.114-2.005.69-2.834c.563-.814 1.353-1.336 2.237-1.475c.199-.033.57-.028.776.01c.226.04.367.028.512-.041c.179-.085.268-.19.374-.431c.093-.215.165-.333.36-.576c.234-.29.46-.489.822-.729c.413-.27.884-.467 1.352-.561c.17-.035.25-.04.569-.04s.398.005.569.04a4.07 4.07 0 0 1 1.914.997c.117.109.398.457.488.602c.034.057.095.177.132.267c.105.241.195.346.374.43c.14.068.286.082.503.045c.343-.058.607-.053.943.016c1.144.23 2.14 1.173 2.581 2.437c.385 1.108.276 2.267-.296 3.153c-.097.15-.193.27-.333.419c-.301.322-.301.722-.001 1.053c.493.539.801 1.866.708 3.036c-.062.772-.26 1.463-.533 1.854a2 2 0 0 1-.224.258a.9.9 0 0 0-.194.25c-.054.109-.057.128-.057.293v.178l.148.29c.248.476.38.823.498 1.295c.253 1.008.231 2.01-.059 2.581a1 1 0 0 0-.044.098c0 .006.329.009.732.009h.73l.02-.074l.036-.134c.019-.076.057-.3.088-.516a9 9 0 0 0 0-1.258c-.11-.875-.295-1.57-.597-2.226c-.032-.074-.053-.138-.046-.141a1.4 1.4 0 0 0 .108-.152c.376-.569.607-1.284.724-2.228c.031-.26.031-1.378 0-1.628c-.083-.645-.182-1.082-.348-1.525a6 6 0 0 0-.329-.7l-.038-.064l.131-.194c.402-.604.636-1.262.727-2.04a6.6 6.6 0 0 0-.024-1.358a5.5 5.5 0 0 0-.939-2.339a5.3 5.3 0 0 0-.95-1.02l-.186-.152a.7.7 0 0 1 .023-.208c.208-1.087.201-2.443-.017-3.503c-.19-.924-.535-1.658-.98-2.082c-.354-.338-.716-.482-1.15-.455c-.996.059-1.8 1.205-2.116 3.01a7 7 0 0 0-.097.726c0 .036-.007.066-.015.066a1 1 0 0 1-.149-.078A4.86 4.86 0 0 0 12 3.03c-.832 0-1.687.243-2.456.698a1 1 0 0 1-.148.078c-.008 0-.015-.03-.015-.066a7 7 0 0 0-.097-.725C8.997 1.392 8.337.319 7.46.048a2 2 0 0 0-.585-.041Zm.293 1.402c.248.197.523.759.682 1.388c.03.113.06.244.069.292c.007.047.026.152.041.233c.067.365.098.76.102 1.24l.002.475l-.12.175l-.118.178h-.278c-.324 0-.646.041-.954.124l-.238.06c-.033.007-.038-.003-.057-.144a8.4 8.4 0 0 1 .016-2.323c.124-.788.413-1.501.696-1.711c.067-.05.079-.049.157.013m9.825-.012c.17.126.358.46.498.888c.28.854.36 2.028.212 3.145c-.019.14-.024.151-.057.144l-.238-.06a3.7 3.7 0 0 0-.954-.124h-.278l-.119-.178l-.119-.175l.002-.474c.004-.669.066-1.19.214-1.772c.157-.623.434-1.185.68-1.382c.078-.062.09-.063.159-.012"/></svg>, 
    description: '高效能即時回應，適合日常知識管理任務'
  },
  { 
    id: 'advanced', 
    name: 'Deepseek R1 Distill Llama 70B', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M31.97 33.128c5.146-5.785 5.618-11.022 5.797-13.649"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M37.764 19.48c4.61-.866 6.127-3.58 6.623-5.779c.269-1.19.016-1.792-.316-1.97c-.332-.18-.742.064-1.117.463c-1.892 2.01-3.02.998-4.405 1.37c-.765.206-1.218.796-1.655.56s-.86-1.303-1.476-1.745c-.617-.443-1.428-.264-1.982-.965c-.553-.7-.959-2.436-1.38-2.384c-.99 0-1.573 1.995-1.579 3.698c-.005 1.754.919 3.887 3.557 5.824c0 0-.455 1.457-.602 2.205h.004c-3.954-1.765-6.14-5.062-9.006-7.254c-.902-.69-.89-1.382-.325-1.888c.564-.506 1.555-.843 1.38-1.133c-.173-.29-1.512-.532-2.814-.353s-2.566.78-3.831 1.38c0 0-1.129-.727-3.19-.727c-8.454 0-12.15 6.554-12.15 12.119c0 6.636 6.091 16.07 16.107 16.07c7.585 0 9.221-3.111 9.221-3.111c3.708 1.206 6.08.788 6.924-.333c.753-1-2.268-1.808-3.784-2.399"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M17.62 31.213c-1.018-.12-.156 2.938-.156 2.938c-2.034.442-4.743.295-8.299-4.835c-2.885-4.162-3.427-8.892-1.975-9.232c1.45-.34 5.668.345 8.64 2.403c2.974 2.059 5.858 5.86 7.827 8.191s3.04 3.558 5.171 5.182c-7.119-.45-8.582-4.339-11.207-4.647m8.454-10.385c2.442 0 4.771 3.392 4.771 4.927c0 .618-.721.783-1.607.783s-2.154-.412-2.154-2.04s-.122-2.329-1.44-2.329s-.992-1.34.43-1.34"/><circle cx="25.294" cy="23.751" r=".735" fill="currentColor"/></svg>,
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
      console.log(`提交訊息 - 使用模型: ${selectedModelId}`);
      
      // 提交訊息 (始終傳遞當前選擇的模型)
      await onSubmit(inputValue, selectedModelId);
      
      // 清空輸入框
      setInputValue('');
    } catch (error) {
      console.error('提交訊息失敗:', error);
    }
  };

  // 處理模型選擇
  const handleModelSelect = (modelId: string) => {
    console.log(`🔄 切換模型: ${modelId}`, {
      前一個模型: selectedModelId,
      新模型: modelId,
      模型資訊: MODEL_OPTIONS.find(m => m.id === modelId)
    });
    
    setSelectedModelId(modelId);
    
    // 如果輸入框有內容，即時更新選定的模型
    if (inputValue.trim()) {
      // 不立即提交，只是更新選定的模型
      console.log(`🔄 更新選定模型為: ${modelId}`);
    }
    
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
                <span>學業資料庫搜尋</span>
              </button>
            </div>
            
            {/* 右側模型選擇 */}
            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
              >
                <span className={`w-5 h-5 ${
                  selectedModel.id === 'default' 
                    ? 'text-orange-500 dark:text-orange-400' 
                    : selectedModel.id === 'advanced'
                      ? 'text-blue-800 dark:text-blue-600'
                      : 'text-blue-600 dark:text-blue-400'
                }`}>
                  {typeof selectedModel.icon === 'string' 
                    ? selectedModel.icon 
                    : React.cloneElement(selectedModel.icon, { 
                        width: 20, 
                        height: 20,
                      })}
                </span>
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
                        <span className={`text-lg w-5 h-5 flex-shrink-0 ${
                          model.id === 'default' 
                            ? 'text-orange-500 dark:text-orange-400' 
                            : model.id === 'advanced'
                              ? 'text-blue-800 dark:text-blue-600'
                              : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {typeof model.icon === 'string' 
                            ? model.icon 
                            : React.cloneElement(model.icon, { 
                                width: 20, 
                                height: 20,
                              })}
                        </span>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900 dark:text-white">{model.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {model.description}
                          </div>
                        </div>
                        {model.id === selectedModelId && (
                          <span className={`${
                            model.id === 'default' 
                              ? 'text-orange-500 dark:text-orange-400' 
                              : model.id === 'advanced'
                                ? 'text-blue-800 dark:text-blue-600'
                                : 'text-blue-600 dark:text-blue-400'
                          }`}>✓</span>
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