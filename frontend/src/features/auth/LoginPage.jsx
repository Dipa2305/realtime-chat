import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './authSlice';
import { Box, Typography, TextField, Button, Paper, Avatar } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    dispatch(login(username.trim()));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          minWidth: 350,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.95)',
        }}
      >
        <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56, mb: 2 }}>
          <ChatIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5" fontWeight="bold" mb={1}>
          Welcome to ChatApp
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Sign in to start chatting with your team and friends.
        </Typography>
        <form style={{ width: '100%' }} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Enter your name"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2, borderRadius: 2 }}
            autoFocus
            error={!!error}
            helperText={error}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ borderRadius: 2, fontWeight: 'bold', fontSize: 16 }}
            disabled={!username.trim()}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
