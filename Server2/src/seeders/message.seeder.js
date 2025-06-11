import { faker } from "@faker-js/faker";
import { Message } from "../models/message.model.js";

/**
 * Creates fake messages for a given chat and sender.
 * @param {string} chatId - Chat ID to assign the messages to.
 * @param {string} senderId - User ID of the sender.
 * @param {number} count - Number of messages to create.
 */
export const seedMessages = async (chatId, senderId, count = 10) => {
    try {
        const messages = [];

        for (let i = 0; i < count; i++) {
            messages.push({
                content: faker.lorem.sentence(),
                attachments: faker.datatype.boolean()
                    ? [
                        {
                            public_id: faker.system.fileName().replace(/\..+$/, ""),
                            url: faker.image.urlPicsumPhotos(),
                        }
                    ]
                    : [],
                sender: senderId,
                chat: chatId,
                createdAt: faker.date.recent(7),
                updatedAt: new Date(),
            });
        }

        await Message.insertMany(messages);
        console.log(`✅ Seeded ${count} messages for chat ${chatId}`);
        process.exit(1);
    } catch (error) {
        console.error("❌ Error seeding messages:", error);
        process.exit(1);
    }
};
