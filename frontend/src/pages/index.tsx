import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const HomePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard-integrated');  // Changed from /todos
      } else {
        router.push('/landing');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <h1 className="text-3xl font-bold text-white mb-2">TaskFlow</h1>
        <p className="text-lg text-white/80">Loading...</p>
      </div>
    </div>
  );
};

export default HomePage;