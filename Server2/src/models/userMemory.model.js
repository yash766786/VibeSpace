import { Schema, model } from "mongoose";

const userMemorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  preferences: [String],
  facts: [String]

}, { timestamps: true });

export const UserMemory = model("UserMemory", userMemorySchema);