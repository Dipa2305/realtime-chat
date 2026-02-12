import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  activeUserId: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {

    setUsers(state, action) {
      const uniqueUsers = [];

      action.payload.forEach((user) => {
        const exists = uniqueUsers.find(u => u.userId === user.userId);
        if (!exists) {
          uniqueUsers.push({ ...user, unreadCount: user.unreadCount || 0 });
        }
      });

      state.users = uniqueUsers;

      if (!state.activeUserId && uniqueUsers.length > 0) {
        state.activeUserId = uniqueUsers[0].userId;
      }
    },
    incrementUnread(state, action) {
      const user = state.users.find(u => u.userId === action.payload);
      if (user) user.unreadCount = (user.unreadCount || 0) + 1;
    },
    resetUnread(state, action) {
      const user = state.users.find(u => u.userId === action.payload);
      if (user) user.unreadCount = 0;
    },
    setUnread(state, action) {
      const { userId, count } = action.payload;
      const user = state.users.find(u => u.userId === userId);
      if (user) user.unreadCount = count;
    },

    setActiveUser(state, action) {
      state.activeUserId = action.payload;
    },
    userJoined(state, action) {
      const exists = state.users.find(u => u.userId === action.payload.userId);
      if (!exists) state.users.push(action.payload);
    },
    userLeft(state, action) {
      state.users = state.users.filter(u => u.userId !== action.payload);
    },
    setUserOnline(state, action) {
      const user = state.users.find(u => u.userId === action.payload.userId);
      if (user) user.online = action.payload.online;
    },
  },
});

export const { setUsers, setActiveUser, userJoined, userLeft, setUserOnline, incrementUnread, resetUnread, setUnread } = usersSlice.actions;
export default usersSlice.reducer;
