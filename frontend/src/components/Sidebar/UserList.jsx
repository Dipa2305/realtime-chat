import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveUser, resetUnread } from '../../features/users/usersSlice';

import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Divider,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const UserList = ({ onUserSelect }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const myUserId = useSelector((state) => state.auth.userId);
  const activeUserId = useSelector((state) => state.users.activeUserId);
  const messages = useSelector((state) => state.chat.messages);

  const [searchQuery, setSearchQuery] = useState('');


  const filteredUsers = users
    .filter((u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

  React.useEffect(() => {
    if (activeUserId) {
      dispatch(resetUnread(activeUserId));
    }
  }, [activeUserId, dispatch]);

  const userMessages = messages.filter(
    (msg) =>
      (msg.senderId === myUserId && msg.receiverId === activeUserId) ||
      (msg.senderId === activeUserId && msg.receiverId === myUserId)
  );
  const lastMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;


  return (
    <Box
      sx={{
        width: 320,
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: '#fff',
      }}
    >

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Messages
          </Typography>

          <IconButton>
            <AddIcon />
          </IconButton>
        </Box>


        <TextField
          fullWidth
          size="small"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {filteredUsers.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 120,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No users found
            </Typography>
          </Box>
        ) : (
          <List>
            {filteredUsers.map((user, index) => (
              <React.Fragment key={user.userId}>
                <ListItemButton
                  key={user.userId}
                  selected={user.userId === activeUserId}
                  onClick={() => {
                    dispatch(setActiveUser(user.userId));
                    if (onUserSelect) onUserSelect(user.userId);
                  }}
                >
                  <ListItemAvatar sx={{ display: 'flex', alignItems: 'center' }}>

                    <Badge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      variant="dot"
                      color={user.online ? 'success' : 'default'}
                      showZero={false}
                    >
                      <Avatar src={user.avatarUrl}>
                        {!user.avatarUrl &&
                          getInitials(user.username)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          fontWeight={
                            user.userId === activeUserId ? "bold" : "normal"
                          }
                        >
                          {user.userId === myUserId
                            ? `${user.username} (You)`
                            : user.username}
                        </Typography>

                        {user.unreadCount > 0 && (
                          <Badge
                            badgeContent={user.unreadCount}
                            color="primary"
                          />
                        )}
                      </Box>
                    }
                  />


                </ListItemButton>
                {index !== filteredUsers.length - 1 && (
                  <Divider sx={{ ml: 9 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default UserList;

