import { Follow } from "../models/follow.model.js";
import fs from "fs";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

// 🔥 Load users
const users = JSON.parse(
  fs.readFileSync("seedData/users.json", "utf-8")
);

const createFollows = async () => {
  try {
    const follows = [];
    const followSet = new Set(); // prevent duplicates

    for (const user of users) {
      // 🔥 Each user follows 5–10 people
      const followCount = faker.number.int({ min: 5, max: 10 });

      // 🔥 Influencer bias (first 5 users are "popular")
      const potentialUsers = [
        ...users.slice(0, 5), // influencers
        ...users
      ];

      const selected = faker.helpers.arrayElements(
        potentialUsers,
        followCount
      );

      for (const target of selected) {
        // ❌ prevent self-follow
        if (user._id === target._id) continue;

        const key = `${user._id}_${target._id}`;

        if (followSet.has(key)) continue;

        followSet.add(key);

        follows.push({
          follower: new mongoose.Types.ObjectId(user._id),
          following: new mongoose.Types.ObjectId(target._id),
          createdAt: faker.date.recent({ days: 30 }),
          updatedAt: new Date(),
        });
      }
    }

    await Follow.insertMany(follows);

    console.log(`👥 ${follows.length} follows created`);
    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export { createFollows };