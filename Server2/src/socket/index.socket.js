// src/socket/index.js
import cookieParser from "cookie-parser";
import { socketAuthenticator } from "../middlewares/auth.middleware.js";
import { Chat } from "../models/chat.model.js";
import { joinUserToChats } from "./utils/socketUtils.js";
import { registerChatEvents } from "./handlers/chatEvent.js";
import { CHECK_ONLINE, ONLINE_USERS } from "../constants/events.js";
// onlineUsers: userId => socketId
const onlineUsers = new Map();
let ioInstance = null;

export const setupSocket = (io) => {
    ioInstance = io;
    console.log("socket running..")
    io.use((socket, next) => {
        cookieParser()(
            socket.request,
            socket.request.res,
            async (err) => socketAuthenticator(err, socket, next)
        );
    });

    io.on("connection", async (socket) => {
        const [socketId, userId] = [socket.id, socket.user._id];
        onlineUsers.set(userId, socketId); // ✅ Store socketId for the user
        console.log("User connected", { socketId: socket.id, userId: userId });

        // ✅ Join user to their chat rooms
        const userChats = await Chat.find({ members: userId }).select("_id");
        const chatIds = userChats.map(chat => chat._id.toString());
        joinUserToChats(io, socket, chatIds);


        // ✅ Register socket event listeners
        registerChatEvents(io, socket);

        socket.on("disconnect", () => {
            console.log("User disconnected...")
            onlineUsers.delete(userId);
        });


    });
};

const getSocketIO = () => ioInstance;

export { onlineUsers, getSocketIO };

