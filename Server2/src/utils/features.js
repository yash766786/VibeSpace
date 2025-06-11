// import { getSockets } from "../lib/helper.js";

// export const emitEvent = (req, event, users, data) => {
//   const io = req.app.get("io");
//   const usersSocket = getSockets(users);
//   io.to(usersSocket).emit(event, data);
// };

// utils/emitEvent.js
export const emitToUser = (io, onlineUsers, userId, event, data) => {
  const socketIdSet = onlineUsers.get(userId);
  
  if (!socketIdSet || socketIdSet.size === 0) {
    console.log(`❌ User ${userId} is offline. Event "${event}" not sent.`);
    return;
  }

  for (const socketId of socketIdSet) {
    io.to(socketId).emit(event, data);
    console.log(`📤 Event "${event}" sent to user ${userId} (socket: ${socketId})`);
  }
};
