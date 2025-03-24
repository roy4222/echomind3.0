import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { ChatMessage } from '@/lib/types/chat';
import { toast } from 'sonner';

/**
 * 聊天歷史記錄介面
 */
export interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  modelId: string;
  lastUpdated: number;
  createdAt: number;
}

/**
 * 聊天歷史記錄服務
 * 管理聊天記錄的儲存和檢索
 */
export class ChatHistoryService {
  private db: Firestore;
  private userId: string | null = null;

  constructor() {
    this.db = getFirestore(app);
  }

  /**
   * 設定目前使用者 ID
   * @param userId 使用者 ID
   */
  setUserId(userId: string | null) {
    this.userId = userId;
  }

  /**
   * 驗證是否已設定使用者 ID
   */
  private validateUser(): boolean {
    if (!this.userId) {
      toast.error('請先登入以使用聊天歷史功能');
      return false;
    }
    return true;
  }

  /**
   * 建立新的聊天記錄
   * @param messages 聊天訊息
   * @param title 聊天標題
   * @param modelId 使用的模型 ID
   * @returns 聊天歷史記錄 ID
   */
  async createChat(
    messages: ChatMessage[],
    title: string = '新對話',
    modelId: string = 'default'
  ): Promise<string> {
    if (!this.validateUser()) return '';

    try {
      // 確保 userId 非空
      const userId = this.userId as string;
      
      const chatId = doc(collection(this.db, 'chats')).id;
      const now = Date.now();
      
      const chatData: ChatHistory = {
        id: chatId,
        title,
        messages,
        modelId,
        lastUpdated: now,
        createdAt: now
      };

      const chatRef = doc(this.db, 'users', userId, 'chats', chatId);
      await setDoc(chatRef, chatData);
      
      console.log(`已建立新聊天記錄: ${chatId}`);
      return chatId;
    } catch (error) {
      console.error('建立聊天記錄失敗:', error);
      toast.error('無法儲存聊天記錄');
      return '';
    }
  }

  /**
   * 更新現有聊天記錄
   * @param chatId 聊天 ID
   * @param messages 更新的訊息
   * @param title 更新的標題 (可選)
   * @param modelId 更新的模型 ID (可選)
   */
  async updateChat(
    chatId: string,
    messages: ChatMessage[],
    title?: string,
    modelId?: string
  ): Promise<boolean> {
    if (!this.validateUser() || !chatId) return false;

    try {
      // 確保 userId 非空
      const userId = this.userId as string;
      
      const chatRef = doc(this.db, 'users', userId, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (!chatSnap.exists()) {
        toast.error('找不到指定的聊天記錄');
        return false;
      }
      
      const updateData: Partial<ChatHistory> = {
        messages,
        lastUpdated: Date.now()
      };

      if (title) updateData.title = title;
      if (modelId) updateData.modelId = modelId;

      await setDoc(chatRef, updateData, { merge: true });
      console.log(`已更新聊天記錄: ${chatId}`);
      return true;
    } catch (error) {
      console.error('更新聊天記錄失敗:', error);
      toast.error('無法更新聊天記錄');
      return false;
    }
  }

  /**
   * 取得單一聊天記錄
   * @param chatId 聊天 ID
   * @returns 聊天歷史記錄或 null
   */
  async getChat(chatId: string): Promise<ChatHistory | null> {
    if (!this.validateUser() || !chatId) return null;

    try {
      // 確保 userId 非空
      const userId = this.userId as string;
      
      const chatRef = doc(this.db, 'users', userId, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (!chatSnap.exists()) {
        console.log(`找不到聊天記錄: ${chatId}`);
        return null;
      }
      
      return chatSnap.data() as ChatHistory;
    } catch (error) {
      console.error('取得聊天記錄失敗:', error);
      toast.error('無法載入聊天記錄');
      return null;
    }
  }

  /**
   * 取得使用者的所有聊天記錄
   * @returns 聊天歷史記錄陣列
   */
  async getAllChats(): Promise<ChatHistory[]> {
    if (!this.validateUser()) return [];

    try {
      // 確保 userId 非空
      const userId = this.userId as string;
      
      const chatsRef = collection(this.db, 'users', userId, 'chats');
      const q = query(chatsRef, orderBy('lastUpdated', 'desc'));
      const querySnap = await getDocs(q);
      
      const chats: ChatHistory[] = [];
      querySnap.forEach((doc) => {
        chats.push(doc.data() as ChatHistory);
      });
      
      return chats;
    } catch (error) {
      console.error('取得聊天記錄失敗:', error);
      toast.error('無法載入聊天記錄');
      return [];
    }
  }

  /**
   * 刪除聊天記錄
   * @param chatId 聊天 ID
   * @returns 是否成功刪除
   */
  async deleteChat(chatId: string): Promise<boolean> {
    if (!this.validateUser() || !chatId) return false;

    try {
      // 確保 userId 非空
      const userId = this.userId as string;
      
      const chatRef = doc(this.db, 'users', userId, 'chats', chatId);
      await deleteDoc(chatRef);
      console.log(`已刪除聊天記錄: ${chatId}`);
      return true;
    } catch (error) {
      console.error('刪除聊天記錄失敗:', error);
      toast.error('無法刪除聊天記錄');
      return false;
    }
  }

  /**
   * 根據聊天內容自動生成標題
   * @param messages 聊天訊息
   * @returns 生成的標題
   */
  private generateChatTitle(messages: ChatMessage[]): string {
    // 簡單的標題生成邏輯 - 使用第一條用戶訊息的前20個字元
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      const content = firstUserMessage.content.trim();
      return content.length > 20 
        ? content.substring(0, 20) + '...'
        : content;
    }
    return '新對話';
  }
}

// 建立並匯出默認的聊天歷史服務實例
export const chatHistoryService = new ChatHistoryService();
