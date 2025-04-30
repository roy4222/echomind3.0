/**
 * 相似度計算和分數校準邏輯
 */
import { vectorLogger } from '../../utils/logger';

/**
 * 相似度計算服務
 * 提供各種相似度計算和分數校準的方法
 */
export class SimilarityService {
  /**
   * 使用 sigmoid 函數校準相關性分數
   * @param score 原始分數
   * @returns 校準後的分數 (0-1 範圍)
   */
  static calibrateScore(score: number): number {
    // 參數調整
    const scaleFactor = 8.0; // 控制 sigmoid 函數的陡陡度
    const midPoint = 0.5;    // 控制 sigmoid 函數的中點
    
    // 使用 sigmoid 函數進行分數校準
    // sigmoid(x) = 1 / (1 + e^(-k * (x - midPoint)))
    const calibrated = 1.0 / (1.0 + Math.exp(-scaleFactor * (score - midPoint)));
    
    // 調整範圍使分數分布更均勻
    // 將 sigmoid 函數轉換為 0.1-0.9 的範圍，避免極端值
    const minOutput = 0.1;
    const maxOutput = 0.95;
    const scaledOutput = minOutput + calibrated * (maxOutput - minOutput);
    
    vectorLogger.debug('分數校準', {
      originalScore: score,
      calibratedScore: calibrated,
      finalScore: scaledOutput
    });
    
    return scaledOutput;
  }

  /**
   * 計算兩個問題的相似度
   * @param question1 第一個問題
   * @param question2 第二個問題
   * @returns 相似度分數 (0-1)
   */
  static calculateQuestionSimilarity(question1: string, question2: string): number {
    // 將問題轉換為小寫並分詞
    const words1 = question1.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    const words2 = question2.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    
    // 計算共同詞彙
    const commonWords = words1.filter(word => words2.includes(word));
    
    // 計算 Jaccard 相似度
    const union = new Set([...words1, ...words2]);
    const jaccardSimilarity = union.size > 0 ? commonWords.length / union.size : 0;
    
    // 計算字元相同比例 (對於中文特別有用)
    // 將兩個問題轉換為字元數組
    const chars1 = [...question1.toLowerCase()];
    const chars2 = [...question2.toLowerCase()];
    
    // 尋找共同字元
    const commonChars = chars1.filter(char => chars2.includes(char));
    
    // 計算字元相似度 (Dice 係數)
    const charSimilarity = (chars1.length + chars2.length) > 0 ? 
        (2 * commonChars.length) / (chars1.length + chars2.length) : 0;
    
    // 結合兩種相似度，給予詞彙相似度更高的權重
    const combinedSimilarity = (jaccardSimilarity * 0.7) + (charSimilarity * 0.3);
    
    return combinedSimilarity;
  }

  /**
   * 計算兩個字串的相似度
   * @param str1 第一個字串
   * @param str2 第二個字串
   * @returns 相似度分數 (0-1)
   */
  static calculateStringSimilarity(str1: string, str2: string): number {
    // 如果字串相同，直接返回 1.0
    if (str1 === str2) return 1.0;
    
    // 如果其中一個字串為空，返回 0
    if (!str1 || !str2) return 0.0;
    
    // 轉換為小寫並去除過多空白
    const s1 = str1.toLowerCase().trim().replace(/\s+/g, ' ');
    const s2 = str2.toLowerCase().trim().replace(/\s+/g, ' ');
    
    // 計算 Levenshtein 距離 (編輯距離)
    const len1 = s1.length;
    const len2 = s2.length;
    
    // 初始化距離矩陣
    const dp: number[][] = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    
    // 基本情況初始化
    for (let i = 0; i <= len1; i++) dp[i][0] = i;
    for (let j = 0; j <= len2; j++) dp[0][j] = j;
    
    // 動態規劃計算
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // 刪除
          dp[i][j - 1] + 1,      // 插入
          dp[i - 1][j - 1] + cost // 替換
        );
      }
    }
    
    // 計算正規化的相似度分數
    const maxLen = Math.max(len1, len2);
    if (maxLen === 0) return 1.0; // 兩個均為空字串
    
    // 將編輯距離轉換為相似度分數
    return 1.0 - (dp[len1][len2] / maxLen);
  }

  /**
   * 將兩個答案組合成一個更完整的答案
   * @param primaryAnswer 主要答案
   * @param secondaryAnswer 次要答案
   * @returns 組合後的答案
   */
  static combineAnswers(primaryAnswer: string, secondaryAnswer: string): string {
    // 如果兩個答案完全相同，直接返回主要答案
    if (primaryAnswer === secondaryAnswer) {
      return primaryAnswer;
    }
    
    // 如果主要答案包含次要答案，返回主要答案
    if (primaryAnswer.includes(secondaryAnswer)) {
      return primaryAnswer;
    }
    
    // 如果次要答案包含主要答案，返回次要答案
    if (secondaryAnswer.includes(primaryAnswer)) {
      return secondaryAnswer;
    }
    
    // 拆分答案為句子
    const primarySentences = primaryAnswer.split(/[.，,.!！？?]\s*/).filter(s => s.trim());
    const secondarySentences = secondaryAnswer.split(/[.，,.!！？?]\s*/).filter(s => s.trim());
    
    // 管理防止重複句子
    const uniqueSentences = new Set<string>(primarySentences);
    
    // 添加非重複的次要句子
    for (const sentence of secondarySentences) {
      let isDuplicate = false;
      
      // 檢查是否包含相似句子
      for (const existingSentence of uniqueSentences) {
        // 使用精確字串匹配或計算相似度
        if (existingSentence.includes(sentence) || 
            sentence.includes(existingSentence) ||
            this.calculateStringSimilarity(existingSentence, sentence) > 0.7) {
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        uniqueSentences.add(sentence);
      }
    }
    
    // 將精選的句子重新組合為答案
    return Array.from(uniqueSentences).join('. ') + '.';
  }

  /**
   * 動態計算相似度閾值
   * @param query 查詢文本
   * @param baseThreshold 基礎閾值
   * @returns 調整後的閾值
   */
  static calculateDynamicThreshold(query: string, baseThreshold: number): number {
    // 基於查詢長度的動態閾值調整
    const queryLength = query.length;
    let dynamicThreshold = baseThreshold;
    
    // 短查詢需要更高的閾值來減少誤匹配
    if (queryLength < 5) {
      dynamicThreshold = baseThreshold * 1.5;
    } 
    // 中等長度查詢使用基礎閾值
    else if (queryLength >= 5 && queryLength <= 20) {
      dynamicThreshold = baseThreshold;
    } 
    // 長查詢降低閾值以獲取更多相關結果
    else {
      // 最低不低於基礎閾值的 70%
      dynamicThreshold = Math.max(baseThreshold * 0.7, 0.07);
    }
    
    vectorLogger.debug('計算動態閾值', { 
      originalThreshold: baseThreshold, 
      dynamicThreshold: dynamicThreshold,
      queryLength: queryLength
    });
    
    return dynamicThreshold;
  }
}
