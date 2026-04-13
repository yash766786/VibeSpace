// src/routes/vibe.routes.js

import express from "express";
import { 
    getUserMemoryController, 
    getVibeMessagesController, 
    vibeChatController 
} from "../controllers/vibe.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/chat", verifyToken, vibeChatController);
router.get("/messages", verifyToken, getVibeMessagesController);
router.get("/memory", verifyToken, getUserMemoryController);

export default router;