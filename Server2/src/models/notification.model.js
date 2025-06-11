// models/notification.model.js
import { Schema, model, Types } from "mongoose";
import NotificationTypes from "../constants/notify.js";

const notificationSchema = new Schema({
    receiver: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    sender: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(NotificationTypes),
    },
    content: {
        type: String,
    },
    chat: {
        type: Types.ObjectId,
        ref: "Chat",
    },
    seen: {
        type: Boolean,
        default: false,
        index: true,
    },
    metadata: {
        type: Schema.Types.Mixed,
        default: () => ({}),
    },

},
    { timestamps: true }
);

export const Notification = model("Notification", notificationSchema);