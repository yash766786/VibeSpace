import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  hasFetchedChats: false,
};

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    chatsFetched(state, action) {
      const { chats } = action.payload;
      state.chats.push(...chats); // append
      state.hasFetchedChats = true
    },
    resetChats(state) {
      Object.assign(state, initialState);
    },
    addUnreadMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.unreadMessages[chatId]) {
        state.unreadMessages[chatId] = [];
      }
      state.unreadMessages[chatId].push(message);
    },

  },
});

export const { chatsFetched, resetChats } = chatSlice.actions;
export default chatSlice;
