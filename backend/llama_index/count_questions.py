import json

# 遞迴計算所有巢狀問題數量，確保所有 Q&A 都被統計

def count_questions(obj):
    count = 0
    if isinstance(obj, dict):
        # 如果這層有 "問題" 欄位且型態為字串，視為一筆 Q&A
        if "問題" in obj and isinstance(obj["問題"], str):
            count += 1
        # 如果這層有 "問題列表" 或 "QA"，遞迴加總裡面每一筆
        for key, value in obj.items():
            if key in ["問題列表", "QA"] and isinstance(value, list):
                for item in value:
                    count += count_questions(item)
            elif isinstance(value, (dict, list)):
                count += count_questions(value)
    elif isinstance(obj, list):
        for item in obj:
            count += count_questions(item)
    return count

with open("backend/llama_index/example.json", "r", encoding="utf-8") as f:
    data = json.load(f)

總數 = count_questions(data)
print(f"總問題數：約 {總數} 筆")