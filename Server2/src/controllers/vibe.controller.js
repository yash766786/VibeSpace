import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { AIChatMessage } from "../models/aiChatMessage.model.js";
import { UserMemory } from "../models/userMemory.model.js";

import { buildContext } from "../services/contextBuilder.js";
import { callGemini } from "../services/ai.service.js";
import { updateMemory } from "../services/memory.service.js";

export const vibeChatController = asyncHandler(async (req, res) => {

  console.log("🟢 STEP 1: Request received");
  const userId = req.user?._id;
  const { message } = req.body;
  const chatId = "default";

  console.log("UserId:", userId);
  console.log("Message:", message);

  // 🔴 Validation
  if (!message) {
    console.log("❌ ERROR: Message missing");
    throw new ApiError(400, "Message is required");
  }

  // 🟡 STEP 2: Save user message
  console.log("🟡 STEP 2: Saving user message...");
  await AIChatMessage.create({
    userId,
    chatId,
    sender: "user",
    message
  });
  console.log("✅ User message saved");

  // 🔵 STEP 3: Fetch recent messages
  console.log("🔵 STEP 3: Fetching recent messages...");

  const recentMessages = await AIChatMessage.find({ userId, chatId })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  recentMessages.reverse();
  console.log("Recent Messages Count:", recentMessages.length);

  // 🟣 STEP 4: Get or create user memory
  console.log("🟣 STEP 4: Fetching user memory...");
  let userMemory = await UserMemory.findOne({ userId });

  if (!userMemory) {
    console.log("⚠️ No memory found, creating new...");
    userMemory = await UserMemory.create({ userId });
  }

  console.log("User Memory:", userMemory);

  // 🧠 STEP 5: Build context
  console.log("🧠 STEP 5: Building context...");
  const prompt = buildContext({
    message,
    memory: userMemory,
    recentMessages
  });
  console.log("Prompt built successfully");

  // 🤖 STEP 6: Call Gemini
  console.log("🤖 STEP 6: Calling Gemini API...");
  const aiResponse = await callGemini(prompt);

  console.log("Raw AI Response:", aiResponse);
  const { reply, memory_update } = aiResponse;

  if (!reply) {
    console.log("❌ ERROR: No reply from AI");
    throw new ApiError(500, "AI did not return a valid response");
  }

  // 🟢 STEP 7: Save bot response
  console.log("🟢 STEP 7: Saving bot reply...");
  await AIChatMessage.create({
    userId,
    chatId,
    sender: "bot",
    message: reply
  });
  console.log("✅ Bot reply saved");

  // 🟡 STEP 8: Update memory (if needed)
  console.log("🟡 STEP 8: Checking memory update...");
  if (memory_update?.should_update) {
    console.log("Memory Update Data:", memory_update.data);
    await updateMemory(userId, memory_update.data);
    console.log("✅ Memory updated");
  } else {
    console.log("ℹ️ No memory update needed");
  }

  // 🔵 STEP 9: Send response
  console.log("🔵 STEP 9: Sending response...");
  return res
    .status(200)
    .json(new ApiResponse(200, { reply, memory_update }, "Vibe reply generated successfully"));

});


export const getVibeMessagesController = asyncHandler(async (req, res) => {

  console.log("🟢 Fetch Messages Request");

  const userId = req.user?._id;
  const chatId = "default";

  let { page = 1, limit = 20 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  if (page < 1 || limit < 1) {
    throw new ApiError(400, "Invalid pagination params");
  }

  console.log(`📄 Page: ${page}, Limit: ${limit}`);

  const skip = (page - 1) * limit;

  // 🔵 Fetch messages
  const messages = await AIChatMessage.find({ userId, chatId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // reverse for chat UI (old → new)
  const formattedMessages = messages.reverse();

  const totalMessages = await AIChatMessage.countDocuments({ userId, chatId });

  console.log("✅ Messages fetched:", formattedMessages.length);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        messages: formattedMessages,
        pagination: {
          total: totalMessages,
          page,
          limit,
          totalPages: Math.ceil(totalMessages / limit)
        }
      },
      "Vibe messages fetched successfully"
    )
  );
});


export const getUserMemoryController = asyncHandler(async (req, res) => {

  console.log("🧠 Fetch User Memory Request");

  const userId = req.user?._id;

  let userMemory = await UserMemory.findOne({ userId }).lean();

  if (!userMemory) {
    console.log("⚠️ No memory found, returning empty");

    userMemory = {
      preferences: [],
      facts: []
    };
  }

  console.log("✅ User Memory:", userMemory);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        memory: {
          preferences: userMemory.preferences || [],
          facts: userMemory.facts || []
        }
      },
      "User memory fetched successfully"
    )
  );
});