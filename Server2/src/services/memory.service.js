// src/services/memory.service.js

import { UserMemory } from "../models/userMemory.model.js";

export const updateMemory = async (userId, data) => {
  const update = {};

  if (data.preferences?.length) {
    update.$addToSet = {
      ...update.$addToSet,
      preferences: { $each: data.preferences }
    };
  }

  if (data.facts?.length) {
    update.$addToSet = {
      ...update.$addToSet,
      facts: { $each: data.facts }
    };
  }

  const usermemory =  await UserMemory.findOneAndUpdate(
    { userId },
    update,
    { upsert: true, new: true }
  );

  console.log(`usermemory${userId}: ${usermemory}`)
};