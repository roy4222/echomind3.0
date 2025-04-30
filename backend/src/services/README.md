# 向量搜尋系統改進與重構進度

## 目前系統分析

### 資料庫與模型
- 使用 Cohere 的 `embed-multilingual-v3.0` 模型生成向量嵌入
- 資料庫結構化的問答資料，每個問題都有關鍵字標籤
- Pinecone 作為向量資料庫儲存與檢索

### 搜尋演算法特點
- 混合搜尋策略，結合了：
  - 語義相似度 (向量相似度，權重 0.55，已從 0.5 調整)
  - 文字匹配 (精確匹配，權重 0.35，已從 0.4 調整)
  - 問題重要性 (權重 0.1)
  - 標籤提升 (每匹配一個標籤增加 0.1 的提升)

## 已完成的改進

### 1. 程式碼重構與模組化 ✅
已將原本近 1000 行的 `pinecone.ts` 檔案拆分為多個功能模組：

```
services/
├── vector/
│   ├── client.ts         # 基本的 Pinecone 客戶端連接邏輯
│   ├── search.ts         # 搜尋相關邏輯
│   ├── indexing.ts       # 索引和添加資料相關邏輯
│   ├── similarity.ts     # 相似度計算和分數校準邏輯
│   ├── cache.ts          # 向量搜尋快取邏輯
│   ├── vector-store.interface.ts # 抽象介面定義
│   ├── types.ts          # 共用類型定義
│   └── index.ts          # 模組導出
```

### 2. 介面抽象化 ✅
已建立抽象介面，使未來可以輕鬆替換向量資料庫實現：

```typescript
// vector-store.interface.ts
export interface VectorStore {
  searchFaqs(query: string, config?: Partial<VectorSearchConfig>): Promise<FaqSearchResult[]>;
  addFaq(item: VectorItem): Promise<boolean>;
  addFaqs(items: VectorItem[]): Promise<boolean>;
  deleteFaq(id: string): Promise<boolean>;
  updateFaq(item: VectorItem): Promise<boolean>;
  // 其他方法...
}
```

### 3. 搜尋權重配置調整 ✅
已調整搜尋權重配置，提高語義相似度的權重：

```typescript
// 調整後的權重配置
const textMatchWeight = 0.35;  // 從 0.4 降低
const semanticWeight = 0.55;   // 從 0.5 提高
const importanceWeight = 0.1;  // 保持不變
```

### 4. 相似度計算邏輯抽取 ✅
已將複雜的相似度計算邏輯抽取為獨立的 `SimilarityService` 類別：

```typescript
export class SimilarityService {
  static calibrateScore(score: number): number {...}
  static calculateQuestionSimilarity(question1: string, question2: string): number {...}
  static calculateStringSimilarity(str1: string, str2: string): number {...}
  static combineAnswers(primaryAnswer: string, secondaryAnswer: string): string {...}
  static calculateDynamicThreshold(query: string, baseThreshold: number): number {...}
}
```

## 待改進項目

### 1. 資料密度與多樣性
- **擴充問題變體**：為每個核心問題增加 3-5 個不同表述的變體
- **添加複雜問題範例**：特別針對常見的複雜問題模式，增加範例資料
- **標籤優化**：為複雜問題設計更全面的關鍵字標籤，包含子概念和相關術語

### 2. 進階搜尋策略
- **實作問題分解**：
  - 將複雜問題分解為多個子問題進行搜尋
  - 綜合子問題的搜尋結果，提高匹配廣度
- **實作二階段搜尋**：
  - 第一階段：使用較寬鬆的閾值獲取候選結果
  - 第二階段：使用更精細的重排序邏輯，提升最相關結果

### 3. 向量處理優化
- **考慮使用更先進的嵌入模型**：
  - 若預算允許，可考慮使用 OpenAI 的 `text-embedding-3-large` 或更新版本的 Cohere 模型
- **實作多向量表示**：
  - 對於複雜問題，生成多個向量表示不同方面，進行多向量搜尋

### 4. 語境感知
- **考慮使用者的歷史問題**：將歷史問題作為額外上下文
- **語義連接**：對連續相關問題進行語義連接，提高相關性

## 後續實作優先順序

1. **實作問題分解與二階段搜尋**（中等複雜度，效果顯著）
2. **擴充資料庫中的問題變體與關鍵字標籤**（最直接有效）
3. **增加語境感知功能**（提升使用者體驗）
4. **考慮升級嵌入模型**（成本較高，但長期效益明顯）

## 效能與品質監控

為了持續改進向量搜尋系統，建議實施以下監控機制：

1. **搜尋品質評估**：
   - 建立標準測試集，定期評估搜尋結果的準確性
   - 收集使用者反饋，識別常見的搜尋失敗案例

2. **效能監控**：
   - 追蹤搜尋延遲時間
   - 監控快取命中率
   - 分析向量搜尋的資源使用情況

3. **A/B 測試**：
   - 為新的搜尋演算法實施 A/B 測試
   - 比較不同權重配置的效果
