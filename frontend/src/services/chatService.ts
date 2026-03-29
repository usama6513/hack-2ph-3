interface ChatResponse {
  response: string;
  conversation_id: number;
  language: string;
  user_message: string;
}

interface ChatRequest {
  message: string;
  conversation_id?: number;
  language?: string;
}

class ChatService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  private getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  async sendMessage(message: string, conversationId?: number): Promise<ChatResponse> {
    const token = this.getToken();
    
    const response = await fetch(`${this.baseUrl}/api/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send message');
    }

    return response.json();
  }
}

export default new ChatService();
export type { ChatResponse, ChatRequest };
