import { useAuth } from '../hooks/useAuth';
import AuthForm from '../components/AuthForm';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SignupPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard-integrated');
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

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden py-8 px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform duration-300">
            <svg className="h-8 w-8 sm:h-10 sm:w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            TaskFlow AI
          </h2>
          <p className="mt-2 text-xs sm:text-sm flex items-center justify-center gap-1">
            <span className="text-white/50">Made with</span>
            <span className="text-red-400 animate-pulse">❤️</span>
            <span className="text-white/50">by</span>
            <span className="font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">USAMA ARYAN</span>
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all duration-700 hover:scale-[1.01]" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}>
          <AuthForm type="signup" />
        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-white/40">
          © 2026 TaskFlow AI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
