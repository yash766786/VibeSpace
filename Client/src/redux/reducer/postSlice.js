import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  page: 1,
  hasMore: true,
  hasFetchedPosts: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postsFetched(state, action) {
      const { posts, totalPages, currentPage } = action.payload;
      state.posts.push(...posts); // append
      state.page = currentPage + 1;
      state.hasMore = currentPage < totalPages;
      state.hasFetchedPosts = true
      
    },
    resetPosts(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { postsFetched, resetPosts } = postSlice.actions;
export default postSlice;
