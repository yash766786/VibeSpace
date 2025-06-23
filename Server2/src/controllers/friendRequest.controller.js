import { NEW_NOTIFICATION_ALERT } from "../constants/events.js";
import NotificationTypes from "../constants/notify.js";
import { Chat } from "../models/chat.model.js";
import { FriendRequest } from "../models/friendRequest.model.js";
import { Notification } from "../models/notification.model.js";
import { onlineUsers } from "../socket/index.socket.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";


const sendFriendRequest = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { targetUserId } = req.body;
    const message = (req.body.message || "").trim();

    if (userId.toString() === targetUserId) {
        throw new ApiError(400, "You cannot send a request to yourself");
    }

    const [request, existedChat, existedNotification] = await Promise.all([
        FriendRequest.findOne({ sender: userId, receiver: targetUserId }),
        Chat.findOne({
            members: { $all: [userId, targetUserId] },
        }),
        Notification.findOne({
            receiver: targetUserId,
            sender: userId, type: NotificationTypes.CHAT_INVITATION_REQUEST
        })
    ])

    if (existedChat) {
        throw new ApiError(400, "Chat Already Exist");
    }

    if (request) await request.deleteOne()
    if (existedNotification) await existedNotification.deleteOne();

    const [newRequest, user] = await Promise.all([
        FriendRequest.create({
            sender: userId,
            receiver: targetUserId,
        }),
        User.findById(userId).select("username avatar")
    ])

    const newNotification = await Notification.create({
        receiver: targetUserId,
        sender: userId,
        content: message.trim() || "New Friend is waiting to chat with you",
        type: NotificationTypes.CHAT_INVITATION_REQUEST,
        metadata: {
            requestId: newRequest._id,
            status: newRequest.status,
            user
        }
    })

    // Emit socket event to other user in the chat
    const socketId = onlineUsers.get(targetUserId);
    if (socketId) {
        req.app.get("io").to(socketId).emit(NEW_NOTIFICATION_ALERT, {
            userId,
            newNotification,
            targetUserId
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, newNotification, "Friend Request Sent"))
});


const respondFriendRequest = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { requestId, accept } = req.body;

    const request = await FriendRequest.findById(requestId);

    if (!request || request.receiver.toString() !== userId.toString()) {
        throw new ApiError(404, "Friend request not found or unauthorized")
    }

    // Remove friend request and previous notification
    await Promise.all([
        FriendRequest.findByIdAndDelete(requestId),
        Notification.deleteOne({
            sender: request.sender.toString(),
            receiver: request.receiver.toString(),
            type: NotificationTypes.CHAT_INVITATION_REQUEST,
            "metadata.requestId": request._id
        })
    ])

    if (accept) {
        // Create chat
        const [chat, user] = await Promise.all([
            Chat.create({ members: [request.sender, request.receiver] }),
            User.findById(userId).select("username avatar")
        ])

        // Notify sender about acceptance
        const newNotification = await Notification.create({
            sender: userId,
            receiver: request.sender,
            type: NotificationTypes.CHAT_INVITATION_ACCEPT,
            content: "accepted your chat request",
            metadata: {
                chatId: chat._id,
                user
            }
        });

        // Emit socket event to other user in the chat
        const targetUserId = request.sender.toString()
        const socketId = onlineUsers.get(targetUserId);
        if (socketId) {
            req.app.get("io").to(socketId).emit(NEW_NOTIFICATION_ALERT, {
                newNotification,
                targetUserId
            });
        }

        return res
            .status(200)
            .json(new ApiResponse(200, newNotification, "Friend request accepted, chat created"));
    } else {
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Friend request rejected"));
    }

});


export { sendFriendRequest, respondFriendRequest }