"""
查詢 Pinecone 向量庫的腳本
使用 LlamaIndex、Cohere 和 Pinecone 查詢結構化問答資料
"""
import os
from dotenv import load_dotenv
import logging
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.embeddings.cohere import CohereEmbedding
from pinecone import Pinecone
import argparse
from typing import Optional
import numpy as np
import sys

# 設定日誌輸出
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def initialize_pinecone():
    """初始化 Pinecone 客戶端並檢查索引是否存在"""
    load_dotenv()
    api_key = os.getenv("PINECONE_API_KEY")
    env = os.getenv("PINECONE_ENVIRONMENT")
    index_name = os.getenv("PINECONE_INDEX_NAME")

    if not all([api_key, env, index_name]):
        raise ValueError("請確保設定了所有必要的 Pinecone 環境變數")

    logger.info(f"連接 Pinecone: 環境 {env}, 索引 {index_name}")
    pc = Pinecone(api_key=api_key)
    
    if index_name not in pc.list_indexes().names():
        raise ValueError(f"索引 '{index_name}' 不存在")
    
    return pc.Index(index_name)

def setup_query_engine(category: Optional[str] = None, min_importance: Optional[int] = None):
    """設定查詢引擎"""
    pinecone_index = initialize_pinecone()
    
    # 使用 Cohere 嵌入模型
    cohere_api_key = os.getenv("COHERE_API_KEY")
    if not cohere_api_key:
        raise ValueError("請確保設定了 COHERE_API_KEY 環境變數")
    
    embed_model = CohereEmbedding(
        model_name=os.getenv("COHERE_MODEL_NAME", "embed-multilingual-v3.0"),
        api_key=cohere_api_key,
        input_type="search_query",
        embedding_types=["float"]
    )
    logger.info(f"使用 Cohere 嵌入模型: {embed_model.model_name}")

    # 設定向量存儲
    vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    
    # 創建索引
    index = VectorStoreIndex.from_vector_store(
        vector_store,
        storage_context=storage_context,
        embed_model=embed_model,
    )

    # 檢查向量存儲中的內容
    logger.info("檢查向量存儲中的內容:")
    stats = pinecone_index.describe_index_stats()
    logger.info(f"總向量數: {stats.total_vector_count}")
    logger.info(f"命名空間: {stats.namespaces}")
    
    # 獲取所有向量樣本
    try:
        dimension = 1024  # Cohere embed-multilingual-v3.0 的輸出維度
        zero_vector = np.zeros(dimension)
        query_response = pinecone_index.query(
            vector=zero_vector.tolist(),
            top_k=5,
            include_metadata=True
        )
        logger.info("向量存儲中的問答對示例:")
        for match in query_response.matches[:3]:  # 只顯示前3個作為示例
            logger.info(f"ID: {match.id}")
            logger.info(f"相似度: {match.score}")
            logger.info(f"元數據: {match.metadata}")
    except Exception as e:
        logger.error(f"獲取向量示例時出錯: {str(e)}")
    
    # 創建基本查詢引擎（不使用 LLM）
    query_engine = index.as_query_engine(
        similarity_top_k=3
    )
    
    return query_engine, pinecone_index

def direct_query(query_text, pinecone_index, top_k=3):
    """直接使用 Pinecone 查詢，不通過 LlamaIndex"""
    try:
        # 使用 Cohere 生成查詢嵌入
        cohere_api_key = os.getenv("COHERE_API_KEY")
        if not cohere_api_key:
            raise ValueError("請確保設定了 COHERE_API_KEY 環境變數")
        
        from cohere import ClientV2
        co = ClientV2(api_key=cohere_api_key)
        
        # 生成查詢嵌入
        embedding_response = co.embed(
            texts=[query_text],
            model="embed-multilingual-v3.0",
            input_type="search_query",
            embedding_types=["float"]
        )
        
        # 獲取嵌入向量
        query_embedding = embedding_response.embeddings.float[0]
        
        # 使用嵌入向量查詢 Pinecone
        results = pinecone_index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True
        )
        
        return results
    except Exception as e:
        logger.error(f"直接查詢時出錯: {str(e)}")
        return None

def format_direct_results(results):
    """格式化直接查詢的結果"""
    if not results or not results.matches:
        logger.info("沒有找到匹配的結果")
        return
    
    logger.info("\n查詢結果:")
    logger.info("-" * 50)
    
    for i, match in enumerate(results.matches):
        logger.info(f"\n結果 {i+1}:")
        metadata = match.metadata
        logger.info(f"問題: {metadata.get('question', 'N/A')}")
        logger.info(f"答案: {metadata.get('answer', 'N/A')}")
        logger.info(f"類別: {metadata.get('category', 'N/A')}")
        logger.info(f"重要性: {metadata.get('importance', 'N/A')}")
        logger.info(f"相似度: {match.score}")
        logger.info("-" * 50)

def main():
    parser = argparse.ArgumentParser(description="查詢 Q&A 系統")
    parser.add_argument("query", help="查詢文本")
    parser.add_argument("--top-k", type=int, default=3, help="返回的結果數量")
    parser.add_argument("--category", help="按類別過濾")
    parser.add_argument("--min-importance", type=int, help="最小重要性級別")
    parser.add_argument("--direct", action="store_true", help="直接使用 Pinecone 查詢，不通過 LlamaIndex")
    
    args = parser.parse_args()
    
    try:
        query_engine, pinecone_index = setup_query_engine(
            category=args.category,
            min_importance=args.min_importance
        )
        
        if args.direct:
            # 直接使用 Pinecone 查詢
            logger.info(f"直接查詢: {args.query}")
            results = direct_query(args.query, pinecone_index, top_k=args.top_k)
            format_direct_results(results)
        else:
            # 使用 LlamaIndex 查詢
            logger.info(f"使用 LlamaIndex 查詢: {args.query}")
            try:
                response = query_engine.query(args.query)
                if hasattr(response, 'source_nodes'):
                    logger.info("\n查詢結果:")
                    logger.info("-" * 50)
                    for i, node in enumerate(response.source_nodes):
                        metadata = node.metadata
                        logger.info(f"\n結果 {i+1}:")
                        logger.info(f"問題: {metadata.get('question', 'N/A')}")
                        logger.info(f"答案: {metadata.get('answer', 'N/A')}")
                        logger.info(f"類別: {metadata.get('category', 'N/A')}")
                        logger.info(f"重要性: {metadata.get('importance', 'N/A')}")
                        logger.info("-" * 50)
                else:
                    logger.info(f"\n{response}")
            except Exception as e:
                logger.error(f"使用 LlamaIndex 查詢時出錯: {str(e)}")
                logger.info("嘗試直接查詢...")
                results = direct_query(args.query, pinecone_index, top_k=args.top_k)
                format_direct_results(results)
        
    except Exception as e:
        logger.error(f"錯誤: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()