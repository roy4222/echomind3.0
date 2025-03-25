"""
查詢 Pinecone 向量庫的腳本
直接使用 Cohere 和 Pinecone 查詢結構化問答資料
"""
import os
import sys
import json
import argparse
import logging
import numpy as np
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv
from pinecone import Pinecone
from cohere import ClientV2

# 設定日誌輸出
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
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

def initialize_cohere():
    """初始化 Cohere 客戶端"""
    cohere_api_key = os.getenv("COHERE_API_KEY")
    if not cohere_api_key:
        raise ValueError("請確保設定了 COHERE_API_KEY 環境變數")
    
    return ClientV2(api_key=cohere_api_key)

def get_index_stats(pinecone_index):
    """獲取 Pinecone 索引統計資訊"""
    try:
        stats = pinecone_index.describe_index_stats()
        logger.info("Pinecone 索引統計資訊:")
        logger.info(f"總向量數: {stats.total_vector_count}")
        logger.info(f"命名空間: {stats.namespaces}")
        return stats
    except Exception as e:
        logger.error(f"獲取索引統計資訊時出錯: {str(e)}")
        return None

def get_sample_vectors(pinecone_index, top_k=3):
    """獲取向量樣本"""
    try:
        dimension = 1024  # Cohere embed-multilingual-v3.0 的輸出維度
        zero_vector = np.zeros(dimension)
        query_response = pinecone_index.query(
            vector=zero_vector.tolist(),
            top_k=top_k,
            include_metadata=True
        )
        
        if query_response and query_response.matches:
            logger.info(f"獲取到 {len(query_response.matches)} 個向量樣本")
            return query_response.matches
        else:
            logger.warning("沒有獲取到向量樣本")
            return []
    except Exception as e:
        logger.error(f"獲取向量樣本時出錯: {str(e)}")
        return []

def generate_embedding(text: str, cohere_client, model="embed-multilingual-v3.0"):
    """使用 Cohere 生成文本嵌入"""
    try:
        response = cohere_client.embed(
            texts=[text],
            model=model,
            input_type="search_query",
            embedding_types=["float"]
        )
        return response.embeddings.float[0]
    except Exception as e:
        logger.error(f"生成嵌入時出錯: {str(e)}")
        raise

def search_vectors(query_text: str, pinecone_index, cohere_client, top_k=3, 
                  category: Optional[str] = None, min_importance: Optional[int] = None):
    """搜索向量"""
    try:
        # 生成查詢嵌入
        query_embedding = generate_embedding(query_text, cohere_client)
        
        # 構建過濾條件
        filter_dict = {}
        if category:
            filter_dict["category"] = category
        if min_importance is not None:
            filter_dict["importance"] = {"$gte": min_importance}
        
        # 使用嵌入向量查詢 Pinecone
        results = pinecone_index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
            filter=filter_dict if filter_dict else None
        )
        
        return results
    except Exception as e:
        logger.error(f"搜索向量時出錯: {str(e)}")
        return None

def format_results(results):
    """格式化查詢結果"""
    if not results or not results.matches:
        logger.info("沒有找到匹配的結果")
        return
    
    print("\n" + "="*50)
    print("查詢結果")
    print("="*50)
    
    for i, match in enumerate(results.matches):
        print(f"\n結果 {i+1}:")
        metadata = match.metadata
        print(f"問題: {metadata.get('question', 'N/A')}")
        print(f"答案: {metadata.get('answer', 'N/A')}")
        print(f"類別: {metadata.get('category', 'N/A')}")
        print(f"重要性: {metadata.get('importance', 'N/A')}")
        if metadata.get('resources'):
            print(f"資源: {metadata.get('resources')}")
        print(f"相似度: {match.score}")
        print("-" * 50)

def main():
    parser = argparse.ArgumentParser(description="查詢 Q&A 系統")
    parser.add_argument("query", nargs='?', help="查詢文本")
    parser.add_argument("--top-k", type=int, default=3, help="返回的結果數量")
    parser.add_argument("--category", help="按類別過濾")
    parser.add_argument("--min-importance", type=int, help="最小重要性級別")
    parser.add_argument("--output", help="輸出結果到 JSON 文件")
    parser.add_argument("--stats", action="store_true", help="顯示索引統計資訊")
    parser.add_argument("--samples", action="store_true", help="顯示向量樣本")
    
    args = parser.parse_args()
    
    try:
        # 初始化 Pinecone 和 Cohere
        pinecone_index = initialize_pinecone()
        cohere_client = initialize_cohere()
        
        # 顯示索引統計資訊
        if args.stats:
            get_index_stats(pinecone_index)
        
        # 顯示向量樣本
        if args.samples:
            samples = get_sample_vectors(pinecone_index, top_k=args.top_k)
            print("\n向量樣本:")
            for i, sample in enumerate(samples):
                print(f"\n樣本 {i+1}:")
                print(f"ID: {sample.id}")
                print(f"相似度: {sample.score}")
                print(f"元數據: {sample.metadata}")
        
        # 執行查詢
        if args.query:
            logger.info(f"查詢: {args.query}")
            results = search_vectors(
                args.query, 
                pinecone_index, 
                cohere_client, 
                top_k=args.top_k,
                category=args.category,
                min_importance=args.min_importance
            )
            
            # 格式化並顯示結果
            format_results(results)
            
            # 輸出結果到 JSON 文件
            if args.output and results and results.matches:
                output_data = []
                for match in results.matches:
                    match_data = {
                        "id": match.id,
                        "score": match.score,
                        "metadata": match.metadata
                    }
                    output_data.append(match_data)
                
                with open(args.output, 'w', encoding='utf-8') as f:
                    json.dump(output_data, f, ensure_ascii=False, indent=2)
                logger.info(f"結果已保存到 {args.output}")
        
    except Exception as e:
        logger.error(f"錯誤: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()