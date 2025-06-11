// controllers/user.controller.js
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { Request } from "../models/request.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// working
const getMyNotifications = asyncHandler(async (req, res) => {
    console.log("step 1")
    const requests = await Request.find({ receiver: req.user }).populate(
        "sender",
        "username fullname avatar"
    );

    console.log("step 2")
    const allRequests = requests.map(({ _id, sender }) => ({
        _id,
        sender: {
            _id: sender._id,
            username: sender.username,
            avatar: sender.avatar.url,
        },
    }));

    console.log("step 3", allRequests)
    return res
    .status(200).json(new ApiResponse(200, allRequests, "all notification fetched"));
});


const getMyFriends = asyncHandler(async (req, res) => {
    const chatId = req.query.chatId;

    const chats = await Chat.find({
        members: req.user,
        groupChat: false,
    }).populate("members", "username fullname avatar");

    const friends = chats.map(({ members }) => {
        const otherUser = getOtherMember(members, req.user);

        return {
            _id: otherUser._id,
            username: otherUser.username,
            fullname: otherUser.fullname,
            avatar: otherUser.avatar.url,
        };
    });

    if (chatId) {
        const chat = await Chat.findById(chatId);

        const availableFriends = friends.filter(
            (friend) => !chat.members.includes(friend._id)
        );

        return res
            .status(200)
            .json(new ApiResponse(200, availableFriends, "fetched friends list"))
    } else {
        return res
            .status(200)
            .json(new ApiResponse(200, friends, "fetched friends list"));
    }
});


export {
    getCurrentUser,
    acceptFriendRequest,
    getMyFriends,
    getMyNotifications,
    searchUser,
    sendFriendRequest,
};
