"""
處理 Q&A 資料並上傳到 Pinecone 的腳本
使用 Cohere 和 Pinecone 處理 JSON 格式的問答資料
"""
import os
import json
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
import cohere
from cohere import ClientV2
import argparse
from tqdm import tqdm
import time
import uuid
import logging

# 設定日誌輸出
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def initialize_pinecone():
    """初始化 Pinecone 客戶端和索引"""
    load_dotenv()
    
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    index_name = os.getenv("PINECONE_INDEX_NAME", "echomind2")
    logging.info(f"連接 Pinecone: 索引 {index_name}")

    # 如果索引存在，刪除它
    if index_name in pc.list_indexes().names():
        logging.info(f"刪除現有索引: {index_name}")
        pc.delete_index(index_name)
        time.sleep(20)  # 等待索引完全刪除

    # 創建新的索引
    logging.info(f"創建新的索引: {index_name}")
    pc.create_index(
        name=index_name,
        dimension=1024,  # Cohere embed-v3 的輸出維度
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )
    
    time.sleep(20)  # 等待索引創建完成
    
    # 獲取索引
    pinecone_index = pc.Index(index_name)
    
    # 驗證索引是否可用
    stats = pinecone_index.describe_index_stats()
    logging.info(f"索引統計信息: {stats}")
    
    return pc, pinecone_index

def process_qa_data(file_path):
    """處理 Q&A 資料"""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    qa_pairs = []
    
    # 遍歷所有類別和問答對
    for category, category_data in data["問答整理"].items():
        category_desc = category_data.get("分類說明", "")
        qa_list = category_data.get("問答列表", [])
        
        for qa in tqdm(qa_list, desc="處理問答對"):
            # 創建 QA 對
            qa_pair = {
                "id": str(uuid.uuid4()),
                "text": f"問題：{qa['問題']}\n答案：{qa['解答']}",
                "metadata": {
                    "question": qa["問題"],
                    "answer": qa["解答"],
                    "category": category_desc,
                    "importance": qa["重要程度"],
                    "keywords": qa["關鍵字"],
                    "resources": qa["相關資源"]
                }
            }
            qa_pairs.append(qa_pair)
    
    return qa_pairs

def main():
    parser = argparse.ArgumentParser(description='處理 Q&A 資料並上傳到 Pinecone')
    parser.add_argument('--file', type=str, required=True, help='Q&A 資料的 JSON 文件路徑')
    args = parser.parse_args()
    
    try:
        # 初始化 Pinecone
        _, pinecone_index = initialize_pinecone()
        
        # 處理 Q&A 資料
        qa_pairs = process_qa_data(args.file)
        logging.info(f"已處理 {len(qa_pairs)} 個問答對")
        
        # 設定 Cohere
        cohere_api_key = os.getenv("COHERE_API_KEY")
        if not cohere_api_key:
            raise ValueError("請確保已設置 COHERE_API_KEY 環境變數")
        
        try:
            co = ClientV2(api_key=cohere_api_key)
            logging.info("使用 Cohere 嵌入模型: embed-multilingual-v3.0")
            
            # 生成嵌入
            logging.info("生成文本嵌入...")
            texts = [qa["text"] for qa in qa_pairs]
            
            try:
                response = co.embed(
                    texts=texts,
                    model="embed-multilingual-v3.0",
                    input_type="search_document",
                    embedding_types=["float"]
                )
                # 獲取 float 類型的嵌入向量
                embeddings = response.embeddings.float
                
                logging.info(f"生成的嵌入維度: {len(embeddings[0])}")
                
                # 上傳向量到 Pinecone
                logging.info("上傳向量到 Pinecone...")
                vectors_to_upsert = []
                for i, qa in enumerate(qa_pairs):
                    vector = {
                        "id": qa["id"],
                        "values": embeddings[i],
                        "metadata": qa["metadata"]
                    }
                    vectors_to_upsert.append(vector)
                
                # 批次上傳
                pinecone_index.upsert(vectors=vectors_to_upsert)
                
                # 驗證上傳
                stats = pinecone_index.describe_index_stats()
                logging.info(f"\n上傳後的索引統計信息:")
                logging.info(f"總向量數: {stats.total_vector_count}")
                logging.info(f"命名空間: {stats.namespaces}")
                
                logging.info("\n成功將問答資料索引到 Pinecone！")
            
            except Exception as e:
                logging.error(f"Cohere 嵌入生成錯誤: {str(e)}")
                import traceback
                traceback.print_exc()
        
        except Exception as e:
            logging.error(f"Cohere 客戶端初始化錯誤: {str(e)}")
            import traceback
            traceback.print_exc()
        
    except Exception as e:
        logging.error(f"錯誤: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()