// src/controllers/chat.controller.js
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { destroyFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";


// working
const getMyChats = asyncHandler(async (req, res, next) => {
    // get userId
    const userId = req.user._id;

    // get chats with having member
    const chats = await Chat.find({ members: userId }).populate(
        "members",
        "fullname username avatar"
    ).sort({ updatedAt: -1 });

    const filteredChats = chats.map(chat => {
        const otherUser = chat.members.find(
            member => member._id.toString() !== userId.toString()
        );
        return {
            _id: chat._id,
            friend: otherUser, // only the other participant
            lastSeen: chat.lastSeen,
            updatedAt: chat.updatedAt,
            createdAt: chat.createdAt,
        };
    });

    return res
        .status(200)
        .json(new ApiResponse(200, filteredChats, "chats fetched"));
});

const findChat = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { targetUserId } = req.query;

    if (!targetUserId || !isValidObjectId(targetUserId)) {
        throw new ApiError(400, "Invalid target user ID");
    }

    const chat = await Chat.findOne({
        members: { $all: [userId, targetUserId] },
    });

    if (!chat) {
        return res
            .status(200)
            .json(new ApiResponse(200, { haveChat: false }, "No chat found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { chatId: chat._id, haveChat: true }, "Chat found"));
});

export {
    getMyChats,
    findChat
};
