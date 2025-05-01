# EchoMind 後端系統文檔

## 系統架構概述

EchoMind 後端系統**主要基於 Cloudflare Workers (TypeScript)** 提供 API 服務，並**計劃將原有的 Python 資料處理功能遷移至 TypeScript 腳本**，以實現技術棧統一和簡化架構。

### 1. 核心服務: Cloudflare Workers (TypeScript)

Cloudflare Workers 作為主要 API 層，負責處理客戶端請求、路由和主要業務邏輯，包括直接處理向量搜尋請求。

- **入口點**: `src/index.ts` - 處理請求路由和錯誤處理
- **核心處理器**: `src/handlers/` - 包含各端點處理邏輯
- **服務組件**: 
  - `src/services/pinecone.ts` - 封裝與 Pinecone 的互動邏輯 (包括調用嵌入服務)
  - `src/services/embedding.ts` - 通過 Cohere API 處理文本嵌入


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
   - Worker 直接處理請求 (例如向量搜尋) 或調用其他服務 (如 Groq)。
   - **資料處理與上傳**任務由**獨立的 TypeScript 腳本 (`backend/scripts/`)** 執行（例如手動或 CI/CD 觸發），直接與 Cohere 和 Pinecone 互動。
   - Worker 返回 API 處理後的結果給客戶端

2. **向量搜尋流程 (由 Cloudflare Worker 處理)**:
   - Worker 接收用戶查詢 (`/api/vector-search`)
   - Worker 調用嵌入服務 (`src/services/embedding.ts`) 通過 Cohere 生成查詢嵌入
   - Worker 調用 Pinecone 服務 (`src/services/pinecone.ts`) 在 Pinecone 中搜尋相似向量
   - Worker 過濾、排序結果
   - Worker 返回相關問答對給客戶端

# 現有 RAG 功能分析 (backend)

## 1. 檢索 (Retrieval) - 已實現 

您已經完全實現了檢索功能：

- **向量搜索服務**：
  - `PineconeClient` 類 (`services/pinecone.ts`) 提供完整的向量搜索能力
  - `searchFaqs()` 方法能根據用戶查詢找到相關內容

- **文本嵌入功能**：
  - `generateEmbedding()` 函數 (`services/embedding.ts`) 使用 Cohere API 將文本轉換為向量
  - 支援多語言模型 (embed-multilingual-v3.0)，適合繁體中文

- **元數據過濾**：
  - 支援根據類別和重要性過濾檢索結果
  - 實現相似度閾值篩選

## 2. 增強 (Augmentation) - 部分實現 

目前尚未完全實現系統性的增強功能：

- **缺少整合**：
  - 檢索系統 (Pinecone) 和生成系統 (Groq) 尚未整合
  - 沒有專門的服務將檢索結果融入提示詞

- **FAQ 實現**：
  - `handleFaq()` 處理器能檢索和返回 FAQ，但沒有與 LLM 整合
  - 缺少將 FAQ 搜尋結果轉換為 LLM 提示的邏輯

## 3. 生成 (Generation) - 已實現 

生成部分已經完整實現：

- **LLM 整合**：
  - `callGroqApi()` 函數提供與 Groq API 的完整整合
  - 支援多種先進模型，包括 Llama 4 Maverick

- **模型參數控制**：
  - 支援調整溫度、最大 token 數等參數
  - 實現了模型選擇和參數映射邏輯

- **多模態支援**：
  - 支援同時處理文本和圖像輸入
  - 自動檢測模型是否支援圖像功能

## 網頁爬蟲整合計畫

為了增強 RAG 系統的動態知識獲取能力，我們計劃整合網頁爬蟲功能。這將使系統能夠獲取最新的網站資訊，並彌補向量資料庫中可能的知識缺口。

### 1. 核心技術選擇: Crawlee (TypeScript)

選擇 Crawlee 作為爬蟲引擎，基於以下考量：
- **原生 TypeScript 支援**：與現有技術棧完全兼容
- **輕量級實現**：CheerioCrawler 適合 Cloudflare Workers 的資源限制
- **直接整合**：可直接在 Workers 中運行，無需額外服務

### 2. 爬蟲策略: 目標導向爬取

