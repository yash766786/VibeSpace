import {Router} from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    acceptFriendRequest,
    getMyFriends,
    getMyNotifications,
    searchUser,
    sendFriendRequest,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);

// After here user must be logged in to access the routes
router.use(verifyToken);

router.get("/profile", getCurrentUser);
router.get("/logout", logoutUser);
router.get("/search", searchUser);
router.put("/send-request", sendFriendRequest);
router.put("/accept-request", acceptFriendRequest);
router.get("/notifications", getMyNotifications);
router.get("/friends", getMyFriends);

export default router;
