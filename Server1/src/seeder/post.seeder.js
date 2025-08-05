import { faker } from "@faker-js/faker";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

const createPost = async (numPosts) => {
    try {
        const users = [
            "6891ab6dcb921ec55b35fdd2",
            "6891ab6dcb921ec55b35fdd6",
            "6891ab6dcb921ec55b35fdd4",
            "6891ab6dcb921ec55b35fdd7",
            "6891ab6dcb921ec55b35fdd8"
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