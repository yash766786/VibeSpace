import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import fs from "fs";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

// 🔥 load data
const users = JSON.parse(fs.readFileSync("seedData/users.json", "utf-8"));
const posts = JSON.parse(fs.readFileSync("seedData/posts.json", "utf-8"));

const COMMENT_POOL = [
  "Nice post!",
  "🔥🔥🔥",
  "Loved this!",
  "Amazing!",
  "So cool 😍",
  "Where is this?",
  "Great work!",
  "Haha 😂",
  "Interesting 🤔",
  "This is awesome!",
  "Can you share more?",
];

const createComments = async () => {
  try {
    const comments = [];

    for (const post of posts) {
      const rand = Math.random();
      let commentCount = 0;

      // 🔥 distribution
      if (rand < 0.1) commentCount = faker.number.int({ min: 10, max: 25 });
      else if (rand < 0.5) commentCount = faker.number.int({ min: 3, max: 10 });
      else if (rand < 0.8) commentCount = faker.number.int({ min: 1, max: 3 });
      else commentCount = 0;

      for (let i = 0; i < commentCount; i++) {
        const user = faker.helpers.arrayElement(users);

        comments.push({
          content: faker.helpers.arrayElement(COMMENT_POOL),
          post: new mongoose.Types.ObjectId(post._id),
          owner: new mongoose.Types.ObjectId(user._id),
          createdAt: faker.date.recent({ days: 7 }),
          updatedAt: new Date(),
        });
      }

      // 🔥 update commentsCount
      await Post.findByIdAndUpdate(post._id, {
        commentsCount: commentCount,
      });
    }

    await Comment.insertMany(comments);

    console.log(`💬 ${comments.length} comments created`);
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export { createComments };