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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Task Dashboard</h1>
          <p className="text-white/70">Manage tasks manually or let AI help you</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-white rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Todo List */}
          <div className="glass rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">My Tasks</h2>
            <div className="flex mb-6 space-x-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddTodo}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg"
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
          <div className="glass rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">AI Assistant</h2>
            <ChatInterface userId={user.id} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IntegratedDashboardPage;
