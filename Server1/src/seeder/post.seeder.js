import { faker } from "@faker-js/faker";
import { Post } from "../models/post.model.js";
import fs from "fs";
import mongoose from "mongoose";

// load users
const users = JSON.parse(
  fs.readFileSync("seedData/users.json", "utf-8")
);

const TAG_POOL = [
  "coding", "react", "node", "javascript",
  "funny", "memes", "travel", "food",
  "fitness", "music", "movies"
];

const getRandomTags = () => {
  return faker.helpers.arrayElements(
    TAG_POOL,
    faker.number.int({ min: 1, max: 3 })
  );
};

const getRandomMentions = () => {
  return faker.helpers.arrayElements(
    users,
    faker.number.int({ min: 0, max: 2 })
  );
};

const getRandomDate = () => {
  const rand = Math.random();

  if (rand < 0.4) return faker.date.recent({ days: 1 });
  if (rand < 0.8) return faker.date.recent({ days: 7 });

  return faker.date.past({ years: 1 });
};

const createPosts = async (numPosts = 200) => {
  try {
    const postsData = [];

    for (let i = 0; i < numPosts; i++) {
      const owner =
        i < 80
          ? faker.helpers.arrayElement(users.slice(0, 5))
          : faker.helpers.arrayElement(users);

      const tags = getRandomTags();

      const mentionUsers = getRandomMentions();
      const mentionIds = mentionUsers.map(
        (u) => new mongoose.Types.ObjectId(u._id)
      );

      const tagText = tags.map((t) => `#${t}`).join(" ");
      const mentionText = mentionUsers.map((u) => `@${u.username}`).join(" ");

      const description = `${faker.lorem.sentence()} ${tagText} ${mentionText}`;

      const imageId = faker.number.int({ min: 1, max: 1000 });

      const createdAt = getRandomDate();

      postsData.push({
        postFile: {
          url: `https://picsum.photos/seed/${imageId}/600/800`,
          public_id: `seed_${imageId}`,
        },
        description,
        owner: new mongoose.Types.ObjectId(owner._id),
        tags,
        mentions: mentionIds,
        likesCount: 0,
        commentsCount: 0,
        createdAt,
        updatedAt: createdAt,
      });
    }

    // 🔥 insert posts
    const insertedPosts = await Post.insertMany(postsData);

    // 🔥 save post ids
    const postIds = insertedPosts.map((p) => ({
      _id: p._id,
      owner: p.owner,
    }));

    fs.writeFileSync(
      "seedData/posts.json",
      JSON.stringify(postIds, null, 2)
    );

    console.log(`🔥 ${insertedPosts.length} posts created`);
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export { createPosts };