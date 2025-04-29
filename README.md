 graph TD
    R26((26 - 根節點)) --> N10((10 - 內部節點))
    R26 --> N16((16 - 內部節點))

    %% 左子樹 (Left Subtree)
    N10 --> N6L((6 - 內部節點))
    N10 --> N4L((4 - 內部節點))
    N6L --> LI(I (3) - 葉節點)
    N6L --> N3((3 - 內部節點 *Err1*))
    N3 --> LF(F (1) - 葉節點)
    N3 --> LO(O (1) - 葉節點)
    N4L --> N2L((2 - 內部節點 *Err2*))
    N4L --> LN(N (2) - 葉節點)
    N2L --> LF2(F (1) - 葉節點 *Err2*)
    N2L --> LO2(O (1) - 葉節點 *Err2*)

    %% 右子樹 (Right Subtree - 依照視覺連接繪製)
    N16 --> N6R((6 - 內部節點))
    N16 --> N8R((8 - 內部節點))
    N6R --> N4R1((4 - 內部節點))
    N6R --> N2R1((2 - 內部節點)) %% 視覺上 C(2) 是其子節點
    N4R1 --> LA(A (1) - 葉節點)
    N4R1 --> LR(R (1) - 葉節點)
    N2R1 --> LC(C (2) - 葉節點) %% 將 C(2) 作為此節點的葉子
    N8R --> N4R2((4 - 內部節點))
    N8R --> N4R3((4 - 內部節點))
    N4R2 --> LU(U (2) - 葉節點)
    N4R2 --> LE(E (2) - 葉節點)
    N4R3 --> N2R2((2 - 內部節點))
    N4R3 --> N2R3((2 - 內部節點))
    N2R2 --> LS(S (1) - 葉節點)
    N2R2 --> LV(V (1) - 葉節點)
    N2R3 --> LH(H (1) - 葉節點)
    N2R3 --> LY(Y (1) - 葉節點)
    %% T(2) 未在圖示結構中顯示

    subgraph 圖例與註記 (Legend & Notes)
        direction TB
        Note0("所有標有數字的圓圈為內部節點或根節點")
        Note0b("所有標有字母(頻率)的圓圈為葉節點")
        Note1("*Err1: 內部節點 3 的子節點 F(1)+O(1) 頻率和為 2，不等於 3")
        Note2("*Err2: 內部節點 2 下方疑似重複了 F 和 O，且 N(2)+2 = 4？ 結構或標示存疑")
        Note3("T(2) 被列為資料，但在圖示的樹狀結構連接中找不到")
        Note4("根節點 26 與所有葉節點頻率總和 (25) 不符")
    end
# EchoMind2

EchoMind2 是一個專為輔仁大學資訊管理學系（輔大資管）同學設計的 AI 智能學習助手，結合向量檢索技術，幫助同學們快速查詢課業相關問題與解答。本系統旨在解決學習過程中的疑難困惑，讓資管專業知識的獲取更加高效與智能化。

### 核心目標

- **輔大資管專業問答**：快速解答程式設計、資料庫管理、系統分析與設計等資管專業問題
- **學習資源整合**：匯集課程內容、實用資源和學習指南，提供一站式學習平台
- **課業疑難排解**：針對常見課業困惑提供詳細解析和範例說明
- **知識體系建構**：幫助同學系統性理解資管專業知識架構
- **紓解學習壓力**：提供輕鬆休閒的小遊戲，幫助同學在學習之餘放鬆心情
- **促進交流互動**：透過匿名留言板功能，建立友善的學習社群環境

### 主要功能

- **智能問答系統**：基於 Cohere 嵌入技術和 Pinecone 向量資料庫的語意化檢索
- **個人學習助手**：支援課程筆記、作業指導和知識整理
- **學科知識圖譜**：視覺化呈現資管專業知識之間的關聯
- **全文檢索**：快速找到與課業相關的重要資訊
- **AI 輔助學習**：自動推薦相關學習資源和延伸閱讀
- **紓壓小遊戲**：內建多款輕鬆有趣的小遊戲，幫助同學舒緩學習壓力
- **匿名留言板**：讓同學可以自由交流學習心得、課程體驗和生活感想

### 技術亮點

