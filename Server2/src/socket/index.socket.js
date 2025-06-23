// src/socket/index.js
import cookieParser from "cookie-parser";
import { socketAuthenticator } from "../middlewares/auth.middleware.js";
import { Chat } from "../models/chat.model.js";
import { joinUserToChats } from "./utils/socketUtils.js";
import { CHECK_ONLINE, ONLINE_USERS } from "../constants/events.js";
import { eventHandler } from "./event.socket.js";
const onlineUsers = new Map();

export const setupSocket = (io) => {

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

        // ✅ Join user to their chat rooms
        const userChats = await Chat.find({ members: userId }).select("_id");
        const chatIds = userChats.map(chat => chat._id.toString());
        joinUserToChats(io, socket, chatIds);


        // ✅ Register socket event listeners
        eventHandler(io, socket);

        socket.on("disconnect", () => {
            onlineUsers.delete(userId);
        });


    });
};

export { onlineUsers };