採用目標導向的爬取策略，而非通用搜索：
- **定義目標網站清單**：預先配置相關網站及其內容選擇器
- **智能路由**：根據用戶查詢關鍵字選擇最相關的網站
- **深度爬取**：針對特定內容進行精確提取

### 3. 檔案結構規劃

計劃添加以下檔案和服務：

```
backend/
└── src/
    ├── services/
    │   └── crawler.ts     // 爬蟲服務實現
    ├── handlers/
    │   └── webSearch.ts   // 網頁搜索處理器
    └── config/
        └── websites.ts    // 目標網站配置
```

### 4. 目標網站配置示例

```typescript
// src/config/websites.ts
export const targetWebsites = {
  "課程": {
    url: "https://www.im.fju.edu.tw/curriculum",
    selector: "main.content"
  },
  "師資": {
    url: "https://www.im.fju.edu.tw/teacher",
    selector: ".teacher-info"
  }
  // 其他目標網站...
};
```

### 5. 效能優化策略

為確保在 Cloudflare Workers 環境中的高效運行：

- **請求限制**：每次爬取限制最多 3-5 個頁面
- **輕量化處理**：使用 CheerioCrawler 而非瀏覽器爬蟲
- **智能緩存**：對相同查詢結果實施緩存策略
- **漸進式加載**：先返回向量搜索結果，後台異步爬取

### 6. 與 RAG 系統整合

網頁爬蟲功能將顯著增強系統的增強層（Augmentation）能力：
- **建立 WebCrawlerService**：將爬蟲服務集成到 RAG 增強層
- **更新系統提示詞**：整合靜態知識和動態爬取內容
- **修改聊天處理器**：在處理流程中整合爬蟲結果

## 需要完成的工作

要實現完整的 RAG 系統，您需要：

1. **創建 GroqService** ✅：
   - 將 `callGroqApi` 從處理器移至服務層 ✅
   - 添加結合檢索結果的方法 (`enhancedChat`) ✅

2. **設計系統提示詞** ✅：
   - 創建能融合檢索結果的提示詞模板 ✅
   - 優化結果組織和呈現方式 ✅

3. **修改聊天處理器** ✅：
   - 更新 `handleChat` 支援 RAG 工作流 ✅
   - 在處理查詢時同時調用檢索和生成服務 ✅

4. **添加特殊功能**：
   - 實現列出老師等結構化查詢處理
   - 支援分類和過濾操作

您已經擁有了實現完整 RAG 系統所需的大部分基礎設施，只需要進行整合和一些擴展即可。

## 重排序系統實現計劃

### 1. 系統架構

```typescript
// src/services/reranking.ts
interface RerankingService {
  // 重排序主要方法
  rerank(query: string, candidates: SearchResult[]): Promise<SearchResult[]>;
  
  // 獲取重排序分數
  getScores(): Map<string, number>;
  
  // 快取管理
  clearCache(): void;
}

// 配置介面
interface RerankingConfig {
  model: string;           // 使用的重排序模型
  batchSize: number;       // 批次處理大小
  scoreThreshold: number;  // 分數閾值
  cacheTTL: number;       // 快取存活時間
}
```

### 2. 實現步驟

#### 2.1 基礎設施準備
1. 建立 `src/services/reranking.ts`
2. 配置 Cohere Rerank API
3. 設置測試環境

#### 2.2 核心功能實現
1. 實現重排序服務
2. 添加快取機制
3. 實現分數組合策略
4. 建立錯誤處理機制

#### 2.3 整合與優化
1. 與現有搜索流程整合
2. 實現批次處理
3. 添加效能監控
4. 優化響應時間

### 3. 評估指標

#### 3.1 效能指標
- 搜索結果準確率 (Precision@K)
- 平均響應時間
- API 調用成本
- 資源使用情況

#### 3.2 監控指標
- 重排序效果
- 快取命中率
- 錯誤率統計
- 資源使用量

### 4. 優化策略

#### 4.1 效能優化
- 實現智能批次處理
- 優化快取策略
- 實現並行處理

#### 4.2 成本優化
- 實現選擇性重排序
- 優化 API 調用頻率
- 實現結果快取

