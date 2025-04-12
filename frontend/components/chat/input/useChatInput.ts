/**
 * 聊天輸入自定義 Hook
 */
import { useState, useRef, FormEvent } from 'react';
import { ChatMessage } from '../../../lib/types/chat';
import { DEFAULT_MODEL_ID, MAX_IMAGE_SIZE, IMAGE_ERROR_MESSAGE } from './constants';

/**
 * 聊天輸入 Hook 參數介面
 */
interface UseChatInputProps {
  /** 提交訊息的回調函數 */
  onSubmit: (input: string, modelId?: string, image?: string) => Promise<void>;
  /** 添加消息到聊天的回調函數 */
  onSendMessage?: (message: ChatMessage) => void;
  /** 是否正在載入中 */
  isLoading: boolean;
}

/**
 * 聊天輸入 Hook 返回值介面
 */
export interface UseChatInputReturn {
  /** 輸入值 */
  inputValue: string;
  /** 設置輸入值的函數 */
  setInputValue: (value: string) => void;
  /** 資料庫搜尋是否啟用 */
  isDbSearchActive: boolean;
  /** 切換資料庫搜尋狀態的函數 */
  toggleDbSearch: () => void;
  /** 選擇的模型 ID */
  selectedModelId: string;
  /** 設置選擇的模型 ID 的函數 */
  setSelectedModelId: (id: string) => void;
  /** 模型下拉選單是否開啟 */
  isModelDropdownOpen: boolean;
  /** 設置模型下拉選單開啟狀態的函數 */
  setIsModelDropdownOpen: (isOpen: boolean) => void;
  /** 是否正在搜尋 */
  isSearching: boolean;
  /** 上傳的圖片 */
  uploadedImage: string | null;
  /** 檔案輸入參考 */
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  /** 處理圖片上傳的函數 */
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** 移除上傳圖片的函數 */
  removeUploadedImage: () => void;
  /** 處理表單提交的函數 */
  handleSubmit: (e: FormEvent) => Promise<void>;
  /** 處理向量搜尋的函數 */
  handleVectorSearch: (query: string) => Promise<void>;
  /** 獲取上傳的檔案名稱 */
  getFileName: () => string | undefined;
}

/**
 * 聊天輸入自定義 Hook
 * @param props - Hook 參數
 * @returns Hook 返回值
 */
export function useChatInput({ onSubmit, onSendMessage, isLoading }: UseChatInputProps): UseChatInputReturn {
  // 輸入值狀態
  const [inputValue, setInputValue] = useState('');
  // UI 狀態
  const [isDbSearchActive, setIsDbSearchActive] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  // 圖片上傳狀態
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * 獲取上傳的檔案名稱
   */
  const getFileName = (): string | undefined => {
    return fileInputRef.current?.files?.[0]?.name;
  };

  /**
   * 處理圖片上傳
   * @param event - 檔案輸入事件
   */
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 檢查檔案大小 (限制為 5MB)
    if (file.size > MAX_IMAGE_SIZE) {
      alert(IMAGE_ERROR_MESSAGE);
      return;
    }

    // 轉換為 base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target?.result as string;
      setUploadedImage(base64Image);
    };
    reader.readAsDataURL(file);
  };

  /**
   * 移除已上傳的圖片
   */
  const removeUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * 切換資料庫搜尋狀態
   */
  const toggleDbSearch = () => {
    setIsDbSearchActive(!isDbSearchActive);
  };

  /**
   * 表單提交處理函數
   * @param e - 表單事件
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading || isSearching) return;
    
    try {
      // 添加用戶訊息到聊天界面 (無論是否有圖片都相同)
      if (onSendMessage) {
        onSendMessage({
          role: 'user',
          content: inputValue,
          id: Date.now().toString(),
          createdAt: Date.now(),
          image: uploadedImage || undefined
        });
      }
      
      // 清空輸入框
      setInputValue('');
      setIsSearching(true);
      
      // 根據是否有圖片調用不同的提交函數
      if (uploadedImage && selectedModelId === 'maverick') {
        await onSubmit(inputValue, selectedModelId, uploadedImage);
        removeUploadedImage();
      } else {
        await onSubmit(inputValue, selectedModelId);
      }
    } catch (error) {
      console.error('發送訊息錯誤:', error);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * 處理向量搜尋功能
   * @param query - 搜尋查詢
   */
  const handleVectorSearch = async (query: string) => {
    if (!onSendMessage) {
      console.error('沒有提供 onSendMessage 回調');
      return;
    }
    
    // 添加使用者訊息到聊天
    onSendMessage({
      id: Date.now().toString(),
      role: 'user',
      content: query,
      createdAt: Date.now(),
    });
    
    // 設置搜尋狀態
    setIsSearching(true);
    
    try {
      // 調用提交函數
      await onSubmit(query, selectedModelId);
    } catch (error) {
      console.error('向量搜尋錯誤:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return {
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
    handleVectorSearch,
    getFileName
  };
}
