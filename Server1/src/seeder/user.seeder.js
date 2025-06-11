import { faker } from "@faker-js/faker";
import { User } from "../models/user.model.js";

const createUser = async (numUsers) => {
    try {
        const usersPromise = [];

        for (let i = 0; i < numUsers; i++) {
            const tempUser = User.create({
                username: faker.internet.userName(),
                fullname: faker.person.fullName(),
                email: faker.internet.email(),
                password: "11111",
                avatar: {
                    url: faker.image.avatar(),
                    public_id: faker.system.fileName(),
                },
                verifyCode: "000000",
                verifyCodeExpiry: faker.date.future(),
                isVerified: true,
            });
            usersPromise.push(tempUser);
        }

        await Promise.all(usersPromise);

        console.log("Users created", usersPromise);

        process.exit(1);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export { createUser };
