import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';

interface AuthFormProps {
  type: 'login' | 'signup';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (type === 'login') {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      router.push('/dashboard-integrated');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} login will be available soon!\n\nFor now, please use email/password to sign ${type === 'login' ? 'in' : 'up'}.`);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {error && (
        <div className="p-3 sm:p-4 rounded-2xl bg-red-500/10 backdrop-blur-xl border border-red-500/20 text-red-300 text-sm sm:text-base animate-shake">
          ⚠️ {error}
        </div>
      )}

      {/* Social Login Buttons */}
      <div className="space-y-2.5 sm:space-y-3">
        <button
          type="button"
          onClick={() => handleSocialLogin('Google')}
          className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base text-white transition-all duration-500 transform hover:scale-[1.03] active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin('GitHub')}
          className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base text-white transition-all duration-500 transform hover:scale-[1.03] active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Continue with GitHub
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin('LinkedIn')}
          className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base text-white transition-all duration-500 transform hover:scale-[1.03] active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Continue with LinkedIn
        </button>
      </div>

      {/* Divider */}
      <div className="relative py-1.5 sm:py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-xs sm:text-sm">
          <span className="px-4 sm:px-6 py-1.5 sm:py-2 text-gray-400 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            or continue with email
          </span>
        </div>
      </div>

      <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-3 sm:space-y-4">
          {/* Email Input */}
          <div className="relative group">
            <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 rounded-xl sm:rounded-2xl opacity-0 group-focus-within:opacity-100 blur-sm transition-all duration-700"></div>
            <div className="relative">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="relative w-full px-4 sm:px-6 py-3 sm:py-4 bg-purple-900/20 text-white text-sm sm:text-base placeholder-cyan-300/50 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-500 group-hover:bg-purple-900/30 group-focus-within:bg-purple-900/40"
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
                placeholder="📧 Email address"
              />
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full transition-all duration-700 ${focusedField === 'email' ? 'w-[calc(100%-2rem)] opacity-100' : 'w-0 opacity-0'}`}></div>
            </div>
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 rounded-xl sm:rounded-2xl opacity-0 group-focus-within:opacity-100 blur-sm transition-all duration-700"></div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="relative w-full px-4 sm:px-6 py-3 sm:py-4 bg-purple-900/20 text-white text-sm sm:text-base placeholder-cyan-300/50 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-500 group-hover:bg-purple-900/30 group-focus-within:bg-purple-900/40"
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
                placeholder="🔒 Password"
              />
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full transition-all duration-700 ${focusedField === 'password' ? 'w-[calc(100%-2rem)] opacity-100' : 'w-0 opacity-0'}`}></div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3.5 sm:py-4 px-4 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl text-white transition-all duration-700 transform hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
              boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #0891b2 0%, #7c3aed 50%, #db2777 100%)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(139, 92, 246, 0.3)';
            }}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
            ) : (
              <>
                {type === 'login' ? 'Sign In' : 'Create Account'}
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Toggle Link */}
      <div className="text-center pt-2 sm:pt-4">
        <p className="text-xs sm:text-sm text-white/40">
          {type === 'login'
            ? "Don't have an account? "
            : "Already have an account? "}
          <a
            href={type === 'login' ? "/signup" : "/signin"}
            className="font-medium transition-all duration-500 hover:opacity-80"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {type === 'login' ? 'Sign up' : 'Sign in'}
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
