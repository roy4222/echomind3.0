"""
處理 Q&A 資料並上傳到 Pinecone 的腳本
使用 Cohere 和 Pinecone 處理 JSON 格式的問答資料
"""
import os                      # 用於操作系統功能，如環境變數
import json                    # 用於處理 JSON 格式資料
from dotenv import load_dotenv  # 用於載入環境變數
from pinecone import Pinecone, ServerlessSpec  # Pinecone 向量資料庫
import cohere                  # Cohere AI 模型
from cohere import ClientV2    # Cohere 新版客戶端
import argparse                # 用於解析命令列參數
from tqdm import tqdm          # 用於顯示進度條
import time                    # 用於時間相關操作
import uuid                    # 用於生成唯一識別碼
import logging                 # 用於日誌記錄

# 設定日誌輸出格式和級別
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')


def initialize_pinecone():
    """初始化 Pinecone 客戶端和索引"""
    load_dotenv()  # 載入 .env 檔案中的環境變數

    # 建立 Pinecone 客戶端
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    index_name = os.getenv("PINECONE_INDEX_NAME", "echomind2")  # 使用環境變數或預設值
    logging.info(f"連接 Pinecone: 索引 {index_name}")

    # 檢查並刪除已存在的索引
    if index_name in pc.list_indexes().names():
        logging.info(f"刪除現有索引: {index_name}")
        pc.delete_index(index_name)
        time.sleep(20)  # 等待索引完全刪除，避免衝突

    # 創建新的索引
    logging.info(f"創建新的索引: {index_name}")
    pc.create_index(
        name=index_name,
        dimension=1024,  # Cohere embed-v3 的輸出維度
        metric="cosine",  # 使用餘弦相似度計算向量距離
        spec=ServerlessSpec(  # 使用無伺服器模式
            cloud="aws",
            region="us-east-1"
        )
    )

    time.sleep(20)  # 等待索引創建完成

    # 獲取索引實例
    pinecone_index = pc.Index(index_name)

    # 驗證索引是否可用
    stats = pinecone_index.describe_index_stats()
    logging.info(f"索引統計信息: {stats}")

    return pc, pinecone_index


