import { useState, useEffect, useRef } from 'react';
import chatService from '../../services/chatService';

interface ChatInterfaceProps {
  userId: number;
  onTaskUpdate?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId, onTaskUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [todos, setTodos] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/todos/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(inputValue);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Refresh todos after AI action
      setTimeout(() => {
        fetchTodos();
        onTaskUpdate?.();
      }, 500);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        role: 'assistant',
        content: '⚠️ Sorry, I encountered an error. Please try again.',
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string, todo?: any) => {
    let message = action;
    if (todo) {
      message = message.replace('{id}', todo.id).replace('{desc}', todo.description);
    }
    setInputValue(message);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: '📝 Show todos', message: 'Show me all my todos' },
    { label: '➕ Add task', message: 'Add a todo to ' },
    { label: '✅ Complete all', message: 'Mark all my pending todos as complete' },
  ];

  return (
    <div className="flex flex-col h-[600px] glass-card rounded-3xl overflow-hidden shadow-neon animate-fade-in">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center text-lg">
                🤖
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20 animate-pulse" />
            </div>
            <div>
              <h3 className="text-white font-bold">AI Assistant</h3>
              <p className="text-xs text-white/50">Online • Edit, Delete, Complete & More</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-white/5">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="text-7xl mb-6 animate-bounce">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-3">Hey there!</h3>
            <p className="text-white/60 mb-4">I'm your AI assistant. I can help you:</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-white/70 mb-6">
              <div className="glass-card p-2 rounded-lg">✅ Mark tasks complete</div>
              <div className="glass-card p-2 rounded-lg">⏳ Set tasks pending</div>
              <div className="glass-card p-2 rounded-lg">✏️ Edit task details</div>
              <div className="glass-card p-2 rounded-lg">🗑️ Delete tasks</div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputValue(action.message)}
                  className="glass-card p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm font-medium text-left"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex animate-slide-${msg.role === 'user' ? 'right' : 'left'} ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`max-w-[85%] px-5 py-3 rounded-2xl transition-all duration-300 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/30 rounded-br-md'
                      : 'glass-card text-white rounded-bl-md border border-white/10'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-start gap-2">
                      <span className="text-lg">🤖</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <p className="text-sm font-medium whitespace-pre-wrap break-words">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Task Quick Actions */}
            {todos.length > 0 && messages.length > 0 && (
              <div className="animate-fade-in mt-4">
                <p className="text-xs text-white/50 mb-2">Quick Actions:</p>
                <div className="space-y-2">
                  {todos.slice(0, 3).map((todo) => (
                    <div key={todo.id} className="glass-card p-3 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white font-medium truncate flex-1 mr-2">
                          {todo.completed ? '✅' : '⏳'} {todo.description}
                        </span>
                        <span className="text-xs text-white/40">#{todo.id}</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {!todo.completed ? (
                          <button
                            onClick={() => handleQuickAction('mark task {id} complete', todo)}
                            className="px-3 py-1 bg-green-500/20 hover:bg-green-500/40 text-green-300 rounded-lg text-xs font-medium transition-all border border-green-400/30"
                          >
                            ✅ Complete
                          </button>
                        ) : (
                          <button
                            onClick={() => handleQuickAction('mark task {id} as pending', todo)}
                            className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 rounded-lg text-xs font-medium transition-all border border-yellow-400/30"
                          >
                            ⏳ Set Pending
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setInputValue(`update todo ${todo.id} to `);
                          }}
                          className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 rounded-lg text-xs font-medium transition-all border border-blue-400/30"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleQuickAction('delete task {id}', todo)}
                          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg text-xs font-medium transition-all border border-red-400/30"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="glass-card px-5 py-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Try: edit task 1, delete task 2, mark task 3 complete..."
            className="flex-1 px-5 py-3 glass-card text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-2xl hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
