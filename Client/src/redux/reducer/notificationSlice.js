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
    // addNotification: (state, action) => {
    //   const exists = state.notifications.find(n => n._id === action.payload._id);
    //   if (!exists) {
    //     state.notifications.unshift(action.payload);
    //     if (!action.payload.seen) {
    //       state.unseenCount += 1;
    //     }
    //   }
    // },

    addNotification: (state, action) => {
      const incoming = action.payload;
      const index = state.notifications.findIndex(n => n._id === incoming._id);

      if (index !== -1) {
        // Remove it from current position
        state.notifications.splice(index, 1);
        state.unseenCount += 1;
      } else {
        // Only increment unseen count if it's new and unseen
        if (!incoming.seen) {
          state.unseenCount += 1;
        }
      }
      // Always unshift to top (whether new or updated)
      state.notifications.unshift(incoming);
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
