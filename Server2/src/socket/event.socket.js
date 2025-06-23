// src/socket/event.socket.js
import { onlineUsers } from "./index.socket.js";
import {
  CHECK_ONLINE,
  NEW_MESSAGE_ALERT,
  NEW_MESSAGE_SEND,
  ONLINE_USERS,
  START_TYPING, 
  STOP_TYPING, 
  TYPING_STATUS
} from "../constants/events.js";

export const eventHandler = (io, socket) => {

  // onlines
  socket.on(CHECK_ONLINE, () => {
    socket.emit(ONLINE_USERS, [...onlineUsers.keys()]);
  });


  // typing..
  socket.on(START_TYPING, ({ chatId, userId }) => {
    io.to(chatId).emit(TYPING_STATUS, { userId, chatId, isTyping: true });
  });

  socket.on(STOP_TYPING, ({ chatId, userId }) => {
    io.to(chatId).emit(TYPING_STATUS, { userId, chatId, isTyping: false });
  });
};
