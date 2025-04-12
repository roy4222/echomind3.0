/**
 * 聊天輸入相關類型定義
 */
import { ReactNode } from 'react';
import { ChatMessage } from '../../../lib/types/chat';

/**
 * 模型選項介面
 */
export interface ModelOption {
  /** 模型 ID */
  id: string;
  /** 模型名稱 */
  name: string;
  /** 模型圖示 (SVG 字串) */
  icon: string;
  /** 模型描述 */
  description: string;
}

/**
 * 聊天輸入 Props 介面
 */
export interface ChatInputProps {
  /** 提交訊息的回調函數 */
  onSubmit: (input: string, modelId?: string, image?: string) => Promise<void>;
  /** 添加消息到聊天的回調函數 */
  onSendMessage?: (message: ChatMessage) => void;
  /** 是否正在載入中 */
  isLoading: boolean;
}

/**
 * 模型選擇器 Props 介面
 */
export interface ModelSelectorProps {
  /** 當前選擇的模型 ID */
  selectedModelId: string;
  /** 設置選擇的模型 ID 的函數 */
  setSelectedModelId: (id: string) => void;
  /** 模型下拉選單是否開啟 */
  isModelDropdownOpen: boolean;
  /** 設置模型下拉選單開啟狀態的函數 */
  setIsModelDropdownOpen: (isOpen: boolean) => void;
}

/**
 * 圖片預覽 Props 介面
 */
export interface ImagePreviewProps {
  /** 上傳的圖片 (base64 格式) */
  uploadedImage: string | null;
  /** 移除上傳圖片的函數 */
  removeUploadedImage: () => void;
  /** 檔案名稱 */
  fileName?: string;
}

/**
 * 功能按鈕 Props 介面
 */
export interface ActionButtonsProps {
  /** 資料庫搜尋是否啟用 */
  isDbSearchActive: boolean;
  /** 切換資料庫搜尋狀態的函數 */
  toggleDbSearch: () => void;
  /** 處理圖片上傳的函數 */
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** 當前選擇的模型 ID */
  selectedModelId: string;
  /** 檔案輸入參考 */
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}
