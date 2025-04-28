import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc,
  Firestore,
  addDoc,
  writeBatch,
  where,
  limit
} from 'firebase/firestore';
import { uploadService } from './upload';
import { app } from '@/lib/firebase';
import { ChatMessage, ChatHistory } from '@/lib/types/chat';
import { authService } from '@/lib/utils/auth';
import { toast } from 'sonner';

/**
 * 聊天歷史記錄服務
 * 管理聊天記錄的儲存和檢索
 */
export class ChatHistoryService {
  private db: Firestore;

  constructor() {
    this.db = getFirestore(app);
  }

  /**
   * 清理物件，移除所有 undefined 值
   * 這對 Firestore 尤其重要，因為它不接受 undefined 值
   * @param obj 要清理的物件
   * @returns 清理後的物件，不包含 undefined 值
   */
  private cleanObject<T>(obj: any): T {
    const cleanedObj = { ...obj };
    
    // 遍歷物件屬性
    Object.keys(cleanedObj).forEach(key => {
      const value = cleanedObj[key];
      
      // 如果值是 undefined，刪除該屬性
      if (value === undefined) {
        delete cleanedObj[key];
      } 
      // 如果值是物件，遞迴清理
      else if (value && typeof value === 'object' && !Array.isArray(value)) {
        cleanedObj[key] = this.cleanObject(value);
      }
      // 如果值是陣列，清理陣列中的每個物件
      else if (Array.isArray(value)) {
        cleanedObj[key] = value.map(item => 
          item && typeof item === 'object' ? this.cleanObject(item) : item
        );
      }
    });
    
    return cleanedObj as T;
  }

  /**
   * 清理訊息陣列，移除所有 undefined 值
   * @param messages 訊息陣列
   * @returns 清理後的訊息陣列
   */
  private cleanMessages(messages: ChatMessage[]): ChatMessage[] {
    return messages.map(message => this.cleanObject<ChatMessage>(message));
  }
  
  /**
   * 處理訊息陣列中的圖片，將圖片上傳到 R2
   * @param messages 訊息陣列
   * @param userId 用戶 ID
   * @param chatId 聊天 ID
   * @returns 處理後的訊息陣列
   */
  private async processMessagesWithImages(messages: ChatMessage[], userId: string, chatId: string): Promise<ChatMessage[]> {
    const processedMessages: ChatMessage[] = [];
    
    for (const message of messages) {
      // 如果沒有圖片或已有圖片 URL，直接添加到結果中
      if (!message.image || message.imageUrl) {
        processedMessages.push({ ...message });
        continue;
      }
      
      // 處理有圖片的訊息
      const processedMessage = { ...message };
      
      try {
        // 確保訊息有 ID
        processedMessage.id = processedMessage.id || doc(collection(this.db, 'messages')).id;
        
        // 確保圖片數據是有效的字串
        if (typeof processedMessage.image !== 'string' || !processedMessage.image) {
          console.warn('無效的圖片數據，跳過上傳');
          delete processedMessage.image;
          continue;
        }
        
        // 將 base64 圖片轉換為檔案對象
        const imageFile = this.base64ToFile(
          processedMessage.image, 
          `chat-image-${processedMessage.id}.jpg`
        );
        
        // 使用上傳服務上傳圖片到 R2
        const path = `images/chats/${userId}/${chatId}/${processedMessage.id}`;
        const imageUrl = await uploadService.uploadFile(imageFile, path);
        
        // 將圖片 URL 存入 imageUrl 欄位，並移除原始 base64 圖片
        processedMessage.imageUrl = imageUrl;
        delete processedMessage.image; // 移除 base64 圖片數據，避免存入 Firestore
      } catch (uploadError) {
        console.error('圖片上傳失敗:', uploadError);
        // 如果圖片上傳失敗，移除圖片數據以避免 Firestore 大小限制
        delete processedMessage.image;
      }
      
      processedMessages.push(processedMessage);
    }
    
    return processedMessages;
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
    if (!authService.validateUser('請先登入以使用聊天歷史功能')) return '';

    try {
      // 確保 userId 非空
      const userId = authService.getUserId() as string;
      
      const chatId = doc(collection(this.db, 'chats')).id;
      const now = Date.now();
      
      // 清理訊息中的 undefined 值
      const cleanedMessages = this.cleanMessages(messages);
      
      // 處理圖片，將圖片上傳到 R2
      const processedMessages = await this.processMessagesWithImages(cleanedMessages, userId, chatId);
      
      // 計算最後一則訊息的預覽文字（最多 100 字）
      let lastMessagePreview = '';
      if (processedMessages.length > 0) {
        const lastMessage = processedMessages[processedMessages.length - 1];
        lastMessagePreview = lastMessage.content.substring(0, 100);
        if (lastMessage.content.length > 100) lastMessagePreview += '...';
      }
      
      // 建立聊天記錄主文件（不包含訊息內容）
      const chatData: ChatHistory = {
        id: chatId,
        title,
        modelId,
        lastUpdated: now,
        createdAt: now,
        lastMessagePreview,
        messageCount: processedMessages.length
      };

      const chatRef = doc(this.db, 'users', userId, 'chats', chatId);
      await setDoc(chatRef, chatData);
      
      // 將訊息儲存到子集合中
      if (processedMessages.length > 0) {
        await this.addMessagesToChat(userId, chatId, processedMessages);
      }
      
      console.log(`已建立新聊天記錄: ${chatId}`);
      return chatId;
    } catch (error) {
      console.error('建立聊天記錄失敗:', error);
      toast.error('無法儲存聊天記錄');
      return '';
    }
  }

