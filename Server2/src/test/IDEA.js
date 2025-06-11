// controller/sendMessage.js
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  const senderId = req.user._id;

  const message = await Message.create({ content, chat: chatId, sender: senderId });

  // Emit socket event to other user in the chat
  req.app.get("io").to(chatId).emit("NEW_MESSAGE_RECEIVED", {
    chatId,
    message,
  });

  res.status(201).json({ success: true, message });
};
