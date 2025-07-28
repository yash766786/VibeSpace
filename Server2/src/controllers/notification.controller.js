// controllers/notification.controller.js
import { Notification } from "../models/notification.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const fetchNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const notifications = await Notification.find({
        receiver: userId,
        $or: [
            { seen: false },
            { seen: true, updatedAt: { $gte: twoHoursAgo } },
            { type: "CHAT_INVITATION_REQUEST",  seen: false }
        ]
    })
        .sort({ updatedAt: -1 }) // Newest first
        .lean();

    return res.status(200).json(new ApiResponse(200, notifications, "All notification fetched"));
});


// controllers/notification.controller.js
const markAllNotificationsSeen = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const till = await Notification.updateMany(
        { receiver: userId, seen: false },
        { seen: true, updatedAt: new Date() }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, null, "All notifications marked as seen"));
});


export { fetchNotifications, markAllNotificationsSeen }