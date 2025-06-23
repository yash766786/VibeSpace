// src/redux/slices/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],       // All displayed notifications
  unseenCount: 0,          // Count of unseen ones
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unseenCount = action.payload.filter(n => !n.seen).length;
    },
    markAllSeen: (state) => {
      state.notifications = state.notifications.map(n => ({
        ...n,
        seen: true
      }));
      state.unseenCount = 0;
    },
    addNotification: (state, action) => {
      const exists = state.notifications.find(n => n._id === action.payload._id);
      if (!exists) {
        state.notifications.unshift(action.payload);
        if (!action.payload.seen) {
          state.unseenCount += 1;
        }
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unseenCount = 0;
    },
    removeNotification: (state, action) => {
      const idToRemove = action.payload;
      state.notifications = state.notifications.filter(n => n._id !== idToRemove);
      state.unseenCount = state.notifications.filter(n => !n.seen).length;
    },

  }
});

export const {
  setNotifications,
  markAllSeen,
  addNotification,
  clearNotifications,
  removeNotification
} = notificationSlice.actions;

export default notificationSlice;
