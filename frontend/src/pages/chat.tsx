import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import ChatInterface from '../components/Chat/ChatInterface';
import Layout from '../components/Layout';

const ChatPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white/80">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/signin');
    return null;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Chat Assistant</h1>
          <p className="text-white/70">Chat with AI to manage your todos</p>
        </div>
        <ChatInterface userId={user.id} />
      </div>
    </Layout>
  );
};

export default ChatPage;
