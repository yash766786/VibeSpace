// import { User } from "../models/user.model.js";
// import { Chat } from "../models/chat.model.js";
// import { Request } from "../models/request.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { isValidObjectId } from "mongoose";
import { Chat } from "../models/chat.model.js";
import { NEW_MESSAGE_CONFIRMED } from "../constants/events.js";
import { uploadMultipleFilesOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { emitNewMessage } from "../socket/event.socket.js";

const getMessages = asyncHandler(async (req, res, next) => {
    // 1. Get the chatId from the request params
    // 2. Get page and limit from the request query
    const chatId = req.params.chatId;
    console.log(chatId)
    const { page = 1, limit = 10 } = req.query;
    // 3. convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 20);
    const skip = (pageNumber - 1) * pageSize;

    // 4. Validate ChatId
    if (!isValidObjectId(chatId)) {
        throw new ApiError(400, "Invalid chat ID");
    }

    const [messages, totalMessagesCount] = await Promise.all([
        Message.find({ chat: chatId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .lean(),
        Message.countDocuments({ chat: chatId }),
    ]);

    const totalPages = Math.ceil(totalMessagesCount / pageSize)
    const currentPage = pageNumber;
    return res
        .status(200)
        .json(new ApiResponse(200, { messages, totalPages, currentPage }, "message fetched"));
});

const sendMessage = asyncHandler(async (req, res, next) => {
    // 1. Get the chatId and content/files from the request body and params
    // 2. Get the user from authenticated request
    const { content } = req.body;
    const chatId = req.params.chatId;
    const files = req.files || [];
    const userId = req.user?._id;

    // 3. Validate chatId and content/files
    if (!isValidObjectId(chatId)) {
        throw new ApiError(400, "Invalid chat ID");
    }
    if (!content && files.length==0) {
        throw new ApiError(400, "Please provide content or attachments");
    }
    if (files.length > 3) {
        throw new ApiError(400, "Files can't be more than 3");
    }
    
    // 4. Find the chat and user 
    // const chat = await Chat.findById(chatId);
    const chat = await Chat.findByIdAndUpdate(chatId, {
    $set: { [`lastSeen.${userId}`]: new Date() }
  });
    if (!chat) {
        throw new ApiError(404, "Chat not found");
    }

    // 6. Upload files to cloud storage if any
    const attachments = files.length > 0 ? await uploadMultipleFilesOnCloudinary(files) : [];

    // 7. Create the message object in the database
    const newMessage = await Message.create({
        content,
        attachments,
        sender: userId,
        chat: chatId,
    });

    // get the recipients of the message
    const member = chat.members.filter(id => id.toString() !== userId);
    const recipient = member[0].toString();
    console.log("recipients", recipient)

    // 8. emit the new message to the chat room
    emitNewMessage(chatId, newMessage, userId, recipient); // 🔥 Clean, expressive

    // 12. Return the message in the response
    return res
        .status(200)
        .json(new ApiResponse(200, newMessage, "Message sent successfully"));
})


export {
    getMessages, 
    sendMessage
}


// const recipients = chat.members.filter(id => id.toString() !== userId.toString());
// emitEvent(req, NEW_MESSAGE_RECEIVED, recipients, { chatId, message: newMessage });
