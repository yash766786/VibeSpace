import dotenv from "dotenv";
import connectDB from "./src/db/index.db.js";
import { createUser } from "./src/seeder/user.seeder.js";
import { createPosts } from "./src/seeder/post.seeder.js";
import { createLikes } from "./src/seeder/like.seeder.js";
import { createComments } from "./src/seeder/comment.seeder.js";
import { createFollows } from "./src/seeder/follow.seeder.js";

dotenv.config({ path: "./.env" });

const runSeed = async () => {
  try {
    await connectDB();
    console.log("✅ DB Connected");

    await createLikes(800)

    console.log("🌱 Seeding done");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runSeed();