EchoMind2 使用先進的人工智慧和語言處理技術，結合向量搜尋功能，實現精確的知識檢索和智能推薦。系統根據輔大資管課程內容進行優化，能夠理解同學的查詢意圖，並從知識庫中找出最相關的解答，即使查詢與資料庫中的內容表述不完全一致。

## 專案架構

該專案使用前後端分離的架構：

- **前端**：
  - 使用 Next.js + TypeScript + TailwindCSS 構建的現代化網頁應用
  - 響應式設計，支援桌面和移動設備
  - 直覺的用戶界面，優化知識管理體驗

- **後端**：
  - 使用 Cloudflare Workers 部署的高性能 API 服務
  - 無伺服器架構，保證系統穩定性和可擴展性
  - 使用 Cohere 進行文本嵌入處理
  - 採用 Pinecone 作為向量資料庫，支援高效的語意搜尋

- **向量搜尋**：
  - 使用 Cohere 的多語言嵌入模型支援中英文內容
  - Pinecone 向量資料庫提供毫秒級查詢速度
  - 自定義處理流程，優化問答結果相關性

## 最近更新

### 圖片上傳功能 (2025-04-11)

- **多模態輸入支援**：
  - 新增對 meta-llama/llama-4-maverick-17b-128e-instruct 模型的支援，實現圖像理解功能
  - 使用者可以在選擇 Maverick 模型時上傳圖片，與 AI 進行基於圖像的對話
  - 優化的圖片上傳界面，採用類似 Grok 的內嵌式縮圖設計

- **前端改進**：
  - 在 ChatInput 組件中添加圖片上傳按鈕和預覽功能
  - 在 ChatMessageList 中顯示用戶上傳的圖片
  - 使用 base64 編碼處理圖片資料，確保跨平台兼容性

- **後端整合**：
  - 修改 API 處理邏輯，支援圖片和文字的混合輸入
  - 優化與 Groq API 的整合，確保正確的圖片格式傳輸
  - 部署到 Cloudflare Workers，提供高效的圖片處理能力

## 本地開發設置

### 前提條件

- Node.js 18+
- npm 或 yarn
- Cloudflare 帳戶（用於後端部署）
- Cohere API 金鑰（用於文本嵌入處理）
- Pinecone 帳戶與 API 金鑰（用於向量資料庫服務）
- Python 3.8+（用於向量搜尋功能）

### 安裝

1. 克隆儲存庫
```bash
git clone https://github.com/yourusername/echomind2.git
cd echomind2
```

2. 安裝依賴
```bash
npm run setup
```

3. 配置環境變數
```bash
# 前端環境變數
cp frontend/.env.example frontend/.env.local
# 後端環境變數
cp backend/.env.example backend/.env
# 向量搜尋環境變數
cp backend/llama_index/.env.example backend/llama_index/.env
```

編輯環境變數文件，填入必要的 API 金鑰和配置：

- `.env.local`：配置前端 API 路徑和公開變數
- `.env`：設定 Cloudflare 和後端相關密鑰
- `llama_index/.env`：設定 Cohere API 金鑰和 Pinecone 相關配置

4. 安裝向量搜尋依賴
```bash
cd backend/llama_index
pip install -r requirements.txt
cd ../..
```

### 啟動開發伺服器

同時啟動前端和後端：
```bash
npm run dev
```

或單獨啟動：
```bash
# 僅前端
npm run frontend:dev

# 僅後端
npm run backend:dev
```

## 向量搜尋功能設置

EchoMind2 使用 Cohere 和 Pinecone 實現強大的向量搜索功能，特別針對輔大資管的課程內容進行了優化：

1. 處理資管課程問答資料集
```bash
cd backend/llama_index
python process_qa_data.py --file qa_data_sample.json
```

2. 測試向量搜尋課業問題
```bash
python query_qa.py "輔大資管常用的程式語言有哪些？"
```

3. 進階搜尋選項
```bash
# 指定返回結果數量
python query_qa.py "Python 在資管系有什麼應用" --top-k 3

# 按學科類別過濾
python query_qa.py "資料庫管理基礎" --category "資料庫管理"

# 按重要程度過濾（5分為核心課程內容）
python query_qa.py "程式設計入門" --min-importance 4
```

## 主要功能使用

