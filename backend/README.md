# EchoMind 後端系統文檔

## 系統架構概述

EchoMind 後端系統採用雙重架構設計，結合 Cloudflare Workers 和可選的 Python API 服務，提供高效且靈活的向量搜索和問答功能。

### 1. 核心服務: Cloudflare Workers (TypeScript)

Cloudflare Workers 作為主要 API 層，負責處理客戶端請求、路由和主要業務邏輯，包括直接處理向量搜尋請求。

- **入口點**: `src/index.ts` - 處理請求路由和錯誤處理
- **核心處理器**: `src/handlers/` - 包含各端點處理邏輯
- **服務組件**: 
  - `src/services/pinecone.ts` - 封裝與 Pinecone 的互動邏輯 (包括調用嵌入服務)
  - `src/services/embedding.ts` - 通過 Cohere API 處理文本嵌入

### 2. 輔助服務: Python API (FastAPI)

位於 `llama_index/` 目錄的 Python API 服務，目前主要提供資料處理和上傳功能，而不是處理即時的向量搜尋請求。

- **入口點**: `api_server.py` - FastAPI 伺服器
- **核心功能**:
  - `query_qa.py` - (備註：此模組存在，但目前未被 `/api/vector-search` 調用)
  - `process_qa_data.py` - 資料處理和上傳至 Pinecone

## 技術整合

系統整合多種技術和服務:

- **向量資料庫**: Pinecone 用於儲存和檢索向量嵌入
- **文本嵌入**: 通過 Cohere API 將文本轉換為向量
- **部署環境**: Cloudflare Workers 提供全球分布式運行環境
- **資料處理**: 自定義邏輯處理文檔分塊和向量轉換

## 主要功能端點

1. **`/api/vector-search`**
   - 向量搜尋 API，基於用戶查詢返回相關問答對
   - 支援類別和重要性過濾

2. **`/api/chat`**
   - 聊天對話處理，整合向量搜尋增強回答

3. **`/api/faq`**
   - FAQ 服務，快速檢索常見問題的答案

4. **`/api/upload`**
   - 資料上傳處理，支援新增問答對到向量資料庫

5. **`/api/health`**
   - 健康檢查端點，監控系統狀態

## 系統流程

1. **資料流程**:
   - 客戶端發送請求至 Cloudflare Worker
   - Worker 直接處理請求 (例如向量搜尋) 或調用其他服務 (如 Groq)。對於資料上傳等任務，可能會間接觸發 Python API。
   - Worker 返回處理後的結果給客戶端

2. **向量搜尋流程 (由 Cloudflare Worker 處理)**:
   - Worker 接收用戶查詢 (`/api/vector-search`)
   - Worker 調用嵌入服務 (`src/services/embedding.ts`) 通過 Cohere 生成查詢嵌入
   - Worker 調用 Pinecone 服務 (`src/services/pinecone.ts`) 在 Pinecone 中搜尋相似向量
   - Worker 過濾、排序結果
   - Worker 返回相關問答對給客戶端

## 未來引入 LlamaIndex 的好處

目前系統使用自定義邏輯和直接 API 調用來實現向量搜索。引入 LlamaIndex 框架將帶來以下顯著好處:

### 1. 高級資料檢索能力

- **智能分塊處理**:
  - 自動將長文本分割成最佳尺寸的區塊
  - 提供語義分塊，而非簡單固定長度切分
  - 保留文檔結構與上下文關聯

- **進階檢索策略**:
  - 支援多種檢索模式（向量搜尋、關鍵詞搜尋、混合搜尋等）
  - 自動選擇最佳檢索策略
  - 提供檢索結果重排機制，提高相關性

- **向量數據庫自動管理**:
  - 簡化向量存儲過程，自動處理索引創建
  - 提供資料持久化機制，避免重複索引

### 2. 資料處理流程優化

- **完整 RAG 管道**:
  - 一站式處理從資料載入、分塊、嵌入到檢索的全流程
  - 提供內建評估工具，易於優化和改進

- **擴展性與互操作性**:
  - 支援 160+ 資料來源連接器
  - 與現有 Pinecone、Cohere 等服務無縫整合

- **元數據管理**:
  - 自動提取和增強元數據
  - 提供基於元數據的過濾和查詢功能

### 3. 開發效率提升

- **開發速度加快**:
  - 資料管道設定時間從週級縮短至小時級
  - 提供高級 API 簡化常見操作

- **複雜需求處理**:
  - 支援多模態數據（文本、圖像、表格等）
  - 提供複雜查詢處理（如層次化檢索、遞迴檢索）

- **程式碼量減少**:
  - 當前自定義代碼可能需要 100+ 行
  - 使用 LlamaIndex 有時僅需 10-20 行代碼

## 改進方向

### 短期改進計劃

1. **解決命名空間混淆**:
   - 將 `llama_index` 目錄重命名為更合適的名稱，如 `vector_api` 或 `qa_service`
   - 避免與實際 LlamaIndex 包混淆

