import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Modal,
  Box,
  Typography,
  TextField,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  Checkbox,
  Button,
  Fade,
} from '@mui/material';

const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const ForwardModal = ({ open, onClose, message, onForward }) => {
  const users = useSelector((state) => state.users.users);
  const myUserId = useSelector((state) => state.auth.userId);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  const filteredUsers = users
    .filter((u) => u.userId !== myUserId)
    .filter((u) =>
      u.username.toLowerCase().includes(search.toLowerCase())
    );

  const handleToggle = (userId) => {
    setSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleForward = () => {
    onForward(selected);
    setSelected([]);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            minWidth: 350,
            maxWidth: 400,
            outline: 'none',
          }}
        >
          <Typography variant="h6" mb={2}>
            Forward Message
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2 }}
          />
          <List sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {filteredUsers.map((user) => (
              <ListItemButton
                key={user.userId}
                onClick={() => handleToggle(user.userId)}
                selected={selected.includes(user.userId)}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatarUrl}>
                    {!user.avatarUrl && getInitials(user.username)}
                  </Avatar>
                </ListItemAvatar>
                <Checkbox
                  checked={selected.includes(user.userId)}
                  tabIndex={-1}
                  disableRipple
                  sx={{ ml: 1 }}
                />
                <Typography>{user.username}</Typography>
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={selected.length === 0}
              onClick={handleForward}
            >
              Forward
            </Button>
            <Button sx={{ ml: 1 }} onClick={onClose}>Cancel</Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ForwardModal;