1. **課業問題查詢**：輸入資管相關專業問題，獲得精確答案
2. **學習資源探索**：發現與課程主題相關的學習資料和參考資源
3. **知識關聯瀏覽**：了解不同資管學科知識點之間的連接和關係
4. **專業詞彙解釋**：快速查詢資管專業術語和概念的解釋
5. **紓壓小遊戲**：玩簡單有趣的遊戲，在學習疲勞時轉換心情
6. **匿名交流**：在留言板分享想法，不必擔心身份暴露的壓力

## 紓壓小遊戲平台

EchoMind2 內建多款適合短時間休息的小遊戲，幫助同學在緊張的學習過程中放鬆心情：

- **記憶力遊戲**：訓練記憶力的卡片配對遊戲
- **數獨益智**：鍛煉邏輯思維的數字謎題
- **簡易貪食蛇**：經典的休閒小遊戲
- **程式碼猜謎**：結合資管專業知識的編程小測驗
- **敲擊節奏**：音樂節奏遊戲，紓解壓力

遊戲平台的特點：
- 不需額外安裝，直接在瀏覽器中玩
- 遊戲時間短，適合課間休息
- 可記錄個人最高分，追蹤進步
- 定期更新新遊戲內容

## 匿名留言板功能

匿名留言板為輔大資管同學提供一個自由表達的空間：

- **完全匿名**：無需實名，保護同學隱私
- **分類討論**：按課程、學習資源、心得交流等分類
- **問題互助**：同學間互相解答課程難題
- **資源分享**：分享筆記、參考資料和學習技巧
- **情緒支持**：分享學習壓力和困惑，獲得同理支持

留言板管理：
- 基本內容審核，確保討論環境健康友善
- 違規內容自動過濾機制
- 熱門話題置頂功能
- 可附加圖片和程式碼片段

## 應用場景

- **課前預習**：提前了解即將學習的課程內容和關鍵概念
- **課後複習**：鞏固課堂知識，解答學習中的疑惑
- **作業協助**：獲取解題思路和相關知識點指導
- **考試準備**：系統性回顧重要概念和典型問題
- **課間休息**：享受紓壓小遊戲，放鬆緊繃的學習情緒
- **社群互動**：在匿名留言板分享學習經驗，獲取同儕支持和建議

## 部署

### 前端

構建並部署前端：
```bash
npm run frontend:build
```

將生成的靜態文件部署到您選擇的托管服務（如 Vercel、Netlify 或 GitHub Pages）。

### 後端

部署到 Cloudflare Workers 暫存環境：
```bash
npm run backend:deploy
```

部署到 Cloudflare Workers 生產環境：
```bash
npm run backend:deploy:production
```

### 向量索引部署

1. 在生產環境中設置 Pinecone 索引
2. 使用處理腳本上傳向量資料：
```bash
cd backend/llama_index
python process_qa_data.py --file your_production_data.json
```

## 專案結構

```
echomind2/
├── frontend/          # Next.js 前端應用
│   ├── app/           # 頁面路由
│   │   ├── dashboard/ # 使用者儀表板
│   │   ├── search/    # 搜索界面
│   │   ├── games/     # 紓壓小遊戲
│   │   ├── board/     # 匿名留言板
│   │   └── settings/  # 設定頁面
│   ├── components/    # UI 元件
│   ├── lib/           # 共用函數和工具
│   └── contexts/      # React 上下文
├── backend/           # Cloudflare Workers API
│   ├── src/           # API 源碼
│   │   ├── handlers/  # API 端點處理器
│   │   ├── services/  # 服務層（含嵌入和向量搜尋）
│   │   └── types/     # TypeScript 類型定義
│   ├── llama_index/   # 向量索引處理工具
│   │   ├── process_qa_data.py  # 處理問答資料
│   │   ├── query_qa.py         # 查詢向量資料庫
│   │   └── qa_data_sample.json # 範例問答資料
│   └── wrangler.toml  # Cloudflare 配置
└── package.json       # 根專案設定
```

## 系統需求

### 最低需求

- **瀏覽器**：支援 ES6 的現代瀏覽器（Chrome、Firefox、Safari、Edge 等）
- **伺服器**：用於後端的 Cloudflare Workers（無需專用伺服器）
- **存儲**：Pinecone 向量資料庫（免費方案足夠小型使用）
- **API**：Cohere API（有免費層級可供測試使用）

