import { addMessage } from "./chatSlice";
import { v4 as uuidv4 } from "uuid";
import UserList from '../../components/Sidebar/UserList';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useDraftPersistence } from "../../hooks/useDraftPersistence";
import { connectWebSocket, sendWebSocketMessage } from "../../services/websocket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatPage = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const username = useSelector((state) => state.auth.username);

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

  return (
    <Box
      sx={{
        height: '100vh',
        // margin: '10px',
        bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          display: 'flex',
          borderRadius: 4,
          overflow: 'hidden',
          height:'100%',
          maxWidth: 1200,
          width: '100%',
        }}
      >

        <Box sx={{ width: 320, bgcolor: '#f5f7fa', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}>
              <ChatIcon />
            </Avatar>
            <Typography variant="h6" fontWeight="bold">ChatApp</Typography>
          </Box>
          <UserList />
        </Box>


        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f4f6fa',
            minHeight: 0,
            position: 'relative',
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >

          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', minHeight: 64, bgcolor: '#fff' }}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Chat
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 0,
              py: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              bgcolor: '#f4f6fa',
              minHeight: 0,
            }}
          >
            <MessageList />
          </Box>



          <Box
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
      </Paper>
    </Box>
  );
};

export default ChatPage;