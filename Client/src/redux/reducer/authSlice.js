// sr/redux/reducer/auth.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loading: false,
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.loading = false;
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
});

export const { setCurrentUser, clearCurrentUser, setAuthChecked } = authSlice.actions;
export default authSlice;
