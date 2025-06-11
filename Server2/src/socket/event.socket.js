
// import { NEW_MESSAGE } from "../constants/events.js";

// const newMessageHandler = (io, socket, user, userSocketIDs) => {
//   socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
//     // message logic
//   });
// };

const newChatJoinedHandler = (io, socket, chatId) => {
  socket.on(CHAT_JOINED, async ({ chatId, userId }) => {
    // message logic
    socket.join(chatId);
  });
};

// export {newMessageHandler}

// socketEmitter.js
// import { getSocketIO } from "./socketStore.js"
// import { onlineUsers } from "./index.js"; // your onlineUsers map
// import { NEW_MESSAGE_RECEIVED } from "../constants/events.js";
import { NEW_MESSAGE_ALERT } from "../constants/events.js";
import { getSocketIO } from "./index.socket.js";


const emitNewMessage = (chatId, message, senderId, recipient) => {
  const io = getSocketIO();
  console.log("Emitting new message to recipient:", recipient);
  io.to(chatId).emit(NEW_MESSAGE_ALERT, {
    chatId,
    message,
    senderId,
  });
};

// You can keep adding more emitter functions:
 const emitNotification = (userId, notification) => {
  emitToUser(userId, "NEW_NOTIFICATION", notification);
};

export {
  // emitChatJoined,
  // emitToUser,
  emitNewMessage,
  emitNotification,
};
