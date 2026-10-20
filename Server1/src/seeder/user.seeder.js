import { faker } from "@faker-js/faker";
import { User } from "../models/user.model.js";
import fs from "fs";

const TAG_POOL = [
  "coding", "react", "node", "funny", "memes",
  "travel", "food", "fitness", "music", "movies"
];

const getRandomInterests = () => {
  const count = faker.number.int({ min: 2, max: 5 });
  return faker.helpers.arrayElements(TAG_POOL, count);
};

const createUser = async (numUsers = 40) => {
  try {
    const users = [];

    for (let i = 0; i < numUsers; i++) {
      const username = faker.internet.username().toLowerCase();

      const user = await User.create({
        username,
        fullname: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: "11111",
        avatar: {
          url: faker.image.avatar(),
          public_id: faker.string.uuid(),
        },
        verifyCode: "000000",
        verifyCodeExpiry: faker.date.future(),
        isVerified: true,

        bio: faker.lorem.sentence(),

        interests: getRandomInterests(),

        lastActiveAt: faker.date.recent({ days: 7 }),
      });

      users.push({
        _id: user._id,
        username: user.username,
      });
    }

    // 🔥 Save to file (IMPORTANT)
    fs.writeFileSync(
      "seedData/users.json",
      JSON.stringify(users, null, 2)
    );

    console.log(`✅ ${users.length} users created`);
    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export { createUser };