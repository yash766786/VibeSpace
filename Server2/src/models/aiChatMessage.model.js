import { Schema, model } from "mongoose";

const aiChatMessageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  chatId: {
    type: String,
    default: "default",
    index: true
  },

  sender: {
    type: String,
    enum: ["user", "bot"],
    required: true
  },

  message: {
    type: String,
    required: true
  },

}, { timestamps: true });

// 🔥 important for performance
aiChatMessageSchema.index({ userId: 1, chatId: 1, createdAt: -1 });

export const AIChatMessage = model("AIChatMessage", aiChatMessageSchema);