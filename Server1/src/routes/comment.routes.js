import { Router } from 'express';
import {
    getPostComments,
    addComment,
    deleteComment
} from "../controllers/comment.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router();

// Apply verifyToken middleware to all routes in this file
router.use(verifyToken);


router.route("/:postId")
    .get(getPostComments)
    .post(addComment);

router.route("/:commentId")
    .delete(deleteComment);

export default router