2. **技術統一**:
   - 考慮將 Python API 服務遷移到 Node.js/TypeScript
   - 使用 LangChainJS 或 LlamaIndex.js 替代當前實現

3. **架構優化**:
   - 明確 Cloudflare Worker 和後端 API 的職責分工
   - 改進錯誤處理和日誌記錄

4. **消除代碼重複**:
   - 重構 `handleVectorSearch` 函數，避免多個檔案中的重複實現
   - 創建共享的請求處理元件，統一處理 CORS、請求驗證和回應格式
   - 建立統一的服務注入模式，避免服務實例化的重複代碼

5. **效能優化**:
   - 實現向量嵌入的快取機制，避免重複生成相同查詢的嵌入
   - 集中環境變數驗證，在系統啟動時一次性檢查
   - 優化 Pinecone 客戶端初始化，避免每個請求都重新創建

6. **框架整合**:
   - 考慮使用 Express.js + TypeScript，改善開發體驗和維護性
   - 可使用 `workers-adapter-express` 在 Cloudflare Workers 上運行 Express
   - 或考慮使用 Hono 框架替代，獲得更好的 Cloudflare Workers 原生支援

### 中期改進計劃

1. **引入 LlamaIndex**:
   - 逐步替換自定義向量搜索邏輯
   - 使用 LlamaIndex 的高級檢索功能

2. **優化向量資料庫**:
   - 考慮從 Pinecone 遷移到 Weaviate，提升性能並降低成本
   - 實現更高效的索引結構

3. **增強 RAG 功能**:
   - 實現混合檢索策略
   - 添加檢索結果重排序功能

4. **改善開發體驗**:
   - 引入熱重載功能，加快本地開發迭代速度
   - 實現更完善的測試架構，包括單元測試和集成測試
   - 添加自動化 CI/CD 流程，確保代碼質量

5. **混合架構設計**:
   - 採用 Express.js 處理複雜業務邏輯和數據處理
   - 保留 Cloudflare Workers 作為 API 網關和 CDN 層
   - 使用 Docker 實現部署一致性和環境隔離

### 長期改進計劃

1. **完整架構現代化**:
   - 遷移到統一的技術堆棧，全面採用 TypeScript
   - 建立更靈活的微服務架構
   - 實現高可用性和災難恢復機制

2. **進階 RAG 技術**:
   - 實現多步驟檢索、查詢轉化等高級功能
   - 加入自動評估和持續優化機制
   - 引入語意緩存，提高相似問題的回應速度

3. **可視化和管理工具**:
   - 開發系統管理界面，監控系統狀態和效能
   - 提供數據索引和查詢分析工具
   - 建立儀表板追踪關鍵指標和使用模式

4. **高級數據處理**:
   - 實現自適應文本分塊策略，根據內容複雜度動態調整
   - 添加多模態支持，處理圖像、音頻等非文本數據
   - 開發定制化的領域特定嵌入模型，提高領域相關性

## 部署說明

詳細部署流程請參閱 `DEPLOYMENT.md` 文件，其中包含:
- Cloudflare Worker 部署步驟
- Python API 服務部署說明
- 環境變數配置指南
- 故障排除指南

## 環境變數

系統需要配置以下關鍵環境變數:

### Cloudflare Worker 環境變數
- `PINECONE_API_KEY`: Pinecone API 金鑰
- `PINECONE_ENVIRONMENT`: Pinecone 環境設定
- `PINECONE_INDEX`: Pinecone 索引名稱
- `COHERE_API_KEY`: Cohere API 金鑰
- `PYTHON_API_URL`: Python API 服務的基礎 URL (可選)

### Python API 環境變數
- `PINECONE_API_KEY`: Pinecone API 金鑰
- `PINECONE_ENVIRONMENT`: Pinecone 環境設定
- `PINECONE_INDEX`: Pinecone 索引名稱
- `COHERE_API_KEY`: Cohere API 金鑰
- `API_PORT`: API 服務監聽端口
- `API_HOST`: API 服務監聽地址

## 開發指南

### 本地開發環境設置

1. **Cloudflare Worker 開發**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Python API 開發**:
   ```bash
   cd backend/llama_index
   pip install -r requirements.txt
   python api_server.py
   ```

### 資料處理流程

1. 準備問答資料 JSON 檔案
2. 使用 `process_qa_data.py` 處理資料並上傳到 Pinecone
3. 通過 API 端點查詢和檢索資料

## 運維說明

### 監控
- Cloudflare Worker 監控: Cloudflare Dashboard
- Python API 監控: 系統日誌和自定義指標

### 擴展性
系統設計支援橫向擴展:
- Cloudflare Worker 自動擴展
- Python API 可部署多實例

## 參考資源

- [Pinecone 文檔](https://docs.pinecone.io/)
- [Cohere 文檔](https://docs.cohere.com/)
- [LlamaIndex 文檔](https://docs.llamaindex.ai/)
- [Cloudflare Workers 文檔](https://developers.cloudflare.com/workers/) 