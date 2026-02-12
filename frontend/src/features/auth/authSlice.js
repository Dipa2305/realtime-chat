import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  userId: null,
  username: '',
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: {
      reducer(state, action) {
        state.userId = action.payload.userId;
        state.username = action.payload.username;
        state.isAuthenticated = true;
      },
      prepare(username) {
        return {
          payload: {
            userId: uuidv4(),
            username,
          },
        };
      },
    },
    logout(state) {
      state.userId = null;
      state.username = '';
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
