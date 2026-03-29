export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: number;
  language: string;
  user_message: string;
}

export interface Conversation {
  id: number;
  language: string;
  created_at: string;
  updated_at: string;
}