  /**
   * 將訊息添加到聊天記錄的子集合中
   * @param userId 用戶 ID
   * @param chatId 聊天 ID
   * @param messages 要添加的訊息
   * @private
   */
  private async addMessagesToChat(
    userId: string,
    chatId: string,
    messages: ChatMessage[]
  ): Promise<void> {
    // 使用批次寫入以提高效能
    const batch = writeBatch(this.db);
    const messagesCollectionRef = collection(this.db, 'users', userId, 'chats', chatId, 'messages');
    
    for (const message of messages) {
      // 確保每條訊息都有 ID 和時間戳
      const messageWithMeta = {
        ...message,
        id: message.id || doc(collection(this.db, 'messages')).id,
        createdAt: message.createdAt || Date.now()
      };
      
      // 確保移除所有 undefined 值
      const cleanedMessage = this.cleanObject<ChatMessage>(messageWithMeta);
      
      // 特別檢查 imageUrl 欄位，確保它不是 undefined
      if (cleanedMessage.imageUrl === undefined) {
        delete cleanedMessage.imageUrl;
      }
      
      // 將訊息添加到批次中
      const messageRef = doc(messagesCollectionRef, cleanedMessage.id);
      batch.set(messageRef, cleanedMessage);
    }
    
    // 執行批次寫入
    await batch.commit();
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
    if (!authService.validateUser('請先登入以使用聊天歷史功能') || !chatId) return false;

    try {
      // 確保 userId 非空
      const userId = authService.getUserId() as string;
      
      const chatRef = doc(this.db, 'users', userId, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (!chatSnap.exists()) {
        toast.error('找不到指定的聊天記錄');
        return false;
      }
      
      // 清理訊息中的 undefined 值
      const cleanedMessages = this.cleanMessages(messages);
      
      // 處理圖片，將圖片上傳到 R2
      const processedMessages = await this.processMessagesWithImages(cleanedMessages, userId, chatId);
      
      // 計算最後一則訊息的預覽文字（最多 100 字）
      let lastMessagePreview = '';
      if (processedMessages.length > 0) {
        const lastMessage = processedMessages[processedMessages.length - 1];
        lastMessagePreview = lastMessage.content.substring(0, 100);
        if (lastMessage.content.length > 100) lastMessagePreview += '...';
      }
      
      // 更新聊天記錄主文件（不包含訊息內容）
      const updateData: Partial<ChatHistory> = {
        lastUpdated: Date.now(),
        lastMessagePreview,
        messageCount: processedMessages.length
      };

      if (title) updateData.title = title;
      if (modelId) updateData.modelId = modelId;

      await setDoc(chatRef, updateData, { merge: true });
      
      // 清除現有訊息並添加新訊息
      await this.replaceMessages(userId, chatId, processedMessages);
      
      console.log(`已更新聊天記錄: ${chatId}`);
      return true;
    } catch (error) {
      console.error('更新聊天記錄失敗:', error);
      toast.error('無法更新聊天記錄');
      return false;
    }
  }

  /**
   * 替換聊天記錄中的所有訊息
   * @param userId 用戶 ID
   * @param chatId 聊天 ID
   * @param messages 新的訊息陣列
   * @private
   */
  private async replaceMessages(
    userId: string,
    chatId: string,
    messages: ChatMessage[]
  ): Promise<void> {
    try {
      // 先刪除現有訊息
      const messagesCollectionRef = collection(this.db, 'users', userId, 'chats', chatId, 'messages');
      const existingMessagesSnap = await getDocs(messagesCollectionRef);
      
      const batch = writeBatch(this.db);
      
      // 將所有現有訊息標記為刪除
      existingMessagesSnap.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // 提交刪除操作
      await batch.commit();
      
      // 添加新訊息，確保清理所有 undefined 值
      const cleanedMessages = messages.map(message => {
        // 先清理所有 undefined 值
        const cleaned = this.cleanObject<ChatMessage>(message);
        
        // 特別檢查 imageUrl 欄位，確保它不是 undefined
        if (cleaned.imageUrl === undefined) {
          delete cleaned.imageUrl;
        }
        
        return cleaned;
      });
      
      await this.addMessagesToChat(userId, chatId, cleanedMessages);
    } catch (error) {
      console.error('替換訊息失敗:', error);
      throw error; // 向上傳遞錯誤以便調用方處理
    }
  }

  /**
   * 更新聊天標題
   * @param chatId 聊天 ID
   * @param title 新標題
   * @returns 是否成功更新
   */
  async updateChatTitle(chatId: string, title: string): Promise<boolean> {
    if (!authService.validateUser('請先登入以使用聊天歷史功能') || !chatId) return false;

    try {
      // 確保 userId 非空
      const userId = authService.getUserId() as string;
      
      const chatRef = doc(this.db, 'users', userId, 'chats', chatId);
      await setDoc(chatRef, { title, lastUpdated: Date.now() }, { merge: true });
      
      console.log(`已更新聊天標題: ${chatId}`);
      return true;
    } catch (error) {
      console.error('更新聊天標題失敗:', error);
      toast.error('無法更新聊天標題');
      return false;
    }
  }

  /**
   * 將 base64 圖片轉換為檔案對象
   * @param base64Image base64 編碼的圖片數據
   * @param filename 檔案名稱
   * @returns 檔案對象
   */
  private base64ToFile(base64Image: string, filename: string): File {
    if (!base64Image) {
      throw new Error('無效的圖片數據');
    }
    
    // 切分 base64 字串以取得 MIME 類型和實際數據
    const arr = base64Image.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1] || '');
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  }

  /**
   * 添加單一訊息到聊天記錄
   * @param chatId 聊天 ID
   * @param message 要添加的訊息
   * @returns 是否成功添加
   */
  async addMessage(chatId: string, message: ChatMessage): Promise<boolean> {
    if (!authService.validateUser('請先登入以使用聊天歷史功能') || !chatId) return false;

    try {
      // 確保 userId 非空
      const userId = authService.getUserId() as string;
      
      // 清理訊息中的 undefined 值
      const cleanedMessage = this.cleanObject<ChatMessage>(message);
      
      // 確保訊息有 ID 和時間戳
      cleanedMessage.id = cleanedMessage.id || doc(collection(this.db, 'messages')).id;
      cleanedMessage.createdAt = cleanedMessage.createdAt || Date.now();
      
      // 如果有圖片，先上傳到 Cloudflare R2
      if (cleanedMessage.image) {
        try {
          console.log('準備上傳圖片到 R2...');
          
          // 將 base64 圖片轉換為檔案對象
          const imageFile = this.base64ToFile(
            cleanedMessage.image, 
            `chat-image-${cleanedMessage.id}.jpg`
          );
          
          // 使用上傳服務上傳圖片到 R2
          const path = `images/chats/${userId}/${chatId}/${cleanedMessage.id}`;
          const imageUrl = await uploadService.uploadFile(imageFile, path);
          
          console.log('圖片上傳成功，已獲取 URL:', imageUrl);
          
          // 將圖片 URL 存入 imageUrl 欄位，並移除原始 base64 圖片
          cleanedMessage.imageUrl = imageUrl;
          delete cleanedMessage.image; // 移除 base64 圖片數據，避免存入 Firestore
        } catch (uploadError) {
          console.error('圖片上傳失敗:', uploadError);
          toast.error('圖片上傳失敗，但我們仍將儲存訊息');
          // 如果圖片上傳失敗，移除圖片數據以避免 Firestore 大小限制
          delete cleanedMessage.image;
        }
      }
      
      // 添加訊息到子集合
      const messageRef = doc(
        collection(this.db, 'users', userId, 'chats', chatId, 'messages'),
        cleanedMessage.id
      );
      await setDoc(messageRef, cleanedMessage);
      
      // 更新聊天記錄的最後更新時間和預覽
      const chatRef = doc(this.db, 'users', userId, 'chats', chatId);
      
      // 計算預覽文字（最多 100 字）
      let lastMessagePreview = cleanedMessage.content.substring(0, 100);
      if (cleanedMessage.content.length > 100) lastMessagePreview += '...';
      
      // 獲取當前訊息數量
      const messagesQuery = query(
        collection(this.db, 'users', userId, 'chats', chatId, 'messages'),
        limit(1000) // 設置一個合理的上限
      );
      const messagesSnap = await getDocs(messagesQuery);
      const messageCount = messagesSnap.size;
      
      await setDoc(chatRef, { 
        lastUpdated: Date.now(),
        lastMessagePreview,
        messageCount
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('添加訊息失敗:', error);
      toast.error('無法添加訊息');
      return false;
    }
  }

  /**
   * 取得單一聊天記錄（包含訊息）
   * @param chatId 聊天 ID
   * @returns 聊天歷史記錄或 null
   */
  async getChat(chatId: string): Promise<ChatHistory | null> {
    if (!authService.validateUser('請先登入以使用聊天歷史功能') || !chatId) return null;

    try {
      // 確保 userId 非空
      const userId = authService.getUserId() as string;
      
      // 獲取聊天主記錄
      const chatRef = doc(this.db, 'users', userId, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (!chatSnap.exists()) {
        console.log(`找不到聊天記錄: ${chatId}`);
        return null;
      }
      
      const chatData = chatSnap.data() as ChatHistory;
      
      // 獲取該聊天的所有訊息
      const messagesCollectionRef = collection(this.db, 'users', userId, 'chats', chatId, 'messages');
      const messagesQuery = query(messagesCollectionRef, orderBy('createdAt', 'asc'));
      const messagesSnap = await getDocs(messagesQuery);
      
      // 將訊息轉換為陣列
      const messages: ChatMessage[] = [];
      messagesSnap.forEach((doc) => {
        messages.push(doc.data() as ChatMessage);
      });
      
      // 返回完整的聊天記錄（包含訊息）
      return {
        ...chatData,
        messages
      } as ChatHistory;
    } catch (error) {
      console.error('取得聊天記錄失敗:', error);
      toast.error('無法載入聊天記錄');
      return null;
    }
  }

  /**
   * 取得使用者的所有聊天記錄（不包含訊息內容）
   * @returns 聊天歷史記錄陣列
   */
  async getAllChats(): Promise<ChatHistory[]> {
    if (!authService.validateUser('請先登入以使用聊天歷史功能')) return [];

    try {
      // 確保 userId 非空
      const userId = authService.getUserId() as string;
      
      const chatsCollectionRef = collection(this.db, 'users', userId, 'chats');
      const q = query(chatsCollectionRef, orderBy('lastUpdated', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const chats: ChatHistory[] = [];
      querySnapshot.forEach((doc) => {
        chats.push(doc.data() as ChatHistory);
      });
      
      return chats;
    } catch (error) {
      console.error('取得聊天記錄列表失敗:', error);
      toast.error('無法載入聊天記錄列表');
      return [];
    }
  }

  /**
   * 刪除聊天記錄（包含所有訊息）
   * @param chatId 聊天 ID
   * @returns 是否成功刪除
   */
  async deleteChat(chatId: string): Promise<boolean> {
    if (!authService.validateUser('請先登入以使用聊天歷史功能') || !chatId) return false;

    try {
      // 確保 userId 非空
      const userId = authService.getUserId() as string;
      
      // 刪除所有訊息
      const messagesCollectionRef = collection(this.db, 'users', userId, 'chats', chatId, 'messages');
      const messagesSnap = await getDocs(messagesCollectionRef);
      
      const batch = writeBatch(this.db);
      
      messagesSnap.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // 刪除聊天主記錄
      const chatRef = doc(this.db, 'users', userId, 'chats', chatId);
      batch.delete(chatRef);
      
      // 執行批次刪除
      await batch.commit();
      
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
