import { Router } from 'express';
import {
    getAllPosts,
    uploadPost,
    updatePost,
    deletePost,
    getPostsOfUser
} from "../controllers/post.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Apply verifyToken middleware to all routes in this file
router.use(verifyToken);

router.route("/")
    .get(getAllPosts) // Fetch all posts
    .post(
        upload.single("postFile"),
          uploadPost
        );

// Use 'postId' for better clarity
router.route("/:postId")
    .patch(updatePost) // Update post
    .delete(deletePost); // Delete post

router.route("/profile/:targetUserId")
        .get(getPostsOfUser)

export default router;
