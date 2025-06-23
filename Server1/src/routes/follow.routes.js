import { Router } from 'express';
import {
    toggleFollowUser,
    getFollowers,
    getFollowings
} from "../controllers/follow.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyToken); // Apply verifyToken middleware to all routes in this file

router.route("/toggle/u/:targetUserId").get(toggleFollowUser);
router.get('/followers/u/:targetUserId', getFollowers);
router.get('/followings/u/:targetUserId', getFollowings);

export default router