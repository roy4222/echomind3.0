# Handlers 處理器

## 功能概述

`handlers` 目錄包含所有 HTTP 請求的處理邏輯，負責接收請求、處理資料、調用相應服務，並返回適當的回應。這些處理器是整個應用的入口點，將前端請求轉交給後端服務進行處理。

## 檔案結構

```
handlers/
├── chat.ts      - 處理聊天對話請求
├── faq.ts       - 處理常見問題查詢
├── health.ts    - 處理健康狀態檢查
└── upload.ts    - 處理檔案上傳
```

## 主要元件說明

### chat.ts

處理與 AI 聊天對話相關的請求，是應用的核心功能。

**主要功能**：
- 接收用戶的聊天訊息，轉發至 Groq API 進行處理
- 支援各種模型選擇和參數設定（溫度、最大令牌數等）
- 處理多模態聊天（文字 + 圖片）
- 自動附加系統提示詞，定義 AI 助手的角色和行為準則

**核心邏輯**：
- `handleChat()`: 主要請求處理函數，負責驗證、解析請求並調用 Groq API
- `callGroqApi()`: 封裝與 Groq API 的通信邏輯，處理模型映射和參數設置

### faq.ts

處理常見問題檢索功能，支援語義搜尋。

**主要功能**：
- 接收用戶查詢，在常見問題資料庫中搜尋相關內容
- 使用向量相似度搜尋，找出最相關的問答對
- 支援基於類別、重要性和相似度的結果過濾

**核心邏輯**：
- `handleFaq()`: 解析查詢參數，使用 Pinecone 服務進行向量搜尋
- 結果過濾與排序，根據相似度和其他屬性返回最相關的問答

### health.ts

提供服務健康狀態檢查，用於監控系統運行狀況。

**主要功能**：
- 檢查 API 服務的可用性
- 驗證相關的外部服務（如 Python API）是否正常運行
- 提供詳細的狀態報告供監控系統使用

**核心邏輯**：
- `handleHealthCheck()`: 檢查各服務組件的狀態，彙總服務健康資訊

### upload.ts

處理檔案上傳功能，主要用於圖片上傳。

**主要功能**：
- 接收前端上傳的檔案並驗證
- 將檔案儲存到 Cloudflare R2 儲存服務
- 返回公開可訪問的檔案 URL

**核心邏輯**：
- `handleUpload()`: 解析多部分表單數據，驗證檔案大小，調用儲存服務上傳檔案

## 設計原則

- **單一職責**: 每個處理器專注於一種特定類型的請求
- **關注點分離**: 請求驗證、業務邏輯和回應生成清晰分離
- **標準化錯誤處理**: 使用統一的錯誤處理機制
- **詳細日誌**: 提供完整的請求處理日誌，便於除錯和監控
