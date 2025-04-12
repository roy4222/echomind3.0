 import { ChatMessage } from '@/lib/types/chat';
import { motion } from 'framer-motion';
import { UserCircle, Bot } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

/**
 * 聊天訊息列表元件屬性介面定義
 */
interface ChatMessageListProps {
  /** 聊天訊息陣列 */
  messages: ChatMessage[];
  /** 是否正在載入中 */
  isLoading: boolean;
  /** 錯誤訊息 */
  error: string | null;
}

/**
 * 處理用戶訊息中的特殊格式
 * 將**文字**轉換為標題樣式的粗體文字
 * @param text - 要處理的文字字串
 * @returns 處理後的 JSX 元素陣列或原始文字
 */
const formatUserMessage = (text: string) => {
  // 使用正則表達式匹配 **文字** 格式
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  // 循環處理所有匹配項
  while ((match = boldRegex.exec(text)) !== null) {
    // 添加匹配前的普通文字
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`} className="normal-text">
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }

    // 添加粗體樣式的文字
    parts.push(
      <span key={`bold-${match.index}`} className="font-bold text-lg">
        {match[1]}
      </span>
    );

    lastIndex = match.index + match[0].length;
  }

  // 添加最後一段未匹配的文字
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`} className="normal-text">
        {text.substring(lastIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : text;
};

/**
 * 格式化AI助手訊息
 * 處理多種格式：
 * - 標題 (# 開頭)
 * - 列表 (- 開頭)
 * - 粗體文字 (**文字**)
 * - 思考鏈 (<think>內容</think>)
 * - Markdown 格式
 * @param text - 要格式化的文字
 * @returns 格式化後的 JSX 元素
 */
const formatAssistantMessage = (text: string) => {
  // 處理思考鏈部分
  const thinkMatch = text.match(/<think>([\s\S]*?)<\/think>/);
  const thinkContent = thinkMatch ? thinkMatch[1].trim() : null;
  
  // 移除思考鏈部分，只處理剩餘文字
  const cleanedText = thinkContent ? text.replace(/<think>[\s\S]*?<\/think>/, '').trim() : text;

  // 將文字分割成行
  const lines = cleanedText.split('\n');
  const formattedLines = [];
  
  // 如果有思考鏈內容，添加可折疊區塊
  if (thinkContent) {
    formattedLines.push(
      <div key="thinking-chain" className="mb-4">
        {/* 使用 HTML5 details/summary 元素創建可折疊區塊 */}
        <details className="thinking-chain">
          {/* summary 元素作為可點擊的標題區域 */}
          <summary className="cursor-pointer p-2 bg-purple-100 dark:bg-purple-900/40 rounded-t-lg font-medium flex items-center text-purple-800 dark:text-purple-300">
            {/* 思考過程的圖示 */}
            <span className="mr-2">💭</span> 思考過程
            {/* 下拉箭頭圖示 */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          {/* 思考內容區域 */}
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-b-lg text-sm whitespace-pre-wrap">
            {thinkContent}
          </div>
        </details>
      </div>
    );
  }

  // 處理 Markdown 格式
  let inCodeBlock = false;
  let codeContent = '';
  let codeLanguage = '';
  
  // 遍歷每一行文字
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 處理代碼塊
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        // 開始代碼塊
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
        codeContent = '';
      } else {
        // 結束代碼塊
        inCodeBlock = false;
        formattedLines.push(
          <pre key={`code-${i}`} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto my-2">
            <code className={`language-${codeLanguage}`}>{codeContent}</code>
          </pre>
        );
      }
      continue;
    }
    
    // 如果在代碼塊內，添加到代碼內容
    if (inCodeBlock) {
      codeContent += line + '\n';
      continue;
    }
    
    // 處理標題 (### 開頭)
    if (line.startsWith('###')) {
      formattedLines.push(
        <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-purple-700 dark:text-purple-300">
          {line.substring(3).trim()}
        </h3>
      );
    }
    // 處理標題 (## 開頭)
    else if (line.startsWith('##')) {
      formattedLines.push(
        <h2 key={i} className="text-xl font-bold mt-4 mb-2 text-purple-700 dark:text-purple-300">
          {line.substring(2).trim()}
        </h2>
      );
    }
    // 處理標題 (# 開頭)
    else if (line.startsWith('#')) {
      formattedLines.push(
        <h1 key={i} className="text-2xl font-bold mt-4 mb-2 text-purple-700 dark:text-purple-300">
          {line.substring(1).trim()}
        </h1>
      );
    }
    // 處理列表項 (- 開頭)
    else if (line.trim().startsWith('-')) {
      formattedLines.push(
        <div key={i} className="flex items-start mt-1">
          <span className="mr-2 mt-1">•</span>
          <span>{formatUserMessage(line.substring(line.indexOf('-') + 1).trim())}</span>
        </div>
      );
    }
    // 處理分隔線 (---)
    else if (line.trim() === '---') {
      formattedLines.push(
        <hr key={i} className="my-3 border-t border-gray-200 dark:border-gray-700" />
      );
    }
    // 處理一般文字，包含粗體格式
    else {
      formattedLines.push(
        <p key={i} className={i > 0 && line.trim() ? 'mt-2' : ''}>
          {formatUserMessage(line)}
        </p>
      );
    }
  }
  
  return <div className="space-y-1">{formattedLines}</div>;
};