### 建議配置

- 穩定的互聯網連接
- 最新版本的 Chrome 或 Firefox 瀏覽器
- 充足的 Pinecone 索引空間（付費方案）用於大量知識管理

## 貢獻指南

我們歡迎輔大資管學生、教師和社區成員的貢獻！如果您想參與開發，請遵循以下步驟：

1. Fork 此儲存庫
2. 創建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m '添加一些資管學習資源'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟一個 Pull Request

### 貢獻領域

- **課程資料**：補充或更新各科目的問答內容
- **學習資源**：分享有價值的學習連結和參考資料
- **專業問答**：擴充常見問題與解答資料庫
- **界面優化**：改進用戶體驗和視覺設計
- **紓壓遊戲**：設計或提供簡單有趣的小遊戲
- **留言板功能**：優化匿名留言板體驗，增加互動功能
- **功能擴展**：開發新功能，如學習進度追蹤、筆記整合等

### 教師貢獻

如果您是輔大資管的教師，我們特別歡迎您：
- 提供課程相關的標準答案和學習指南
- 分享教學資源和實例
- 反饋系統如何更好地支援學生學習

## 致謝

感謝輔仁大學資訊管理學系的師生為本專案提供寶貴的意見和資源。EchoMind2 的開發旨在輔助教學和學習，為資管專業知識的傳播和獲取提供新的可能性。

## 開發計劃

EchoMind2 正在持續開發中，以下是我們的開發路線圖：

### 當前版本 (v1.0)
- ✅ 基於 Cohere 和 Pinecone 的智能問答系統
- ✅ 輔大資管專業知識庫
- ✅ 基本搜索和查詢功能

### 即將推出 (v1.1)
- 🔜 紓壓小遊戲平台
- 🔜 匿名留言板功能
- 🔜 用戶界面優化

### 規劃中 (v1.2)
- 📝 個人學習進度追蹤
- 📝 AI 學習建議生成器
- 📝 課程相關資源推薦系統

### 長期目標
- 📌 整合更多資管系課程內容
- 📌 建立完整的知識圖譜視覺化
- 📌 開發適合行動裝置的應用程式
- 📌 加入更多互動和社交功能

## 參與測試

我們誠摯邀請輔大資管系的同學參與 EchoMind2 的測試，特別是即將推出的紓壓小遊戲和匿名留言板功能。如果您有興趣體驗這些新功能並提供寶貴意見，請聯繫我們或在 GitHub 上提交 Issue。

## 授權

[MIT](LICENSE)

# 前後端搜尋交互機制

EchoMind2 系統實現了雙模式交互方式，為用戶提供靈活的信息檢索體驗：

## 向量語意搜尋模式

透過直接查詢輔大資管專業知識庫，提供精確的答案。

### 運作流程

```
用戶提問 → 前端切換至「學業資料庫搜尋」模式 → 
請求發送至 /api/vector-search 端點 → Cloudflare Worker 處理 → 
Python API 服務進行向量檢索 → Pinecone 查詢相關結果 → 
結果返回並按相關性排序呈現
```

### 技術實現

前端透過 `ChatInput` 組件提供切換功能：

```typescript
// 切換資料庫搜尋按鈕
<button onClick={toggleDbSearch} className={/* ... */}>
  <Database className="h-4 w-4" />
  <span>學業資料庫搜尋{isDbSearchActive ? ' (已啟用)' : ''}</span>
</button>
```

請求參數格式：
```json
{
  "query": "用戶問題",
  "topK": 3,
  "minImportance": 0
}
```

## AI 對話模式

使用大型語言模型生成回答，適合複雜問題和開放性討論。

### 運作流程

```
用戶提問 → 選擇 AI 模型 → chatClient 服務處理請求 → 
模型生成回應 → 結果顯示 → 儲存到聊天歷史
```

### 可選模型

- Llama 3.1 8B Instant (預設)
- Deepseek R1 Distill Llama 70B
- Qwen 2.5 32B

### 錯誤處理機制

系統實現了多層次的錯誤處理和診斷：

1. API 健康檢查：向量搜尋前先確認服務可用性
2. 網絡連線診斷：錯誤發生時測試基本連接狀態
3. 詳細日誌記錄：追蹤請求流程和回應內容
4. 友好錯誤提示：針對不同類型的錯誤提供具體說明

