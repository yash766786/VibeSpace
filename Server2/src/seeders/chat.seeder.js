import { Chat } from "../models/chat.model.js";
import fs from "fs";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

// 🔥 Load users
const users = JSON.parse(
  fs.readFileSync("seedData/users.json", "utf-8")
);

const FIXED_USER_ID = "69ddd351ed66eb42925a3dd1";

const createChats = async () => {
  try {
    const chats = [];

    const fixedUser = new mongoose.Types.ObjectId(FIXED_USER_ID);

    // ❗ remove fixed user from list (avoid self chat)
    const otherUsers = users.filter(
      (u) => u._id !== FIXED_USER_ID
    );

    // 🎯 pick 20 random unique users
    const selectedUsers = faker.helpers.arrayElements(
      otherUsers,
      20
    );

    for (const user of selectedUsers) {
      const otherUser = new mongoose.Types.ObjectId(user._id);

      chats.push({
        members: [fixedUser, otherUser],
        lastSeen: {
          [FIXED_USER_ID]: faker.date.recent({ days: 2 }),
          [user._id]: faker.date.recent({ days: 2 })
        },
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: new Date()
      });
    }

    // optional cleanup (recommended while testing)
    await Chat.deleteMany({
      members: fixedUser
    });

    await Chat.insertMany(chats);

    console.log(`💬 ${chats.length} chats created for fixed user`);
    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export { createChats };