from pinecone import Pinecone
import os
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

# 初始化 Pinecone 客戶端
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = os.getenv("PINECONE_INDEX_NAME", "echomind2")

# 獲取索引
index = pc.Index(index_name)

# 檢查索引狀態
stats = index.describe_index_stats()
print(f"索引名稱: {index_name}")
print(f"索引統計信息: {stats}")
print(f"總向量數: {stats.total_vector_count}")
print(f"命名空間: {stats.namespaces}") 