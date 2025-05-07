# EchoMind 向量資料庫處理系統

這個系統專為處理問答資料並上傳至 Pinecone 向量資料庫，支援輔仁大學資管系 EchoMind 專案的 RAG （檢索增強生成）功能。

## 使用說明

### 處理問答資料

此腳本將 JSON 格式的問答資料處理並上傳到 Pinecone：

```bash
python process_qa_data.py --file 檔案路徑.json
```

例如：
```bash
python process_qa_data.py --file example.json
```

### 查詢問答資料 (使用TypeScript實現)

Python腳本負責資料處理與索引，而查詢功能已在系統的TypeScript部分實現：
- `backend/src/services/vector/search.ts` - 向量搜索功能
- `backend/src/services/vector/client.ts` - Pinecone客戶端
- `backend/src/services/groq.ts` - RAG整合功能

## 資料結構

系統處理的問答資料應符合以下 JSON 格式：

```json
{
  "常見問題": [
    {
      "類別": "系上英文門檻",
      "問題": [
        {
          "問題": "輔大資管系的英文畢業門檻是什麼？",
          "重要程度": 5,
          "關鍵字": ["英文門檻", "畢業要求", "多益成績", "英文能力"],
          "相關資源": ["系所網站", "課程規定說明"],
          "解答": "輔大資管系學生須通過全校性的「中英文能力檢定」，並且達到多益（TOEIC）成績785分以上，或其他相當的英文檢定成績，才能畢業。此要求是確保畢業生具備足夠的英語能力以應對職場需求。"
        }
      ]
    },
    {
      "分類": "成績查詢",
      "問題列表": [
        {
          "問題": "如何在LDAP系統查詢學期成績？",
          "解答": "學生需使用輔大單一帳號（LDAP）登入學生資訊入口網。具體步驟如下：1. 訪問學生資訊入口網。2. 輸入LDAP帳號（通常為學號）及密碼。3. 在「課程與學習」選項中，點選「學生選課資訊網」。4. 選擇「成績查詢」，即可查看當前學期成績。若帳號未啟用，可至LDAP啟動網站完成啟用。確保使用安全的網路環境以保護個人資訊。",
          "重要程度": 5,
          "相關資源": ["輔大學生資訊平台", "教務處數位服務公告"]
        }
      ]
    }
  ]
}
```

## 開發說明

- 使用 Cohere 的 `embed-multilingual-v3.0` 模型處理繁體中文
- 透過 Pinecone 提供高效向量搜索能力
- 利用 LlamaIndex 處理文檔和提供查詢功能 

## 系統功能概述

### 1. Python部分 (本工具)

#### 資料切分優化 ✅

- **更精確的問答對切分**：實現能夠識別並拆分複合答案的功能
  ```python
  # 範例：拆分數字列表
  numbered_points = re.split(r'(\d+\.\s)', answer)
  ```

- **文本預處理**：加入預處理函數清理輸入文本
  ```python
  def preprocess_text(text):
      # 移除多餘空白
      text = re.sub(r'\s+', ' ', text).strip()
      # 移除特殊字符（保留基本標點符號）
      text = re.sub(r'[^\w\s\.\,\?\!\;\:\(\)\[\]\{\}\-\']', ' ', text)
      return text
  ```

- **複合答案識別**：自動判斷是否需要拆分答案
  ```python
  def is_complex_answer(answer):
      # 檢查是否有數字列表、分點符號
      has_numbered_list = bool(re.search(r'\d+\.\s', answer))
      has_bullet_points = '•' in answer or '．' in answer or '-' in answer
      # 檢查句子數量和答案長度
      too_many_sentences = len(split_sentences(answer)) > 5
      too_long = len(answer) > 300
      return has_numbered_list or has_bullet_points or too_many_sentences or too_long
  ```

- **多種拆分策略**：支援按以下方式拆分：
  1. 數字列表拆分（例如：`1. 第一點 2. 第二點`）
  2. 分隔符拆分（例如：使用 `•`, `．`, `-` 等符號）
  3. 段落拆分（長文本按句子組合成段落）

#### Cohere API 正確使用 ✅

- **參數設置正確**：設置必要的參數
  ```python
  response = co.embed(
      texts=texts,
      model="embed-multilingual-v3.0",  # 使用多語言模型
      input_type="search_document",     # 指定輸入類型
      embedding_types=["float"]         # 指定嵌入類型
  )
  ```

- **響應處理**：正確獲取嵌入向量
  ```python
  embeddings = response.embeddings.float  # 正確獲取嵌入向量
  ```

### 2. TypeScript部分 (已實現的功能)

#### 向量表示改進 ✅

