// src/socket/utils/socketUtils.js

export const joinUserToChats = (io, socket, chatIds) => {
  chatIds.forEach(chatId => {
    socket.join(chatId);
    io.to(chatId).emit("CHAT_JOINED", {
      chatId,
      userId: socket.user._id,
    });
  });
};
