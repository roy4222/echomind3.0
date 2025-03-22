import { handleChatCompletion } from './controller';

export async function POST(request: Request) {
  return handleChatCompletion(request);
} 