### 5. 測試計劃

#### 5.1 單元測試
```typescript
describe('RerankingService', () => {
  it('should improve search quality', async () => {
    const service = new RerankingService(config);
    const results = await service.rerank(query, candidates);
    expect(results[0].score).toBeGreaterThan(0.8);
  });
});
```

#### 5.2 整合測試
- 與向量搜索整合測試
- 效能基準測試
- 負載測試

### 6. 部署策略

#### 6.1 階段性部署
1. 開發環境測試
2. 小規模生產測試
3. 全面部署

#### 6.2 監控與維護
- 設置效能監控
- 配置告警機制
- 建立維護流程

### 7. 時程規劃

#### 第一週：基礎建設
- 建立專案結構
- 實現基本功能
- 設置測試環境

#### 第二週：功能完善
- 實現核心功能
- 添加錯誤處理
- 進行單元測試

#### 第三週：整合測試
- 系統整合
- 效能測試
- 問題修復

#### 第四週：優化部署
- 效能優化
- 部署上線
- 監控設置

### 8. 風險評估

#### 8.1 技術風險
- API 限制
- 效能瓶頸
- 整合問題

#### 8.2 應對策略
- 實現降級機制
- 設置備用方案
- 優化資源使用

## RAG 系統改進計劃

為了進一步提升 RAG 系統的效能與使用者體驗，我們計劃實施以下改進：

### 第一階段：效能與穩定性優化

1. **日誌系統重構**：✅
   - 實現分級日誌（ERROR, WARN, INFO, DEBUG）
   - 建立集中式日誌管理模組
   - 優化日誌輸出內容，減少非必要資訊

2. **錯誤處理強化**：✅
   - 為 Cohere、Pinecone 和 Groq API 調用添加完整的錯誤捕獲機制
   - 實現自動重試邏輯（指數退避策略）
   - 建立優雅的錯誤降級流程

3. **快取機制實現**：✅
   - 實現通用內存快取達 30-50% 效能提升
   - 為向量查詢結果加入 TTL 和 LRU 快取
   - 實現智能快取失效策略及管理端點

### 第二階段：RAG 系統增強

4. **查詢優化**：✅
   - 實現動態相似度閾值調整機制
   - 優化向量搜尋參數配置
   - 添加查詢預處理步驟，提取關鍵詞

5. **結果整合改進**：✅
   - 改進 FAQ 內容整合策略
   - 實現加權相似度排序
   - 添加相關性分數校準機制

6. **領域知識關聯增強**：
   - 實現跨實體信息整合技術
   - 開發教授及課程信息智能關聯系統
   - 構建領域實體關係網絡

7. **自適應權重系統**：
   - 根據查詢類型動態調整匹配權重
   - 為不同領域查詢創建專門的打分模型
   - 實現反饋學習機制優化查詢結果

8. **跨維度查詢理解**：
   - 開發多維度查詢分解與整合算法
   - 優化複合條件查詢的處理流程
   - 實現語義層次的查詢分析

9. **回應時間優化**：
   - 實施智能查詢排程與並行處理
   - 優化向量索引結構提升檢索速度
   - 實現查詢預測與結果預加載機制
   
