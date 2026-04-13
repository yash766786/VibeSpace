import { Router } from "express";
import {
    findChat,
    getMyChats,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();


router.use(verifyToken);
router.get("/", getMyChats);
router.route("/find").get(findChat)

export default router;
