import { Router } from "express";
import {
    findChat,
    // addMembers,
    // deleteChat,
    // getChatDetails,
    // getMessages,
    getMyChats,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// After here user must be logged in to access the routes

router.use(verifyToken);
router.get("/", getMyChats);
router.route("/find").get(findChat)


// // Get Chat Details, rename,delete
// router
//     .route("/:id")
//     .get(getChatDetails)
//     .put(renameGroup)
//     .delete(deleteChat);

export default router;
