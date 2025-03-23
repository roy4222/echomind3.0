import { ChatInput } from './ChatInput';
import { Greeting } from './Greeting';

interface WelcomeScreenProps {
  onSubmit: (input: string) => Promise<void>;
  isLoading: boolean;
}

/**
 * 歡迎畫面組件
 * 顯示在聊天開始前的問候語和輸入框
 */
export function WelcomeScreen({ onSubmit, isLoading }: WelcomeScreenProps) {
  return (
    <div className="space-y-6">
      <Greeting />
      <ChatInput onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
} 