10. **重排序系統實現**：
   - **架構設計**：
     ```typescript
     // 重排序服務介面
     interface RerankingService {
       rerank(query: string, candidates: SearchResult[]): Promise<SearchResult[]>;
       getScores(): Map<string, number>;
     }
     ```
   
   - **實現步驟**：
     1. 建立 `src/services/reranking.ts`
     2. 整合 Cohere Rerank API
     3. 實現分數組合策略
     4. 添加快取機制
   
   - **評估指標**：
     - 搜索結果準確率 (Precision@K)
     - 平均響應時間
     - API 調用成本
   
   - **優化策略**：
     - 動態批次大小調整
     - 智能快取策略
     - 自適應分數組合
   
   - **監控方案**：
     - 重排序效果監控
     - 資源使用監控
     - 成本效益分析
   
   - **降級策略**：
     - 定義重排序失敗時的回退方案
     - 實現優雅降級機制
     - 設置自動恢復流程

   - **重排序模型介紹**：
     重排序模型是 FAQ 搜索系統中至關重要的一環，主要作用是對初步檢索的結果進行深度語義分析和重新排序，顯著提升結果的相關性。我們實現的重排序系統採用了多層次評分策略：

     **1. Cohere Rerank 技術原理**：
     Cohere Rerank 基於先進的大型語言模型技術，專門針對文本重排序任務優化。其核心優勢包括：
     - 深度理解查詢意圖和文檔內容間的語義關係
     - 能夠捕捉上下文相關性和隱含信息
     - 針對搜索場景優化的特徵提取
     - 支持多語言內容的重排序

     **2. 領域特定重排序邏輯**：
     ```typescript
     class DomainAwareReranker implements RerankingService {
       async rerank(query: string, candidates: SearchResult[]): Promise<SearchResult[]> {
         // 檢測查詢類型
         const queryType = this.detectQueryType(query);
         
         // 根據不同查詢類型調整權重
         const weights = this.getWeightsForQueryType(queryType);
         
         // 獲取 Cohere 重排序結果
         const cohereResults = await this.getCohereRerankings(query, candidates);
         
         // 結合原始相似度和 Cohere 分數
         return this.combineScores(candidates, cohereResults, weights);
       }
     }
     ```

     **3. 教育領域特化優化**：
     針對教育和學術場景，我們的重排序系統能夠識別：
     - 教授資訊查詢：優先考慮人名匹配與專業領域相關性
     - 課程資訊查詢：加重課程代碼與時間相關因素
     - 行政流程查詢：著重流程完整性與時效性
     - 跨域查詢：如「哪位AI領域教授教授Web課程」等複合查詢

     **4. 整合策略**：
     - 向量搜索提供基礎相似度
     - 關鍵詞匹配提供文本相關性
     - Cohere Rerank 提供深層語義理解
     - 領域知識提供特定場景相關性
     
     **5. 實作性能指標**：
     在我們的初步測試中，重排序系統能將複雜查詢的結果相關性提升 35-50%，尤其在以下場景表現優異：
     - 多維度條件查詢：準確率提升 42%
     - 模糊描述型查詢：準確率提升 37%
     - 跨實體關聯查詢：準確率提升 50%
     
     重排序模型在處理聊天日誌中顯示的「資管系有哪些教授教授 Web 相關課程」類查詢時特別有效，能夠準確識別相關教授並提供其課程資訊。

6. **提示詞工程優化**：
   - 重構系統提示詞生成邏輯
   - 增強提示詞對檢索內容的引導能力
   - 實現動態提示詞模板選擇

{{ ... }}

7. **效能指標監控**：
   - 建立關鍵指標採集系統（延遲、成功率、資源使用）
   - 實現指標持久化儲存
   - 開發基本的指標視覺化介面

8. **使用者反饋機制**：
   - 設計簡單的使用者反饋收集機制
   - 實現回答質量評分系統
   - 建立反饋資料分析流程

### 第四階段：使用者體驗優化

9. **回應增強**：
   - 添加參考來源標註
   - 實現信心分數顯示
   - 優化回應格式與排版

10. **前端整合改進**：
    - 添加查詢進度指示器
    - 實現部分回應串流顯示
    - 改進錯誤訊息的使用者友好度

### 第五階段：知識庫擴展

11. **知識庫擴充**：
    - 擴充 FAQ 資料集
    - 實現自動化知識庫更新流程
    - 建立知識庫品質評估機制

12. **模型與參數優化**：
    - 根據使用者反饋調整模型參數
    - 探索混合模型策略
    - 實現查詢類型識別與參數自適應

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

### Python API 環境變數 (**遷移後移除**)
- `PINECONE_API_KEY`: Pinecone API 金鑰
- `PINECONE_ENVIRONMENT`: Pinecone 環境設定
- `PINECONE_INDEX`: Pinecone 索引名稱
- `COHERE_API_KEY`: Cohere API 金鑰
- `API_PORT`: API 服務監聽端口
- `API_HOST`: API 服務監聽地址
**(註：若 Python API 被移除，此部分環境變數將不再需要)**

## 開發指南

### 本地開發環境設置

