import { addMessage } from "./chatSlice";
import { v4 as uuidv4 } from "uuid";
import UserList from '../../components/Sidebar/UserList';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDraftPersistence } from "../../hooks/useDraftPersistence";
import { connectWebSocket, sendWebSocketMessage } from "../../services/websocket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatPage = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const username = useSelector((state) => state.auth.username);
  const activeUserId = useSelector((state) => state.users.activeUserId);
  const [mobileView, setMobileView] = useState('sidebar'); 

  useEffect(() => {
    if (userId && username) {
      connectWebSocket(dispatch, { userId, username });
    }
  }, [dispatch, userId, username]);

  useDraftPersistence();

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    const originalMessage = JSON.parse(data);
    const forwardMessage = {
      ...originalMessage,
      id: uuidv4(),
      timestamp: Date.now(),
    };
    sendWebSocketMessage(forwardMessage);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  
  useEffect(() => {
    if (isMobile && activeUserId && mobileView === 'sidebar') {
      setMobileView('chat');
    }
  }, [activeUserId]);

 
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      if (window.matchMedia('(max-width: 768px)').matches) {
      
        if (!activeUserId) setMobileView('sidebar');
      } else {
        setMobileView('both');
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [activeUserId]);


  const showSidebar = !isMobile || mobileView === 'sidebar' || mobileView === 'both';
  const showChat = !isMobile || mobileView === 'chat' || mobileView === 'both';

  return (
    <Box
      className="app-wrapper"
      sx={{
        height: '100vh',
        bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 0,
      }}
    >
      <Paper
        className="chat-card"
        elevation={8} 
        sx={{
          display: 'flex',
          borderRadius: 4,
          overflow: 'hidden',
          height: '100%',
          maxWidth: 1200,
          width: '100%',
          minHeight: 0,
          position: 'relative',
        }}
      >
      
        {showSidebar && (
          <Box
            className={isMobile ? 'sidebar-section' : 'sidebar-section'}
            sx={{
              width: { xs: '100vw', md: 320 },
              bgcolor: '#f5f7fa',
              borderRight: { xs: 'none', md: '1px solid #e0e0e0' },
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              zIndex: 2,
              position: isMobile ? 'relative' : 'static',
            }}
          >
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}>
                <ChatIcon />
              </Avatar>
              <Typography variant="h6" fontWeight="bold">ChatApp</Typography>
            </Box>
            <UserList onUserSelect={() => { if (isMobile) setMobileView('chat'); }} />
          </Box>
        )}

      
        {showChat && (
          <Box
            className={isMobile ? 'chat-section' : 'chat-section'}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#f4f6fa',
              minHeight: 0,
              position: isMobile ? 'absolute' : 'relative',
              top: 0,
              left: 0,
              width: { xs: '100vw', md: 'auto' },
              height: { xs: '100vh', md: '100%' },
              zIndex: 3,
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
           
            <Box
              className={isMobile ? 'chat-header-mobile' : ''}
              sx={{
                px: 2,
                py: 1,
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                minHeight: 48,
                maxHeight: 56,
                bgcolor: '#fff',
                position: isMobile ? 'sticky' : 'static',
                top: 0,
                zIndex: 11,
              }}
            >
              {isMobile && (
                <Avatar
                  sx={{ bgcolor: '#eee', color: '#1976d2', mr: 1, cursor: 'pointer', width: 32, height: 32 }}
                  onClick={() => setMobileView('sidebar')}
                >
                
                  <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#1976d2" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                </Avatar>
              )}
              <Typography variant="h6" fontWeight="bold" color="primary" sx={{ fontSize: 20 }}>
                Chat
              </Typography>
            </Box>

          
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                px: 0,
                py: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                bgcolor: '#f4f6fa',
                pb: isMobile ? '110px' : 0,
              }}
            >
              <MessageList />
            </Box>

         
            <Box
              className={isMobile ? 'message-input-mobile' : ''}
              sx={{
                px: 3,
                py: 2,
                borderTop: '1px solid #e0e0e0',
                bgcolor: '#fff',
                boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <MessageInput />
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ChatPage;