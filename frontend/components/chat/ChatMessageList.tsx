import { ChatMessage } from '@/lib/types/chat';

/**
 * 聊天訊息列表元件屬性
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
 * 將**文字**轉換為標題樣式
 */
const formatUserMessage = (text: string) => {
  // 處理粗體標記 **文字** 轉換為標題樣式
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    // 添加匹配前的普通文字
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`} className="normal-text">
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }

    // 添加標題樣式的文字
    parts.push(
      <span key={`bold-${match.index}`} className="font-bold text-lg">
        {match[1]}
      </span>
    );

    lastIndex = match.index + match[0].length;
  }

  // 添加最後一部分普通文字
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
 * 簡單地處理標題、列表和加粗等基本格式
 */
const formatAssistantMessage = (text: string) => {
  // 先分行處理
  const lines = text.split('\n');
  const formattedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 處理標題 (# 標題)
    if (line.match(/^#+\s/)) {
      const headingMatch = line.match(/^(#+)\s/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const content = line.replace(/^#+\s/, '');
        const fontSize = level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg';
        formattedLines.push(
          <h1 key={i} className={`font-bold ${fontSize} mb-2`}>
            {content}
          </h1>
        );
      }
    } 
    // 處理列表 (- 項目)
    else if (line.match(/^\s*-\s/)) {
      const content = line.replace(/^\s*-\s/, '');
      formattedLines.push(
        <div key={i} className="flex mb-1 pl-2">
          <span className="mr-2">•</span>
          <span>{formatUserMessage(content)}</span>
        </div>
      );
    }
    // 處理一般文字，但還需要處理內部的**粗體**
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
 * 顯示聊天訊息，支援基本格式化和載入狀態
 */
export const ChatMessageList = ({
  messages,
  isLoading,
  error,
}: ChatMessageListProps) => {
  return (
    <div className="space-y-6 pb-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-3xl rounded-lg px-5 py-3 shadow-sm ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
            }`}
          >
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
        </div>
      ))}
      
      {/* 錯誤訊息 */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-500 dark:border-red-800 dark:bg-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}
      
      {/* 載入指示器 */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-3xl rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-800">
            <div className="flex space-x-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500 [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500 [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 