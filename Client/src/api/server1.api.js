import { server1Form, server1Json } from "./server/server1Axios";

// post
export const getPostById = () => server1Json.get(`/posts/${postId}`);
export const updatePost = (formData) => server1Form.patch(`/posts/${postId}`, formData);
export const deletePost = () => server1Json.delete(`/posts/${postId}`);

export const getPostsOfUser = (targetUserId) => server1Json.get(`/posts/profile/${targetUserId}`);


// comment


// like


// follow

// // Use 'postId' for better clarity
// router.route("/:postId")
//     .get(getPostById) // Fetch post by ID
//     .patch(updatePost) // Update post
//     .delete(deletePost); // Delete post

// router.route("/profile/:targetUserId")
//         .get(getPostsOfUser)