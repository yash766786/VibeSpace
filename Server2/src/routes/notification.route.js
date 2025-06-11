// routes/notification.routes.js
import express from "express";
import {
  fetchNotifications,
  markAllNotificationsSeen,
} from "../controllers/notification.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", fetchNotifications);
router.patch("/mark-all-seen", markAllNotificationsSeen);

export default router;
