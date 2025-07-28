import { Router } from "express";
import { loginUser, logoutUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/login").post(loginUser)
router.route("/logout").get(verifyToken, logoutUser)

export default router;