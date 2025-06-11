// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './reducer/authSlice.js';
import postSlice from './reducer/postSlice.js';
import chatSlice from './reducer/chatSlice.js';
import onlineSlice from './reducer/onlineSlice.js'; 
import notificationSlice from './reducer/notificationSlice.js'; 

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [postSlice.name]: postSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [onlineSlice.name]: onlineSlice.reducer,
    [notificationSlice.name]: notificationSlice.reducer,
  },
});