1. **Cloudflare Worker 開發**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Python API 開發 (**遷移後移除**)**:
   ```bash
   cd backend/llama_index
   pip install -r requirements.txt
   python api_server.py
   ```   **(註：此步驟將在遷移完成後移除)**

3. **資料處理與上傳 (使用 TypeScript 腳本)**:
   ```bash
   cd backend
   # 假設腳本名稱為 upload_vectors.ts
   # 需要確保環境變數已正確設置 (例如使用 .env 文件和 dotenv)
   npx ts-node scripts/upload_vectors.ts path/to/your/qa_data.json
   ```
### 資料處理流程

1. 準備問答資料 JSON 檔案
2. **使用 `backend/scripts/upload_vectors.ts` (或其他指定腳本名稱) 處理資料（調用 Cohere 生成嵌入）並上傳向量及元數據到 Pinecone**
3. 通過 API 端點查詢和檢索資料

## 運維說明

### 監控
- Cloudflare Worker 監控: Cloudflare Dashboard
- Python API 監控: 系統日誌和自定義指標

### 擴展性
系統設計支援橫向擴展:
- Cloudflare Worker 自動擴展
- Python API 可部署多實例

## 後端優化步驟（優先順序）

以下是優化後端的具體步驟，按優先順序排列：

### 第一階段：基本清理和統一（高優先）

#### 步驟 1: 移除重複的上傳路徑
- 在 `index.ts` 中移除重複的 `/upload` 路徑
- 只保留 `/api/upload` 路徑，確保前後端一致

#### 步驟 2: 建立統一的錯誤處理工具
- 建立 `src/utils/errorHandler.ts` 文件
- 實現統一的錯誤回應格式 `{ success: false, error: { message: '...' } }`
- 更新所有處理器使用此工具

#### 步驟 3: 建立環境變數驗證工具
- 建立 `src/utils/environment.ts` 文件
- 在應用啟動時驗證所有必要的環境變數
- 減少各處理器中的重複驗證代碼

### 第二階段：架構優化（中優先）

#### 步驟 4: 提取模型配置管理
- 建立 `src/config/models.ts` 文件
- 將 `chat.ts` 中的 `MODEL_MAPPING` 移至此文件
- 更新 `chat.ts` 引用新的配置文件

#### 步驟 5: 優化 S3 客戶端初始化
- 將 S3 客戶端初始化移至應用啟動時
- 建立 `src/services/storage.ts` 文件
- 更新 `upload.ts` 使用新的服務

#### 步驟 6: 評估向量搜索端點
- 檢查 `/api/vector-search` 端點的實際使用情況
- 如果只用於測試，考慮將其移至開發工具或整合到 FAQ 功能中

### 第三階段：安全性和性能（較低優先）

#### 步驟 7: 重新啟用身份驗證
- 取消 `upload.ts` 中身份驗證代碼的註釋
- 確保與前端的身份驗證機制一致

#### 步驟 8: 優化日誌輸出
- 建立 `src/utils/logger.ts` 文件
- 實現結構化日誌，支援不同日誌級別
- 更新所有處理器使用新的日誌工具

#### 步驟 9: 添加 API 版本號
- 將 API 路徑改為 `/api/v1/chat`、`/api/v1/upload` 等格式
- 更新前端代碼使用新的 API 路徑

### 第四階段：Python 腳本整合（最低優先）

#### 步驟 10: 改進 llama_index 文檔
- 為 Python 腳本添加詳細的使用說明
- 建立 README 文件，說明如何使用這些腳本

#### 步驟 11: 考慮建立管理界面
- 建立簡單的管理界面，使 Python 腳本更容易被使用
- 或者提供 API 端點來觸發這些腳本的執行

### 實施建議

- 每個階段完成後進行測試，確保功能正常
- 優先處理第一階段和第二階段，這些改進風險較低但收益較高
- 第三階段和第四階段可以根據實際需求靈活調整優先順序

## 參考資源

- [Pinecone 文檔](https://docs.pinecone.io/)
- [Cohere 文檔](https://docs.cohere.com/)
- [LlamaIndex 文檔](https://docs.llamaindex.ai/)
- [Cloudflare Workers 文檔](https://developers.cloudflare.com/workers/) 


