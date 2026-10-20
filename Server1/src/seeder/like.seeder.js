import { Like } from "../models/like.model.js";
import { Post } from "../models/post.model.js";
import fs from "fs";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

const users = JSON.parse(fs.readFileSync("seedData/users.json", "utf-8"));
const posts = JSON.parse(fs.readFileSync("seedData/posts.json", "utf-8"));

const createLikes = async () => {
    try {
        await Post.updateMany({}, { likesCount: 0 });
        console.log("🔥 NEW LIKE SEEDER RUNNING");
        const likes = [];

        for (const post of posts) {
            const rand = Math.random();
            let likeCount = 0;

            // 🔥 distribution
            if (rand < 0.1) likeCount = faker.number.int({ min: 40, max: 80 });
            else if (rand < 0.5) likeCount = faker.number.int({ min: 10, max: 30 });
            else if (rand < 0.8) likeCount = faker.number.int({ min: 2, max: 10 });
            else likeCount = 0;

            // 🔥 remove owner from pool
            const validUsers = users.filter(
                (u) => u._id !== post.owner
            );

            // 🔥 pick UNIQUE users directly
            const selectedUsers = faker.helpers.arrayElements(
                validUsers,
                Math.min(likeCount, validUsers.length)
            );

            // 🔥 create likes
            for (const user of selectedUsers) {
                likes.push({
                    likedBy: new mongoose.Types.ObjectId(user._id),
                    post: new mongoose.Types.ObjectId(post._id),
                    // ❌ DO NOT include comment at all
                    createdAt: faker.date.recent({ days: 7 }),
                    updatedAt: new Date(),
                });
            }

            // 🔥 correct count
            await Post.findByIdAndUpdate(post._id, {
                likesCount: selectedUsers.length,
            });
        }

        console.log("Generated likes:", likes.length);

        await Like.insertMany(likes, { ordered: false });

        console.log(`🔥 ${likes.length} likes created`);
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export { createLikes };