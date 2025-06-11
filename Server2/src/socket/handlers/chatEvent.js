// src/socket/handlers/chatEvents.js

import { CHECK_ONLINE, NEW_MESSAGE_ALERT, NEW_MESSAGE_SEND, NEW_NOTIFICATION, ONLINE_USERS, START_TYPING, STOP_TYPING, TYPING_STATUS } from "../../constants/events.js";
import { onlineUsers } from "../index.socket.js";

export const registerChatEvents = (io, socket) => {
    socket.on(NEW_MESSAGE_SEND, async ({ chatId, message }) => {
        // Emit to chat room
        io.to(chatId).emit(NEW_MESSAGE_ALERT, {
            message,
            senderId: socket.user._id,
        });
    });

    socket.on(CHECK_ONLINE, () => {
        socket.emit(ONLINE_USERS, [...onlineUsers.keys()]);
    });

    socket.on(NEW_NOTIFICATION, () =>{})



    socket.on(START_TYPING, ({ chatId, userId }) => {
        console.log(`User ${userId} is typing in chat ${chatId}`);
        io.to(chatId).emit(TYPING_STATUS, { userId, chatId, isTyping: true });
    });

    socket.on(STOP_TYPING, ({ chatId, userId }) => {
        console.log(`User ${userId} stopped typing in chat ${chatId}`);
        io.to(chatId).emit(TYPING_STATUS, { userId, chatId, isTyping: false });
    });
};
