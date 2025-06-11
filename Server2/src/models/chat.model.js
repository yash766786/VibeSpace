// src/models/chat.model.js
import { Schema, model, Types } from "mongoose";

const chatSchema = new Schema({
  members: [
    {
      type: Types.ObjectId,
      ref: "User",
      required: true
    }
  ],
  lastSeen: {
    type: Map,
    of: Date,
    default: {}  // Will store { userId: lastSeenDate }
  }
}, {
  timestamps: true
});

export const Chat = model("Chat", chatSchema);
