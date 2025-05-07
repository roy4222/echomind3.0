
# ChatHistoryService 與 Firebase Firestore 互動詳解

## 初始化與連接 Firebase

```typescript
private db: Firestore;

constructor() {
  this.db = getFirestore(app);
}
```

服務在建構時初始化 Firestore 連接，使用從 `@/lib/firebase` 導入的 app 實例。

## 資料結構

Firestore 資料庫結構如下：
- `users/{userId}/chats/{chatId}` - 儲存聊天的主文件
- `users/{userId}/chats/{chatId}/messages/{messageId}` - 儲存聊天訊息

## Firestore 互動函數詳解

### 1. 讀取操作

#### 取得單一聊天記錄
```typescript
async getChat(chatId: string): Promise<ChatHistory | null> {
  // 驗證用戶
  if (!authService.validateUser('請先登入以使用聊天歷史功能') || !chatId) return null;

  try {
    const userId = authService.getUserId() as string;
    
    // 讀取聊天主文件
    const chatRef = doc(this.db, 'users', userId, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);
    
    if (!chatSnap.exists()) {
      console.log(`找不到聊天記錄: ${chatId}`);
      return null;
    }
    
    const chatData = chatSnap.data() as ChatHistory;
    
    // 讀取所有訊息
    const messagesCollectionRef = collection(this.db, 'users', userId, 'chats', chatId, 'messages');
    const messagesQuery = query(messagesCollectionRef, orderBy('createdAt', 'asc'));
    const messagesSnap = await getDocs(messagesQuery);
    
    const messages: ChatMessage[] = [];
    messagesSnap.forEach((doc) => {
      messages.push(doc.data() as ChatMessage);
    });
    
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
```

#### 取得所有聊天記錄
```typescript
async getAllChats(): Promise<ChatHistory[]> {
  try {
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
```

### 2. 寫入操作

#### 創建新聊天
```typescript
async createChat(messages: ChatMessage[], title: string = '新對話', modelId: string = 'default'): Promise<string> {
  try {
    const userId = authService.getUserId() as string;
    
    // 產生新的聊天 ID
    const chatId = doc(collection(this.db, 'chats')).id;
    
    // 處理資料
    const cleanedMessages = this.cleanMessages(messages);
    const processedMessages = await this.processMessagesWithImages(cleanedMessages, userId, chatId);
    
    // 構建聊天主文件資料
    const chatData: ChatHistory = {
      id: chatId,
      title,
      modelId,
      lastUpdated: now,
      createdAt: now,
      lastMessagePreview,
      messageCount: processedMessages.length
    };

    // 寫入聊天主文件
    const chatRef = doc(this.db, 'users', userId, 'chats', chatId);
    await setDoc(chatRef, chatData);
    
    // 添加訊息到子集合
    if (processedMessages.length > 0) {
      await this.addMessagesToChat(userId, chatId, processedMessages);
    }
    
    return chatId;
  } catch (error) {
    console.error('建立聊天記錄失敗:', error);
    toast.error('無法儲存聊天記錄');
    return '';
  }
}
```

#### 添加訊息
```typescript
async addMessage(chatId: string, message: ChatMessage): Promise<boolean> {
  try {
    const userId = authService.getUserId() as string;
    
    // 處理訊息
    const cleanedMessage = this.cleanObject<ChatMessage>(message);
    cleanedMessage.id = cleanedMessage.id || doc(collection(this.db, 'messages')).id;
    
    // 處理圖片
    if (cleanedMessage.image) {
      const imageFile = this.base64ToFile(cleanedMessage.image, `chat-image-${cleanedMessage.id}.jpg`);
      const path = `images/chats/${userId}/${chatId}/${cleanedMessage.id}`;
      const imageUrl = await uploadService.uploadFile(imageFile, path);
      
      cleanedMessage.imageUrl = imageUrl;
      delete cleanedMessage.image;
    }
    
    // 寫入訊息
    const messageRef = doc(collection(this.db, 'users', userId, 'chats', chatId, 'messages'), cleanedMessage.id);
    await setDoc(messageRef, cleanedMessage);
    
    // 更新聊天主文件
    const chatRef = doc(this.db, 'users', userId, 'chats', chatId);
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
```

### 3. 批次操作

```typescript
private async addMessagesToChat(userId: string, chatId: string, messages: ChatMessage[]): Promise<void> {
  // 使用批次寫入提高效能
  const batch = writeBatch(this.db);
  const messagesCollectionRef = collection(this.db, 'users', userId, 'chats', chatId, 'messages');
  
  for (const message of messages) {
    const messageWithMeta = {
      ...message,
      id: message.id || doc(collection(this.db, 'messages')).id,
      createdAt: message.createdAt || Date.now()
    };
    
    const cleanedMessage = this.cleanObject<ChatMessage>(messageWithMeta);
    
    // 將訊息加入批次
    const messageRef = doc(messagesCollectionRef, cleanedMessage.id);
    batch.set(messageRef, cleanedMessage);
  }
  
  // 一次性執行所有操作
  await batch.commit();
}
```

### 4. 刪除操作

```typescript
async deleteChat(chatId: string): Promise<boolean> {
  try {
    const userId = authService.getUserId() as string;
    
    // 先取得所有訊息
    const messagesCollectionRef = collection(this.db, 'users', userId, 'chats', chatId, 'messages');
    const messagesSnap = await getDocs(messagesCollectionRef);
    
    const batch = writeBatch(this.db);
    
    // 標記所有訊息為刪除
    messagesSnap.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // 標記聊天主文件為刪除
    const chatRef = doc(this.db, 'users', userId, 'chats', chatId);
    batch.delete(chatRef);
    
    // 執行批次刪除
    await batch.commit();
    
    return true;
  } catch (error) {
    console.error('刪除聊天記錄失敗:', error);
    toast.error('無法刪除聊天記錄');
    return false;
  }
}
```

## 特殊處理功能

1. **圖片處理**：將 base64 圖片上傳到 Cloudflare R2，然後僅保存 URL
   ```typescript
   private async processMessagesWithImages(messages: ChatMessage[], userId: string, chatId: string)
   ```

2. **清理 Firestore 不支援的資料**：Firestore 不接受 undefined 值
   ```typescript
   private cleanObject<T>(obj: any): T
   ```

3. **批次處理**：使用 `writeBatch` 進行批次操作，提高效能並確保原子性
   ```typescript
   const batch = writeBatch(this.db);
   // 添加操作...
   await batch.commit();
   ```

4. **交易安全**：所有操作都包含錯誤處理，並向用戶顯示友好的錯誤訊息
   ```typescript
   try {
     // 操作...
   } catch (error) {
     console.error('錯誤訊息:', error);
     toast.error('用戶友好的錯誤提示');
   }
   ```

這個服務充分利用了 Firestore 的集合、子集合結構，並運用批次操作提高效能，同時包含了完善的圖片處理和錯誤處理機制。
