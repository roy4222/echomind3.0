"""
查詢 Pinecone 向量庫的腳本
直接使用 Cohere 和 Pinecone 查詢結構化問答資料
"""
import os                      # 用於訪問環境變數
import sys                     # 用於系統相關操作，如退出程序
import json                    # 用於處理 JSON 格式資料
import argparse                # 用於解析命令列參數
import logging                 # 用於日誌記錄
import numpy as np             # 用於數值計算
from typing import Optional, List, Dict, Any  # 用於類型提示
from dotenv import load_dotenv  # 用於載入環境變數
from pinecone import Pinecone  # 用於連接 Pinecone 向量資料庫
from cohere import ClientV2    # 用於連接 Cohere API
import cohere
import pinecone

# 設定日誌輸出
logging.basicConfig(
    level=logging.INFO,        # 設定日誌級別為 INFO
    format='%(asctime)s - %(levelname)s - %(message)s',  # 設定日誌格式
    handlers=[
        logging.StreamHandler(sys.stdout)  # 將日誌輸出到標準輸出
    ]
)
logger = logging.getLogger(__name__)  # 獲取日誌記錄器

# 加載環境變數
load_dotenv()

def get_cohere_client():
    """
    獲取 Cohere 客戶端實例
    """
    api_key = os.getenv("COHERE_API_KEY")
    if not api_key:
        raise ValueError("未設置 COHERE_API_KEY 環境變數")
    
    return cohere.Client(api_key)

def get_pinecone_client():
    """
    獲取並初始化 Pinecone 索引
    """
    api_key = os.getenv("PINECONE_API_KEY")
    environment = os.getenv("PINECONE_ENVIRONMENT")
    index_name = os.getenv("PINECONE_INDEX") or os.getenv("PINECONE_INDEX_NAME")
    
    if not api_key:
        raise ValueError("未設置 PINECONE_API_KEY 環境變數")
    if not environment:
        raise ValueError("未設置 PINECONE_ENVIRONMENT 環境變數")
    if not index_name:
        raise ValueError("未設置 PINECONE_INDEX/PINECONE_INDEX_NAME 環境變數")
    
    # 初始化 Pinecone
    pinecone.init(api_key=api_key, environment=environment)
    
    # 獲取索引
    try:
        index = pinecone.Index(index_name)
        logger.info(f"成功連接到 Pinecone 索引: {index_name}")
        return index
    except Exception as e:
        logger.error(f"連接 Pinecone 時出錯: {str(e)}")
        raise

def initialize_pinecone():
    """初始化 Pinecone 客戶端並檢查索引是否存在"""
    load_dotenv()  # 載入 .env 檔案中的環境變數
    api_key = os.getenv("PINECONE_API_KEY")  # 獲取 Pinecone API 金鑰
    env = os.getenv("PINECONE_ENVIRONMENT")  # 獲取 Pinecone 環境
    index_name = os.getenv("PINECONE_INDEX_NAME")  # 獲取 Pinecone 索引名稱

    # 檢查必要的環境變數是否都已設定
    if not all([api_key, env, index_name]):
        raise ValueError("請確保設定了所有必要的 Pinecone 環境變數")

    logger.info(f"連接 Pinecone: 環境 {env}, 索引 {index_name}")
    pc = Pinecone(api_key=api_key)  # 初始化 Pinecone 客戶端
    
    # 檢查索引是否存在
    if index_name not in pc.list_indexes().names():
        raise ValueError(f"索引 '{index_name}' 不存在")
    
    return pc.Index(index_name)  # 返回索引實例

def initialize_cohere():
    """初始化 Cohere 客戶端"""
    cohere_api_key = os.getenv("COHERE_API_KEY")  # 獲取 Cohere API 金鑰
    if not cohere_api_key:
        raise ValueError("請確保設定了 COHERE_API_KEY 環境變數")
    
    return ClientV2(api_key=cohere_api_key)  # 返回 Cohere 客戶端實例

def get_index_stats(pinecone_index):
    """獲取 Pinecone 索引統計資訊"""
    try:
        # 獲取索引統計資訊
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
        zero_vector = np.zeros(dimension)  # 創建全零向量
        # 使用零向量查詢，獲取隨機樣本
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
        # 調用 Cohere API 生成文本嵌入
        response = cohere_client.embed(
            texts=[text],  # 輸入文本列表
            model=model,   # 使用的嵌入模型
            input_type="search_query",  # 指定輸入類型為搜索查詢
            embedding_types=["float"]   # 指定嵌入類型為浮點數
        )
        return response.embeddings.float[0]  # 返回生成的嵌入向量
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
            filter_dict["category"] = category  # 按類別過濾
        if min_importance is not None:
            filter_dict["importance"] = {"$gte": min_importance}  # 按最小重要性過濾
        
        # 使用嵌入向量查詢 Pinecone
        results = pinecone_index.query(
            vector=query_embedding,  # 查詢向量
            top_k=top_k,             # 返回結果數量
            include_metadata=True,   # 包含元數據
            filter=filter_dict if filter_dict else None  # 應用過濾條件
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
    
    # 遍歷並顯示每個匹配結果
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
    # 設定命令列參數解析器
    parser = argparse.ArgumentParser(description="查詢 Q&A 系統")
    parser.add_argument("query", nargs='?', help="查詢文本")
    parser.add_argument("--top-k", type=int, default=3, help="返回的結果數量")
    parser.add_argument("--category", help="按類別過濾")
    parser.add_argument("--min-importance", type=int, help="最小重要性級別")
    parser.add_argument("--output", help="輸出結果到 JSON 文件")
    parser.add_argument("--stats", action="store_true", help="顯示索引統計資訊")
    parser.add_argument("--samples", action="store_true", help="顯示向量樣本")
    
    args = parser.parse_args()  # 解析命令列參數
    
    try:
        # 初始化 Pinecone 和 Cohere
        pinecone_index = get_pinecone_client()
        cohere_client = get_cohere_client()
        
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
                # 將結果轉換為 JSON 格式
                for match in results.matches:
                    match_data = {
                        "id": match.id,
                        "score": match.score,
                        "metadata": match.metadata
                    }
                    output_data.append(match_data)
                
                # 寫入 JSON 文件
                with open(args.output, 'w', encoding='utf-8') as f:
                    json.dump(output_data, f, ensure_ascii=False, indent=2)
                logger.info(f"結果已保存到 {args.output}")
        
    except Exception as e:
        logger.error(f"錯誤: {str(e)}")
        sys.exit(1)  # 發生錯誤時退出程序

if __name__ == "__main__":
    main()  # 程式入口點