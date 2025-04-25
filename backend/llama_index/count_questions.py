import json

# 遞迴計算所有巢狀問題數量，確保所有 Q&A 都被統計
def count_questions(obj):
    count = 0
    if isinstance(obj, dict):
        # 如果這層有 "問題" 欄位且型態為字串，視為一筆 Q&A
        if "問題" in obj and isinstance(obj["問題"], str):
            count += 1
        # 遍歷字典中的每個鍵值對
        for key, value in obj.items():
            # 如果鍵名為 "問題列表" 或 "QA"，且值為列表，遞迴處理每個項目
            if key in ["問題列表", "QA"] and isinstance(value, list):
                for item in value:
                    count += count_questions(item)
            # 如果值是字典或列表，遞迴處理
            elif isinstance(value, (dict, list)):
                count += count_questions(value)
    # 如果是列表，遞迴處理每個項目
    elif isinstance(obj, list):
        for item in obj:
            count += count_questions(item)
    return count

# 開啟 JSON 檔案並讀取內容
with open("backend/llama_index/example.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# 計算總問題數並輸出結果
總數 = count_questions(data)
print(f"總問題數：約 {總數} 筆")