/**
 * 聊天訊息列表元件
 * 功能：
 * 1. 顯示用戶和AI助手的對話訊息
 * 2. 支援多種文字格式化
 * 3. 顯示載入狀態和錯誤訊息
 * 4. 根據發送者區分訊息樣式
 */
export const ChatMessageList = ({
  messages,
  isLoading,
  error,
}: ChatMessageListProps) => {
  // 獲取當前主題設置
  const { resolvedTheme } = useTheme();
  // 判斷是否為深色主題
  const isDark = resolvedTheme === 'dark';
  // 獲取當前登入用戶資訊
  const { user } = useAuth();

  return (
    <div className="space-y-8 py-4">
      {/* 遍歷並顯示所有訊息 */}
      {messages.map((message, index) => (
        // 使用 motion.div 添加動畫效果
        <motion.div
          key={message.id || index}
          // 初始狀態：透明度為0，向下偏移10px
          initial={{ opacity: 0, y: 10 }}
          // 動畫結束狀態：完全顯示且回到原位
          animate={{ opacity: 1, y: 0 }}
          // 動畫持續時間及延遲設定
          transition={{ duration: 0.3, delay: index * 0.1 }}
          // 根據消息發送者調整排列方向
          className={`flex items-start gap-3 ${
            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* 頭像區塊 */}
          <div className="flex-shrink-0">
            {message.role === 'user' ? (
              // 如果是用戶且有頭像，顯示用戶頭像
              user && user.photoURL ? (
                <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-blue-100 dark:border-blue-900">
                  <Image 
                    src={user.photoURL} 
                    alt={user.displayName || '用戶'} 
                    width={36} 
                    height={36}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                // 如果用戶沒有頭像，顯示默認頭像圖標
                <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                  <UserCircle size={24} />
                </div>
              )
            ) : (
              // 如果是AI助手，顯示機器人圖標
              <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                <Bot size={22} />
              </div>
            )}
          </div>

          {/* 訊息氣泡框 */}
          <div
            className={`relative max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm ${
              message.role === 'user'
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' // 用戶訊息樣式
                : isDark 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border border-gray-700' // 深色模式下AI訊息樣式
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border border-gray-200' // 淺色模式下AI訊息樣式
            }`}
          >
            
            {/* 根據角色使用不同的格式化方法顯示訊息內容 */}
            {message.role === 'assistant' 
              ? (
                <>
                  {formatAssistantMessage(message.content)}
                </>
              ) // 處理AI助手訊息
              : (
                <>
                  {/* 如果用戶訊息包含圖片，顯示圖片 */}
                  {(message.role === 'user' && (message.imageUrl || message.image)) && (
                    <div className="mb-3">
                      <img 
                        src={typeof message.image === 'string' && message.image.startsWith('data:') 
                          ? message.image 
                          : message.imageUrl} 
                        alt="用戶上傳圖片" 
                        className="max-h-64 w-auto rounded-lg object-contain"
                      />
                    </div>
                  )}
                  {/* 顯示用戶文字內容，按行分割並處理格式 */}
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {typeof formatUserMessage(line) === 'string' 
                        ? line // 如果格式化結果是字串，直接顯示
                        : formatUserMessage(line) // 如果是JSX元素陣列，渲染元素
                      }
                    </p>
                  ))}
                </>
              )
            }
          </div>
        </motion.div>
      ))}
      
      {/* 錯誤訊息顯示區塊 */}
      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-500 dark:border-red-800 dark:bg-red-900/50 dark:text-red-400"
        >
          {error}
        </motion.div>
      )}
      
      {/* 載入中動畫指示器 */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex items-start gap-3">
            {/* AI頭像 */}
            <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
              <Bot size={22} />
            </div>
            {/* 載入動畫氣泡 */}
            <div className="relative rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-5 py-3 border border-gray-200 dark:border-gray-700">
              {/* 氣泡尖角 */}
              <div className="absolute top-3 left-[-6px] w-3 h-3 rotate-45 bg-gray-50 dark:bg-gray-800" />
              {/* 脈動圓點載入動畫 */}
              <div className="flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" className="text-gray-400 dark:text-gray-500">
                  <circle cx="4" cy="12" r="1.5" fill="currentColor">
                    <animate attributeName="r" dur="0.75s" repeatCount="indefinite" values="1.5;3;1.5"/>
                  </circle>
                  <circle cx="12" cy="12" r="3" fill="currentColor">
                    <animate attributeName="r" dur="0.75s" repeatCount="indefinite" values="3;1.5;3"/>
                  </circle>
                  <circle cx="20" cy="12" r="1.5" fill="currentColor">
                    <animate attributeName="r" dur="0.75s" repeatCount="indefinite" values="1.5;3;1.5"/>
                  </circle>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 