
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
```

## RAG系統資料處理問題與改進建議

在實際運行RAG系統時，發現一些資料處理的問題可能影響系統的回答質量。以下是識別的主要問題和相應的改進建議：

### 現有問題

1. **資料切分不乾淨**：
   - 許多問題沒有被正確分類和切分，導致混合在一起
   - 同一概念的問題可能散布在不同類別中
   - 問答對缺乏一致的結構和格式

2. **向量表示不夠精確**：
   - 目前的嵌入方式可能無法充分捕捉問題的語義差異
   - 缺少問題變體和同義詞擴展，導致檢索不夠靈活

3. **處理複合問題能力不足**：
   - 當用戶提出複合問題時，系統難以找到最相關的答案
   - 缺乏將複合問題拆分為子問題的機制

### 改進建議

#### 1. 資料切分優化

1. **更精確的問答對切分**:
   ```python
   # 修改extract_qa函數，增加處理特定嵌套結構的能力
   def extract_qa(obj, main_category=None, category=None, sub_category=None):
       # 添加對子類別的處理...
   ```

2. **引入更清晰的類別標籤**:
   ```python
   "metadata": {
     "question": qa["問題"],
     "answer": qa["解答"],
     "main_category": main_category,
     "category": curr_category,
     "sub_category": qa.get("子類別", None),  # 新增子類別
     "question_type": qa.get("問題類型", "一般問題"),  # 新增問題類型標籤
   }
   ```

3. **處理問題重複**:
   ```python
   # 在process_qa_data函數末尾添加去重邏輯
   deduplicated_qa_pairs = []
   question_set = set()
   for qa in qa_pairs:
     question = qa["metadata"]["question"].strip().lower()
     if question not in question_set:
       question_set.add(question)
       deduplicated_qa_pairs.append(qa)
   return deduplicated_qa_pairs
   ```

#### 2. 向量表示改進

1. **增強語義分塊方式**:
   ```python
   # 採用更結構化的文本表示格式
   qa["text"] = f"類別：{qa['metadata']['main_category']} - {qa['metadata']['category']}\n問題：{qa['metadata']['question']}\n答案：{qa['metadata']['answer']}"
   ```

2. **添加問題變體**:
   ```python
   # 為每個問題生成不同表達方式的變體
   def generate_variants(question):
     # 簡單範例，實際應用中可使用更複雜的NLP技術
     variants = [
       question,
       f"請問{question}",
       question.replace("？", ""),
       # 其他變體...
     ]
     return variants
     
   # 在處理每個問題時添加變體
   variants = generate_variants(qa["metadata"]["question"])
   for variant in variants:
     variant_qa = qa.copy()
     variant_qa["id"] = str(uuid.uuid4())
     variant_qa["metadata"]["is_variant"] = True
     variant_qa["metadata"]["original_question"] = qa["metadata"]["question"]
     variant_qa["metadata"]["question"] = variant
     qa_pairs.append(variant_qa)
   ```

#### 3. 向量索引優化

1. **實施多級索引**:
   ```python
   # 針對不同類型的問題建立不同的命名空間
   namespace = f"{qa['metadata']['main_category']}_{qa['metadata']['category']}"
   pinecone_index.upsert(vectors=vectors_to_upsert, namespace=namespace)
   ```

2. **調整嵌入參數**:
   ```python
   # 針對不同類型的內容使用不同的嵌入參數
   input_type = "search_document"
   if "課程內容" in qa["metadata"]["category"]:
     input_type = "classification"  # 或其他適合課程內容的類型
   
   response = co.embed(
     texts=texts,
     model="embed-multilingual-v3.0",
     input_type=input_type,
     embedding_types=["float"]
   )
   ```

#### 4. 資料結構統一化

1. **標準化JSON結構**:
   ```json
   {
     "qa_pairs": [
       {
         "question": "輔大資管系的英文畢業門檻是什麼？",
         "answer": "...",
         "category": "系上英文門檻",
         "sub_category": "基本資訊",
         "keywords": ["英文門檻", "畢業要求"],
         "importance": 5
       }
     ]
   }
   ```

2. **資料預處理腳本**:
   ```python
   # 新增 preprocess_json.py 腳本，統一不同格式
   def standardize_json_format(input_file, output_file):
       with open(input_file, 'r', encoding='utf-8') as f:
           data = json.load(f)
       
       standardized_data = {"qa_pairs": []}
       # 轉換邏輯
       
       with open(output_file, 'w', encoding='utf-8') as f:
           json.dump(standardized_data, f, ensure_ascii=False, indent=2)
   ```

#### 5. 檢索策略改進

1. **混合檢索方法**:
   ```python
   # 實現關鍵詞與向量混合檢索
   def search(query, top_k=5):
       # 先嘗試精確關鍵詞匹配
       keyword_results = keyword_search(query)
       # 再進行向量檢索
       vector_results = vector_search(query)
       # 合併並排序結果
       return merge_and_rank(keyword_results, vector_results)
   ```

2. **問題細分處理**:
   ```python
   # 將複合問題拆分為子問題
   def process_compound_question(query):
       # 使用NLP技術拆分複合問題
       sub_questions = split_question(query)
       # 分別檢索
       sub_results = [search(q) for q in sub_questions]
       # 整合結果
       return integrate_results(sub_results)
   ```

透過實施這些改進，RAG系統將能夠更準確地理解和回應用戶查詢，特別是在處理複雜和多部分問題時提供更精確的結果。