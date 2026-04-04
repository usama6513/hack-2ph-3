import { useState, useEffect } from 'react';
import { Todo } from '../types';
import api from '../services/api';
import TodoForm from './TodoForm';

interface TodoListProps {
  userId: number;
}

const TodoList = ({ userId }: TodoListProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'pending'>('all');
  const [animatingId, setAnimatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await api.getTodos();
      setTodos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (description: string) => {
    try {
      const newTodo = await api.createTodo(description);
      setTodos([...todos, newTodo]);
    } catch (err: any) {
      setError(err.message || 'Failed to create todo');
    }
  };

  const handleUpdateTodo = async (id: number, description: string) => {
    try {
      const updatedTodo = await api.updateTodo(id, description);
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      setEditingTodo(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
    }
  };

  const handleToggleTodo = async (id: number) => {
    setAnimatingId(id);
    try {
      const updatedTodo = await api.toggleTodoStatus(id);
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (err: any) {
      setError(err.message || 'Failed to toggle todo status');
    } finally {
      setTimeout(() => setAnimatingId(null), 500);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setAnimatingId(id);
    setTimeout(async () => {
      try {
        await api.deleteTodo(id);
        setTodos(todos.filter(todo => todo.id !== id));
      } catch (err: any) {
        setError(err.message || 'Failed to delete todo');
      } finally {
        setAnimatingId(null);
      }
    }, 300);
  };

  const getTodoStatus = (todo: Todo) => {
    if (todo.completed) return 'completed';
    if (new Date(todo.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      return 'pending';
    }
    return 'active';
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed && getTodoStatus(todo) === 'active';
    if (filter === 'pending') return !todo.completed && getTodoStatus(todo) === 'pending';
    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-cyan-400 border-r-purple-400"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-transparent border-t-cyan-400/30"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="glass-card p-4 rounded-2xl animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-white/80">Progress</span>
            <span className="text-sm font-bold text-cyan-300">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/60">
            <span>{completedCount} completed</span>
            <span>{totalCount - completedCount} remaining</span>
          </div>
        </div>
      )}

      {/* Add Task */}
      <div className="glass-card p-6 rounded-2xl hover:shadow-neon transition-all duration-300">
        <TodoForm
          onSubmit={handleCreateTodo}
          placeholder="✨ Add a new task..."
          buttonText="Add"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        {[
          { key: 'all', label: 'All', icon: '📋' },
          { key: 'active', label: 'Active', icon: '⚡' },
          { key: 'pending', label: 'Pending', icon: '⏳' },
          { key: 'completed', label: 'Done', icon: '✅' },
        ].map(({ key, label, icon }) => {
          const count = key === 'all' 
            ? todos.length 
            : key === 'completed' 
              ? todos.filter(t => t.completed).length
              : todos.filter(t => !t.completed && (key === 'active' ? getTodoStatus(t) === 'active' : getTodoStatus(t) === 'pending')).length;
          
          return (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                filter === key
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/50'
                  : 'glass-card text-white/70 hover:text-white hover:bg-white/20'
              }`}
            >
              {icon} {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-card p-4 rounded-2xl bg-red-500/20 border-red-400/30 text-red-200 animate-shake">
          ⚠️ {error}
        </div>
      )}

      {/* Todo List */}
      {filteredTodos.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center animate-fade-in">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-white mb-2">No tasks found</h3>
          <p className="text-white/60">
            {filter === 'all' ? 'Get started by adding a new task above.' : `No ${filter} tasks at the moment.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTodos.map((todo, index) => {
            const status = getTodoStatus(todo);
            const isAnimating = animatingId === todo.id;
            return (
              <div
                key={todo.id}
                className={`glass-card p-4 rounded-2xl transition-all duration-300 hover:shadow-neon transform hover:scale-[1.02] hover:-translate-y-1 ${
                  isAnimating ? 'animate-fade-out opacity-0 scale-95' : 'animate-fade-in'
                } ${todo.completed ? 'opacity-70' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  {/* Custom Checkbox */}
                  <button
                    onClick={() => handleToggleTodo(todo.id)}
                    className={`relative w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                      todo.completed
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-400 border-transparent'
                        : 'border-white/30 hover:border-cyan-400'
                    }`}
                  >
                    {todo.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Todo Content */}
                  <div className="flex-1 min-w-0">
                    {editingTodo?.id === todo.id ? (
                      <input
                        type="text"
                        defaultValue={todo.description}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                        onBlur={(e) => {
                          if (e.target.value.trim()) {
                            handleUpdateTodo(todo.id, e.target.value);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            handleUpdateTodo(todo.id, e.currentTarget.value);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <div>
                        <p
                          className={`text-base font-medium transition-all duration-300 ${
                            todo.completed
                              ? 'line-through text-white/40'
                              : 'text-white'
                          }`}
                        >
                          {todo.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                              status === 'completed'
                                ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                                : status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                            }`}
                          >
                            {status === 'completed' ? '✅ Done' : status === 'pending' ? '⏳ Pending' : '⚡ Active'}
                          </span>
                          <span className="text-xs text-white/40">
                            {new Date(todo.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingTodo(todo)}
                      className="p-2 rounded-xl text-white/50 hover:text-cyan-400 hover:bg-white/10 transition-all duration-300"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="p-2 rounded-xl text-white/50 hover:text-red-400 hover:bg-white/10 transition-all duration-300"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TodoList;