def process_qa_data(file_path):
    """
    處理 Q&A 資料，將 JSON 格式轉換為向量資料庫可用的格式
    支援最外層為 dict，且 value 為 list 的結構（如{"常見問題": [...] }）
    遞迴處理所有可能的 Q&A 結構
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    qa_pairs = []

    def extract_qa(obj, main_category=None, category=None):
        if isinstance(obj, list):
            for item in obj:
                extract_qa(item, main_category, category)
        elif isinstance(obj, dict):
            # ex: {'類別': '系上英文門檻', '問題': [...]}
            if '類別' in obj and '問題' in obj:
                curr_category = obj['類別']
                extract_qa(obj['問題'], main_category or curr_category, curr_category)
            # ex: {'分類': '基本資訊', '問題列表': [...]}
            elif '分類' in obj and '問題列表' in obj:
                curr_category = obj['分類']
                if isinstance(obj['問題列表'], list):
                    for qa in obj['問題列表']:
                        if (
                            isinstance(qa, dict)
                            and '問題' in qa and '解答' in qa
                        ):
                            qa_pair = {
                                "id": str(uuid.uuid4()),
                                "text": f"問題：{qa['問題']}\n答案：{qa['解答']}",
                                "metadata": {
                                    "question": qa["問題"],
                                    "answer": qa["解答"],
                                    "main_category": main_category,
                                    "category": curr_category,
                                    "importance": qa.get("重要程度", None),
                                    "keywords": qa.get("關鍵字", []),
                                    "resources": qa.get("相關資源", [])
                                }
                            }
                            qa_pairs.append(qa_pair)
                # else: 問題列表不是 list，略過
            # ex: {'分類': '成績查詢', '問題': '...', '解答': '...'}
            elif '分類' in obj and '問題' in obj and '解答' in obj:
                qa_pair = {
                    "id": str(uuid.uuid4()),
                    "text": f"問題：{obj['問題']}\n答案：{obj['解答']}",
                    "metadata": {
                        "question": obj["問題"],
                        "answer": obj["解答"],
                        "main_category": main_category,
                        "category": obj["分類"],
                        "importance": obj.get("重要程度", None),
                        "keywords": obj.get("關鍵字", []),
                        "resources": obj.get("相關資源", [])
                    }
                }
                qa_pairs.append(qa_pair)
            # ex: {'分類': '後續處理', '問題': [...]}
            elif '分類' in obj and '問題' in obj and isinstance(obj['問題'], list):
                curr_category = obj['分類']
                extract_qa(obj['問題'], main_category, curr_category)
            # ex: {'QA': [...]}
            elif 'QA' in obj and isinstance(obj['QA'], list):
                extract_qa(obj['QA'], main_category, category)
            else:
                for v in obj.values():
                    extract_qa(v, main_category, category)
        # else: obj 為 str 或其他型態，直接略過

    # 入口：最外層通常為 dict
    if isinstance(data, dict):
        for k, v in data.items():
            extract_qa(v, main_category=k)
    elif isinstance(data, list):
        extract_qa(data)
    else:
        raise ValueError("不支援的 JSON 結構")

    return qa_pairs


def batch_process(items, batch_size=90):
    """將項目分批處理"""
    for i in range(0, len(items), batch_size):
        yield items[i:i + batch_size]


def main():
    # 設定命令列參數解析
    parser = argparse.ArgumentParser(description='處理 Q&A 資料並上傳到 Pinecone')
    parser.add_argument('--file', type=str, required=True,
                        help='Q&A 資料的 JSON 文件路徑')
    args = parser.parse_args()

    try:
        # 初始化 Pinecone 向量資料庫
        _, pinecone_index = initialize_pinecone()

        # 處理 Q&A 資料
        qa_pairs = process_qa_data(args.file)
        logging.info(f"已處理 {len(qa_pairs)} 個問答對")

        # 設定 Cohere API
        cohere_api_key = os.getenv("COHERE_API_KEY")
        if not cohere_api_key:
            raise ValueError("請確保已設置 COHERE_API_KEY 環境變數")

        try:
            # 初始化 Cohere 客戶端
            co = ClientV2(api_key=cohere_api_key)
            logging.info("使用 Cohere 嵌入模型: embed-multilingual-v3.0")

            # 分批處理文本嵌入
            total_processed = 0
            for batch_idx, qa_batch in enumerate(batch_process(qa_pairs, 90)):
                logging.info(f"處理第 {batch_idx + 1} 批次，共 {len(qa_batch)} 個問答對")

                # 準備文本進行嵌入
                texts = [qa["text"] for qa in qa_batch]

                try:
                    # 使用 Cohere 生成文本嵌入向量
                    response = co.embed(
                        texts=texts,
                        model="embed-multilingual-v3.0",  # 使用多語言模型
                        input_type="search_document",     # 指定輸入類型為搜索文檔
                        embedding_types=["float"]         # 指定嵌入類型為浮點數
                    )
                    # 獲取 float 類型的嵌入向量
                    embeddings = response.embeddings.float

                    logging.info(f"生成的嵌入維度: {len(embeddings[0])}")

                    # 準備上傳向量到 Pinecone
                    vectors_to_upsert = []
                    for i, qa in enumerate(qa_batch):
                        # 為每個問答對創建向量記錄
                        vector = {
                            "id": qa["id"],              # 唯一識別碼
                            "values": embeddings[i],     # 嵌入向量
                            "metadata": qa["metadata"]   # 元數據
                        }
                        vectors_to_upsert.append(vector)

                    # 批次上傳向量到 Pinecone
                    pinecone_index.upsert(vectors=vectors_to_upsert)
                    time.sleep(1)  # 等待上傳完成
                    total_processed += len(qa_batch)
                    logging.info(
                        f"已成功處理並上傳 {total_processed}/{len(qa_pairs)} 個問答對")

                except Exception as e:
                    # 處理嵌入生成過程中的錯誤
                    logging.error(f"處理批次 {batch_idx + 1} 時發生錯誤: {str(e)}")
                    import traceback
                    traceback.print_exc()
                    continue

            # 等待所有上傳完成
            time.sleep(10)

            # 驗證上傳結果
            stats = pinecone_index.describe_index_stats()
            logging.info(f"\n上傳後的索引統計信息:")
            logging.info(f"總向量數: {stats.total_vector_count}")
            logging.info(f"命名空間: {stats.namespaces}")

            if stats.total_vector_count == 0:
                logging.error("警告：上傳後索引中沒有向量！")
            else:
                logging.info("\n成功將問答資料索引到 Pinecone！")

        except Exception as e:
            # 處理 Cohere 客戶端初始化錯誤
            logging.error(f"Cohere 客戶端初始化錯誤: {str(e)}")
            import traceback
            traceback.print_exc()

    except Exception as e:
        # 處理整體流程中的錯誤
        logging.error(f"錯誤: {str(e)}")
        import traceback
        traceback.print_exc()


# 程式入口點
if __name__ == "__main__":
    main()
