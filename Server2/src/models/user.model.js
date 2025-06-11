// src/models/user.model.js
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  isVerified: {
    type: Boolean,
    default: false
  },
},
  {
    timestamps: true
  }
)

export const User = model("User", userSchema)