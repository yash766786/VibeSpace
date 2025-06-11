// import { faker, simpleFaker } from "@faker-js/faker";
// import { Chat } from "../models/chat.model.js";
// import { Message } from "../models/message.model.js";
// import { User } from "../models/user.model.js";

// const createSingleChats = async (numChats) => {
//   try {
//     const users = await User.find().select("_id");

//     const chatsPromise = [];

//     for (let i = 0; i < users.length; i++) {
//       for (let j = i + 1; j < users.length; j++) {
//         chatsPromise.push(
//           Chat.create({
//             name: faker.lorem.words(2),
//             members: [users[i], users[j]],
//           })
//         );
//         break;
//       }
//     }

//     await Promise.all(chatsPromise);

//     console.log("Chats created successfully");
//     process.exit();
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };


import { faker } from "@faker-js/faker";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";

const createFakeChatsForUser = async (targetUserId, numberOfChats = 5) => {
  try {
    // Fetch all users except the target user
    const otherUsers = await User.find({ _id: { $ne: targetUserId } }).select("_id");

    if (otherUsers.length === 0) {
      console.log("No other users available to chat with.");
      return process.exit(1);
    }

    // Shuffle and select 'numberOfChats' users
    const selectedUsers = faker.helpers.shuffle(otherUsers).slice(0, numberOfChats);

    // Create chats
    const chatPromises = selectedUsers.map(({ _id }) =>
      Chat.create({
        members: [targetUserId, _id],
        lastSeen: {
          [targetUserId]: faker.date.recent(),
          [_id]: faker.date.recent(),
        }
      })
    );

    await Promise.all(chatPromises);

    console.log(`✅ ${chatPromises.length} fake chats created for user ${targetUserId}`);
    process.exit();
  } catch (error) {
    console.error("❌ Error creating fake chats:", error);
    process.exit(1);
  }
};

// Call the function with your user ID
// createFakeChatsForUser("6829be5ac5c2792f2b40aa62", 5);


const createGroupChats = async (numChats) => {
  try {
    const users = await User.find().select("_id");

    const chatsPromise = [];

    for (let i = 0; i < numChats; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
      const members = [];

      for (let i = 0; i < numMembers; i++) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];

        // Ensure the same user is not added twice
        if (!members.includes(randomUser)) {
          members.push(randomUser);
        }
      }

      const chat = Chat.create({
        groupChat: true,
        name: faker.lorem.words(1),
        members,
        creator: members[0],
      });

      chatsPromise.push(chat);
    }

    await Promise.all(chatsPromise);

    console.log("Chats created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createMessages = async (numMessages) => {
  try {
    const users = await User.find().select("_id");
    const chats = await Chat.find().select("_id");

    const messagesPromise = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      messagesPromise.push(
        Message.create({
          chat: randomChat,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagesPromise);

    console.log("Messages created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createMessagesInAChat = async (chatId, numMessages) => {
  try {
    const users = await User.find().select("_id");

    const messagesPromise = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      messagesPromise.push(
        Message.create({
          chat: chatId,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagesPromise);

    console.log("Messages created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export {
  createGroupChats,
  createMessages,
  createMessagesInAChat,
  createFakeChatsForUser,
};
