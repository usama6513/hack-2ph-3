import { Todo } from '../types';

class ApiService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request(url: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Auth API methods
  async signup(email: string, password: string) {
    return this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Todo API methods
  async getTodos(): Promise<Todo[]> {
    return this.request('/api/todos/');
  }

  async createTodo(description: string): Promise<Todo> {
    return this.request('/api/todos/', {
      method: 'POST',
      body: JSON.stringify({ description }),
    });
  }

  async updateTodo(id: number, description: string): Promise<Todo> {
    return this.request(`/api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ description }),
    });
  }

  async toggleTodoStatus(id: number): Promise<Todo> {
    return this.request(`/api/todos/${id}/status`, {
      method: 'PATCH',
    });
  }

  async deleteTodo(id: number): Promise<{ message: string }> {
    return this.request(`/api/todos/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();