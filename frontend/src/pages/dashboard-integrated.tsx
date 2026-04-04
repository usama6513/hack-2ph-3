import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import TodoListIntegrated from '../components/TodoListIntegrated';
import ChatInterface from '../components/Chat/ChatInterface';
import apiService from '../services/api';
import { Todo } from '../types';

const IntegratedDashboardPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      const fetchedTodos = await apiService.getTodos();
      setTodos(fetchedTodos);
    } catch (err) {
      setError('Failed to load todos');
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const newTodoItem = await apiService.createTodo(newTodo);
      setTodos([newTodoItem, ...todos]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      const updatedTodo = await apiService.toggleTodoStatus(id);
      setTodos(todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await apiService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-white/20 border-t-cyan-400 border-r-purple-400"></div>
          <p className="text-white text-center mt-6 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Made with love banner */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full">
            <span className="text-sm text-white/70">Made with</span>
            <span className="text-red-400 animate-pulse text-lg">❤️</span>
            <span className="text-sm text-white/70">by</span>
            <span className="font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">USAMA ARYAN</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Task Dashboard
          </h1>
          <p className="text-white/60 text-lg">Manage tasks manually or let AI help you</p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
            <div className="glass-card p-4 rounded-2xl animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="text-3xl font-bold text-cyan-400">{totalCount}</div>
              <div className="text-sm text-white/60">Total Tasks</div>
            </div>
            <div className="glass-card p-4 rounded-2xl animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="text-3xl font-bold text-green-400">{completedCount}</div>
              <div className="text-sm text-white/60">Completed</div>
            </div>
            <div className="glass-card p-4 rounded-2xl animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="text-3xl font-bold text-yellow-400">{totalCount - completedCount}</div>
              <div className="text-sm text-white/60">Pending</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 glass-card bg-red-500/20 border border-red-400/30 text-red-200 rounded-2xl animate-shake">
            ⚠️ {error}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Todo List */}
          <div className="glass-card p-6 rounded-3xl animate-slide-left border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">My Tasks</h2>
            </div>
            
            <div className="flex mb-6 space-x-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                placeholder="✨ Add a new task..."
                className="flex-1 px-5 py-3 glass-card text-white placeholder-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
              <button
                onClick={handleAddTodo}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Add
              </button>
            </div>
            <TodoListIntegrated
              todos={todos}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
            />
          </div>

          {/* AI Chat */}
          <div className="glass-card p-6 rounded-3xl animate-slide-right border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <h2 className="text-2xl font-bold text-white">AI Assistant</h2>
            </div>
            <ChatInterface userId={user.id} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IntegratedDashboardPage;
