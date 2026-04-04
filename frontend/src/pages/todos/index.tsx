import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import TodoList from '../../components/TodoList';
import ChatInterface from '../../components/Chat/ChatInterface';

const TodosPage = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // If user is not authenticated, redirect to sign in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="glass-card sticky top-0 z-50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Task Manager</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/dashboard-integrated" className="px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium">
                🏠 Dashboard
              </Link>
              <Link href="/chat" className="px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium">
                🤖 AI Chat
              </Link>
              <Link href="/todos" className="px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium">
                📝 Todos
              </Link>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center text-white font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-500 transform hover:scale-105 active:scale-95 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  color: 'rgba(103, 232, 249, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(139, 92, 246, 0.1) 100%)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.2)';
                  e.currentTarget.style.color = 'rgba(165, 243, 252, 1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.color = 'rgba(103, 232, 249, 1)';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Todo List */}
          <div className="animate-slide-left">
            <TodoList userId={user.id} />
          </div>

          {/* AI Chat */}
          <div className="animate-slide-right">
            <ChatInterface userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TodosPage;
