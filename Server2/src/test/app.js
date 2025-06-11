// index.js
import dotenv from "dotenv";
import connectDB from "./db/index.db.js";
import express from "express"
import { Server } from "socket.io";
import { createServer } from "http"
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./constants/config.js";
import { setupSocket } from "./socket/index.socket.js";
import { errorMiddleware } from "./middlewares/error.middleware.js"

// load environmental variables
dotenv.config({ path: "./.env" });

// // connect database
// connectDB();

// // define port
// const PORT = process.env.PORT || 5001;

// create server
const app = express();
export const server = new createServer(app);
const io = new Server(server, {
    cors: corsOptions,
});

// set app and io
// app.set("io", io);
setupSocket(io);

// socketStore.js
// let ioInstance = null;

// export const setSocketIO = (io) => {
//   ioInstance = io;
// };

// export const getSocketIO = () => ioInstance;


// define middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors(corsOptions));

// // createFakeChatsForUser("6829be5ac5c2792f2b40aa62", 5);
// const chatId = "6832e481d23daade68240721"
// const senderId = "6829be5ac5c2792f2b40aa64"
// const senderId = "6829be5ac5c2792f2b40aa62"
// seedMessages(chatId, senderId, 12)

// // import routes
// import userRoute from "./routes/user.route.js"
import chatRoute from "./routes/chat.route.js"
import messageRoute from "./routes/message.route.js"
import { seedMessages } from "./seeders/message.seeder.js";

// // declare routes
// app.use("/api/v3/user", userRoute);
app.use("/api/v3/chats", chatRoute);
app.use("/api/v3/messages", messageRoute);


// define error handling middleware
app.use(errorMiddleware);

// // server listening
// server.listen(PORT, () => {
//     console.log('server running at http://localhost:5001');
// });

// export {Server}


// controllers/friendRequest.controller.js
import { FriendRequest } from "../models/friendRequest.model.js";
import { Notification } from "../models/notification.model.js";
import { Chat } from "../models/chat.model.js";
import NotificationTypes from "../constants/notify.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



// Accept/Reject Friend Request
export const respondFriendRequest = asyncHandler(async (req, res) => {
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
            sender: request.sender,
            receiver: request.receiver,
            type: NotificationTypes.CHAT_INVITATION_REQUEST,
            "metadata.requestId": request._id
        })
    ])

    if (accept) {
        // Create chat
        const chat = await Chat.create({ members: [request.sender, request.receiver] });

        // Notify sender about acceptance
        const newNotification = await Notification.create({
            sender: userId,
            receiver: request.sender,
            type: NotificationTypes.CHAT_REQUEST_ACCEPTED,
            content: "accepted your chat request",
            metadata: {
                chatId: chat._id
            }
        });

        return res
            .status(200)
            .json(new ApiResponse(200, newNotification, "Friend request accepted, chat created"));
    } else {
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Friend request rejected"));
    }

});