/**
 * 模型相關型別定義
 */

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
