import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  cursor: null,
  hasMore: true,
  loading: false,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
    },

    feedFetched(state, action) {
      const { posts, nextCursor } = action.payload;

      state.posts.push(...posts);
      state.cursor = nextCursor;
      state.hasMore = !!nextCursor;
      state.loading = false;
    },

    fetchError(state) {
      state.loading = false;
    },

    resetFeed(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  fetchStart,
  feedFetched,
  fetchError,
  resetFeed,
} = feedSlice.actions;

export default feedSlice;