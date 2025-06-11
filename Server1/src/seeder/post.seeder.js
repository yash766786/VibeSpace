import { faker } from "@faker-js/faker";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

const createPost = async (numPosts) => {
    try {
        const users = [
            "6829be5ac5c2792f2b40aa62",
            "6829be5ac5c2792f2b40aa67",
            "6829be5ac5c2792f2b40aa65",
            "6829be5ac5c2792f2b40aa63",
            "6829be5ac5c2792f2b40aa64"
        ]
        const postsPromise = [];

        for (let i = 0; i < numPosts; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const tempPost = Post.create({
                description: faker.lorem.paragraph(),
                postFile: {
                    url: faker.image.url(),
                    public_id: faker.system.fileName(),
                },
                owner: randomUser,
            });

            postsPromise.push(tempPost);
        }
        await Promise.all(postsPromise);
        console.log("Posts created", postsPromise);
        process.exit(1);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export { createPost };