- **查詢預處理**：在 `search.ts` 中實現
  ```typescript
  preprocessQuery(query: string): string {
    // 停用詞過濾
    const stopwords = ['的', '了', '和', '與', '在', '是', '我', '有', '這', '那', '怎麼', '如何', '請問', '可以', '嗎'];
    // 移除標點符號及停用詞
    let processedQuery = query.replace(/[.,。，、！？!?;；:：()（）{}「」""]/g, ' ');
    let words = processedQuery.split(/\s+/).filter(word => !stopwords.includes(word));
    // ...
  }
  ```

- **分層檢索策略**：在 `search.ts` 中實現類別匹配和結果整合
  ```typescript
  // 根據類別匹配增強結果相關性
  if (currentFaq.category && otherFaq.category && 
      currentFaq.category === otherFaq.category) {
    categoryMatch = true;
  }
  ```

#### 查詢處理增強 ✅

- **相似度閾值過濾**：在 `search.ts` 中實現
  ```typescript
  // 評估整合的閾值 - 問題相似度至少要達到這個相似度才考慮整合
  const INTEGRATION_THRESHOLD = 0.65;
  
  // 如果相似度超過閾值或分類相匹配，進行整合
  if (similarity > INTEGRATION_THRESHOLD || categoryMatch) {
    // 結合答案，移除重復內容
    const integratedAnswer = SimilarityService.combineAnswers(integratedFaq.answer, otherFaq.answer);
    // ...
  }
  ```

- **元數據搜索**：在 `client.ts` 的 `searchFaqs` 中支援按類別過濾
  ```typescript
  // 合併搜尋配置
  const searchConfig: VectorSearchConfig = {
    ...DEFAULT_SEARCH_CONFIG,
    ...config
  };
  
  // 支援閾值過濾和類別過濾
  ```

#### RAG混合檢索與整合 ✅

- **RAG增強聊天**：在 `groq.ts` 中實現
  ```typescript
  async enhancedChat(options: ChatCompletionOptions, limit: number = 3, threshold: number = 0.3): Promise<GroqChatResponse> {
    // 獲取相關FAQ結果
    const pineconeClient = createPineconeClient(this.env);
    faqs = await pineconeClient.searchFaqs(query, { limit, threshold });
    
    // 如果找到相關FAQ，創建增強的系統提示詞
    if (faqs.length > 0) {
      const enhancedSystemPrompt = createEnhancedSystemPrompt(faqs);
      // ...
    }
  }
  ```

- **答案一致性管理**：通過系統提示詞增強
  ```typescript
  function createEnhancedSystemPrompt(faqs: FaqSearchResult[]): ChatMessage {
    // 將相關FAQ整合到系統提示詞中
    let enhancedContent = `${BASE_SYSTEM_PROMPT.content}\n\n### 參考知識\n請根據以下資料回答問題...`;
    
    // 添加每個相關FAQ
    faqs.forEach((faq, index) => {
      enhancedContent += `#### 參考資料 ${index + 1}：${faq.category || '一般資訊'}\n`;
      enhancedContent += `問：${faq.question}\n答：${faq.answer}\n\n`;
    });
    // ...
  }
  ```

#### 使用者界面與交互 ✅

- 在 `frontend/components/chat` 中實現完整的聊天界面
- 包含消息列表、輸入框、使用者反饋等功能

## 常見問題與解決方案

### Cohere API 整合問題

在使用 Cohere API 生成嵌入向量時，可能會遇到以下問題：

1. **參數設置問題**：
   - Cohere API v2 的 `embed` 方法需要正確設置 `input_type` 和 `embedding_types` 參數
   - 對於 `embed-multilingual-v3.0` 模型，必須同時提供這兩個參數
   - 錯誤示例：只提供 `model` 參數而缺少 `input_type` 或 `embedding_types`

2. **響應處理問題**：
   - Cohere API v2 的響應格式與 v1 不同
   - 嵌入向量存儲在 `response.embeddings.float` 中，而不是直接在 `response.embeddings` 中
   - 錯誤示例：嘗試使用 `embeddings[0]` 而不是 `embeddings.float[0]`

### Pinecone 索引更新延遲

上傳向量到 Pinecone 後，索引統計資訊可能不會立即更新。這是正常現象，通常需要幾秒鐘到幾分鐘的時間才能在索引統計中看到新上傳的向量。

可以使用以下代碼檢查索引狀態：

```python
import os
from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv()
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
index_name = os.getenv('PINECONE_INDEX_NAME', 'echomind2')
index = pc.Index(index_name)
stats = index.describe_index_stats()
print(f'索引統計資訊：\n總向量數：{stats.total_vector_count}\n命名空間：{stats.namespaces}')
```