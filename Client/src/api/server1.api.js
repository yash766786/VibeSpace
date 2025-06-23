import { server1Form, server1Json } from "./server/server1Axios";

// post
export const getAllPosts = (page) => server1Json.get(`/posts?page=${page}`);
export const getPostsOfUser = (targetUserId) => server1Json.get(`/posts/profile/${targetUserId}`);

export const uploadPost = (formData) => server1Form.post(`/posts/`, formData);
export const updatePost = (postId, jsonData) => server1Form.patch(`/posts/${postId}`, jsonData);
export const deletePost = (postId) => server1Json.delete(`/posts/${postId}`);


// comment
export const getPostComments = ({postId, pg}) => server1Json.get(`/comments/${postId}?page=${pg}`);
export const addComment = (postId, jsonData) => server1Json.post(`/comments/${postId}`,jsonData);
export const deleteComment = (commentId) => server1Json.delete(`/comments/${commentId}`);


// like
export const getPostLikes = ({postId, pg}) => server1Json.get(`/likes/${postId}?page=${pg}`);
export const togglePostLike = (postId) => server1Json.post(`/likes/toggle/p/${postId}`);
export const toggleCommentLike = (commentId) => server1Json.post(`/likes/toggle/c/${commentId}`);


// follow
export const toggleFollowUser = (targetUserId) => server1Json.get(`/follows/toggle/u/${targetUserId}`)
export const getFollowers = (targetUserId, page) => server1Json.get(`/follows/followers/u/${targetUserId}?page=${page}`)
export const getFollowings = (targetUserId, page) => server1Json.get(`/follows/followings/u/${targetUserId}?page=${page}`)

