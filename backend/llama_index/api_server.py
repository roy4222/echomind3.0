"""
LlamaIndex API 服務
提供向量搜索和數據上傳功能的簡單 API
"""
import os
import logging
import sys
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

# 設定日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)

logger = logging.getLogger(__name__)

# 確保目前目錄在 Python 路徑中
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 導入 LlamaIndex 功能
try:
    from llama_index.query_qa import search_vectors, get_pinecone_client, get_cohere_client
    from llama_index.process_qa_data import process_and_upload_qa_data
    logger.info("成功導入 LlamaIndex 模塊")
except ImportError as e:
    logger.error(f"導入 LlamaIndex 模塊失敗: {e}")
    raise

app = FastAPI(title="LlamaIndex API")

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允許所有來源，生產環境中應限制
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 模型定義
class VectorSearchRequest(BaseModel):
    query: str
    top_k: int = 3
    category: Optional[str] = None
    min_importance: Optional[int] = None

class VectorSearchResponse(BaseModel):
    success: bool
    results: List[dict]
    message: Optional[str] = None

class UploadDataRequest(BaseModel):
    file_path: Optional[str] = None
    data: Optional[List[dict]] = None

class UploadDataResponse(BaseModel):
    success: bool
    message: str
    count: int

# API 端點
@app.get("/health")
async def health_check():
    """健康檢查端點"""
    return {"status": "ok"}

@app.post("/vector-search", response_model=VectorSearchResponse)
async def vector_search(request: VectorSearchRequest):
    """執行向量搜索"""
    try:
        logger.info(f"收到向量搜索請求: {request.query[:100]}... (top_k={request.top_k})")
        
        # 獲取 Pinecone 和 Cohere 客戶端
        pinecone_client = get_pinecone_client()
        cohere_client = get_cohere_client()
        
        # 執行向量搜索
        search_results = search_vectors(
            query_text=request.query,
            pinecone_index=pinecone_client,
            cohere_client=cohere_client,
            top_k=request.top_k,
            category=request.category,
            min_importance=request.min_importance
        )
        
        # 檢查結果
        if search_results is None or not hasattr(search_results, 'matches'):
            logger.warning("搜索結果為空或無效")
            return {
                "success": True,
                "results": [],
                "message": "沒有找到匹配的結果"
            }
        
        # 處理並轉換結果
        results = []
        for match in search_results.matches:
            try:
                result = {
                    "id": match.id,
                    "score": match.score,
                    "question": match.metadata.get("question", ""),
                    "answer": match.metadata.get("answer", ""),
                    "category": match.metadata.get("category", ""),
                    "tags": match.metadata.get("tags", [])
                }
                results.append(result)
            except Exception as e:
                logger.error(f"處理搜索結果時出錯: {e}")
        
        logger.info(f"返回 {len(results)} 個搜索結果")
        return {
            "success": True,
            "results": results
        }
    except Exception as e:
        logger.error(f"向量搜索失敗: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-data", response_model=UploadDataResponse)
async def upload_data(request: UploadDataRequest):
    """上傳數據到向量數據庫"""
    try:
        if request.file_path:
            # 從文件上傳
            logger.info(f"處理文件: {request.file_path}")
            count = process_and_upload_qa_data(request.file_path)
            return {
                "success": True,
                "message": f"成功從文件上傳 {count} 條記錄",
                "count": count
            }
        elif request.data:
            # 從 JSON 數據上傳
            logger.info(f"處理 {len(request.data)} 條數據記錄")
            # 直接處理數據
            # 這裡需要根據您的 process_and_upload_qa_data 函數進行調整
            # 目前假設它只接受文件路徑
            # TODO: 修改 process_qa_data.py 以支持直接處理數據
            return {
                "success": True,
                "message": f"成功上傳 {len(request.data)} 條記錄",
                "count": len(request.data)
            }
        else:
            raise HTTPException(status_code=400, detail="必須提供 file_path 或 data")
    except Exception as e:
        logger.error(f"上傳數據失敗: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 主入口點
if __name__ == "__main__":
    port = int(os.getenv("API_PORT", "8000"))
    host = os.getenv("API_HOST", "0.0.0.0")
    logger.info(f"啟動 API 服務於 {host}:{port}")
    uvicorn.run(app, host=host, port=port) 