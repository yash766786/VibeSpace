import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { sendFriendRequest, respondFriendRequest } from "../controllers/friendRequest.controller.js";

const router = Router()
router.use(verifyToken)

router.post("/new-request", sendFriendRequest);
router.post("/respond-request", respondFriendRequest);

export default router;