## 聊天歷史管理

系統使用非阻塞方式處理聊天記錄：

```typescript
// 使用 setTimeout 將儲存操作移到下一個事件循環
setTimeout(async () => {
  try {
    await chatHistoryService.updateChat(chatId, finalMessages);
  } catch (error) {
    console.error('更新聊天記錄失敗:', error);
  }
}, 0);
```

# EchoMind 問題排解與解決方案

## 向量搜尋功能問題排解

### 問題描述

我們在實作向量搜尋功能時遇到以下問題：

1. 前端向後端發送查詢請求後收到空結果數組 `[]`，儘管後端日誌顯示 Pinecone 確實返回了結果
2. 後端日誌顯示「過濾後返回 3 個結果」但最終輸出「沒有匹配的結果可返回」
3. 前端與後端間的參數傳遞可能不一致

### 解決方案

#### 1. 修正後端過濾邏輯

問題核心在於後端的重要性(importance)過濾邏輯，對於沒有定義 `importance` 屬性的項目，直接被過濾掉：

```typescript
// 原始代碼 - 有問題的過濾邏輯
filteredResults = filteredResults.filter(item => {
  const importance = (item as any).importance;
  return importance !== undefined && importance >= minImportance;
});
```

解決方案是為沒有 `importance` 屬性的項目提供預設值：

```typescript
// 修正後的代碼
filteredResults = filteredResults.filter(item => {
  const importance = (item as any).importance;
  // 如果未定義重要性，默認為 1.0 (允許通過)
  const effectiveImportance = importance !== undefined ? importance : 1.0;
  return effectiveImportance >= minImportance;
});
```

#### 2. 加強日誌記錄

添加更詳細的日誌輸出，以便更好地診斷問題：

```typescript
// 添加過濾前後日誌
console.log(`🔍 [${requestId}] 篩選重要性閾值: ${minImportance}`);
console.log(`🔍 [${requestId}] 篩選前結果數量: ${filteredResults.length}`);
  
const beforeFilterCount = filteredResults.length;
// ... 過濾代碼 ...
  
console.log(`🔍 [${requestId}] 重要性篩選後結果數量: ${filteredResults.length}, 移除了: ${beforeFilterCount - filteredResults.length} 個結果`);
```

#### 3. 確保前後端參數一致性

檢查並確認前端和後端使用相同的參數名稱：

- 前端發送：`{ "query": "...", "topK": 3, "minImportance": 0 }`
- 後端接收：`const { query, topK = 3, category, minImportance } = requestData;`

#### 4. 在前端添加更多日誌

在前端添加更多日誌來顯示 API 返回的詳細資訊：

```typescript
if (results.length > 0) {
  console.log('搜尋結果詳情:', results.map((r: any) => ({
    id: r.id,
    question: r.question?.substring(0, 30) + '...',
    answer: r.answer?.substring(0, 30) + '...',
    score: r.score,
    category: r.category || '無類別'
  })));
} else {
  console.log('API返回了一個空結果數組或無效結果');
  console.log('原始回應資料類型:', typeof data, '原始回應結構:', Object.keys(data));
}
```

### 成功指標

修復後，API 返回正確結果：
- 篩選前結果數量：3 個
- 重要性篩選後結果數量：3 個，移除了 0 個結果
- 前端成功顯示搜尋結果

## Cohere API 整合問題

與上述問題相關，我們還發現使用 Cohere API 生成嵌入向量時的一些注意事項：

### 正確的 Cohere API 使用方式

```typescript
// 正確的嵌入生成
const response = await fetch(`${apiUrl}/embeddings`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: "embed-multilingual-v3.0",
    input: [text],
    input_type: "search_query",  // 必須提供
    embedding_types: ["float"]   // 必須提供
  })
});
```

確保在向量搜尋和數據上傳時使用一致的 `input_type` 參數：
- 搜尋查詢時使用 `search_query`
- 文檔嵌入時使用 `search_document`

## 結論

Vector search 功能的問題主要源於後端過濾邏輯中對未定義 `importance` 屬性的處理不當。通過提供預設值和更詳細的日誌記錄，我們能夠診斷並解決問題，使向量搜尋功能正常工作。
