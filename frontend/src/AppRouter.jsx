import React from 'react';
import { useSelector } from 'react-redux';
import LoginPage from './features/auth/LoginPage';
import ChatPage from './features/chat/ChatPage';

const AppRouter = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <ChatPage /> : <LoginPage />;
};

export default AppRouter;
