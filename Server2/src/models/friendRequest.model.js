import { Schema, model, Types } from "mongoose";

const FriendRequestSchema = new Schema({
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "accepted", "rejected"],
  },
  sender: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
},
  {
    timestamps: true,
  }
);

export const FriendRequest = model("FriendRequest", FriendRequestSchema);
