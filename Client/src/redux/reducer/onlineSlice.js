// src/redux/slices/onlineSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUsers: [], // array of userIds
};

const onlineSlice = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload; // array of userIds
    },
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
    },
  },
});

export const { setOnlineUsers, addOnlineUser, removeOnlineUser } = onlineSlice.actions;
export default onlineSlice;
