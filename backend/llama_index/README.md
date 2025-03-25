# LlamaIndex + Cohere + Pinecone 問答系統

使用 LlamaIndex、Cohere 和 Pinecone 處理結構化問答資料的系統。

## 環境設置

### 安裝依賴

```bash
pip install -r requirements.txt
```

### 配置環境變數

複製 `.env.example` 到 `.env` 並填入您的 API 密鑰：

```bash
cp .env.example .env
```

編輯 `.env` 文件，設置以下環境變數：

```
PINECONE_API_KEY=您的Pinecone_API密鑰
PINECONE_ENVIRONMENT=您的Pinecone環境
PINECONE_INDEX_NAME=qa-vectors
COHERE_API_KEY=您的Cohere_API密鑰
```

## 使用說明

### 處理問答資料

此腳本將 JSON 格式的問答資料處理並上傳到 Pinecone：

```bash
python process_qa_data.py --file qa_data_sample.json
```

若要重置現有索引：

```bash
python process_qa_data.py --file qa_data_sample.json --reset
```

### 查詢問答資料

查詢已上傳到 Pinecone 的問答資料：

```bash
python query_qa.py "你的問題"
```

附加參數：

- `--top-k`：返回的結果數量，預設為 5
- `--category`：按類別過濾，例如 `--category "程式設計相關"`
- `--min-importance`：按最低重要程度過濾，例如 `--min-importance 4`

例如：

```bash
python query_qa.py "Python 在資管系有什麼應用" --top-k 3 --category "程式設計相關"
```

## 資料結構

系統處理的問答資料應符合以下 JSON 格式：

```json
{
  "問答整理": {
    "類別1": {
      "分類說明": "類別1說明",
      "問答列表": [
        {
          "問題": "問題1",
          "重要程度": 5,
          "關鍵字": ["關鍵字1", "關鍵字2"],
          "相關資源": ["資源1", "資源2"],
          "解答": "答案1"
        },
        // 更多問答...
      ]
    },
    // 更多類別...
  },
  "metadata": {
    // 資料相關的元數據
  }
}
```

## 開發說明

- 使用 Cohere 的 `embed-multilingual-v3.0` 模型處理繁體中文
- 透過 Pinecone 提供高效向量搜索能力
- 利用 LlamaIndex 處理文檔和提供查詢功能 

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

### 正確的 Cohere API 使用方式

```python
# 正確的 Cohere API 使用方式
from cohere import ClientV2

co = ClientV2(api_key=cohere_api_key)
response = co.embed(
    texts=texts,
    model="embed-multilingual-v3.0",
    input_type="search_document",  # 必須提供
    embedding_types=["float"]      # 必須提供
)
embeddings = response.embeddings.float  # 正確獲取嵌入向量

# 檢查嵌入維度
print(f"嵌入維度: {len(embeddings[0])}")  # 應為 1024
```

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