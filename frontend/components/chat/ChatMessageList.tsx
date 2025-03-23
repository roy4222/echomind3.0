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
 * @param text - 要格式化的文字
 * @returns 格式化後的 JSX 元素
 */
const formatAssistantMessage = (text: string) => {
  // 將文字分割成行
  const lines = text.split('\n');
  const formattedLines = [];
  
  // 逐行處理文字格式
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 處理標題格式 (# 開頭)
    if (line.match(/^#+\s/)) {
      const headingMatch = line.match(/^(#+)\s/);
      if (headingMatch) {
        const level = headingMatch[1].length; // 獲取標題層級
        const content = line.replace(/^#+\s/, '');
        const fontSize = level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg';
        formattedLines.push(
          <h1 key={i} className={`font-bold ${fontSize} mb-2`}>
            {content}
          </h1>
        );
      }
    } 
    // 處理列表項目 (- 開頭)
    else if (line.match(/^\s*-\s/)) {
      const content = line.replace(/^\s*-\s/, '');
      formattedLines.push(
        <div key={i} className="flex mb-1 pl-2">
          <span className="mr-2">•</span>
          <span>{formatUserMessage(content)}</span>
        </div>
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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { user } = useAuth();

  return (
    <div className="space-y-8 py-4">
      {/* 遍歷並顯示所有訊息 */}
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`flex items-start gap-3 ${
            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* 頭像 */}
          <div className="flex-shrink-0">
            {message.role === 'user' ? (
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
                <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                  <UserCircle size={24} />
                </div>
              )
            ) : (
              <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                <Bot size={22} />
              </div>
            )}
          </div>

          {/* 訊息氣泡框 */}
          <div
            className={`relative max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm ${
              message.role === 'user'
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                : isDark 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border border-gray-700'
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border border-gray-200'
            }`}
          >
            
            {/* 根據角色使用不同的格式化方法 */}
            {message.role === 'assistant' 
              ? formatAssistantMessage(message.content)
              : message.content.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>
                    {typeof formatUserMessage(line) === 'string' 
                      ? line 
                      : formatUserMessage(line)}
                  </p>
                ))
            }
          </div>
        </motion.div>
      ))}
      
      {/* 錯誤訊息顯示 */}
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
            <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
              <Bot size={22} />
            </div>
            <div className="relative rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-5 py-3 border border-gray-200 dark:border-gray-700">
              <div className="absolute top-3 left-[-6px] w-3 h-3 rotate-45 bg-gray-50 dark:bg-gray-800" />
              <div className="flex space-x-2">
                <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500 [animation-delay:-0.3s]"></div>
                <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500 [animation-delay:-0.15s]"></div>
                <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 