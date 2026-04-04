import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  TaskFlow AI
                </span>
              </Link>
            </div>

            {/* Navigation */}
            {user && (
              <nav className="flex items-center space-x-3">
                <Link
                  href="/dashboard-integrated"
                  className="px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
                >
                  🏠 Dashboard
                </Link>
                <Link
                  href="/chat"
                  className="px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
                >
                  🤖 AI Chat
                </Link>
                <Link
                  href="/todos"
                  className="px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
                >
                  📝 Todos
                </Link>
                
                {/* User Avatar */}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/20">
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
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © 2026 TaskFlow AI. Built with ❤️ by USAMA ARYAN
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-white/50 hover:text-cyan-400 text-sm transition-colors duration-300">Privacy</a>
              <a href="#" className="text-white/50 hover:text-purple-400 text-sm transition-colors duration-300">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
