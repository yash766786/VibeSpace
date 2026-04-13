// src/services/ai.service.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const callGemini = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview"
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      return JSON.parse(text);
    } catch (err) {
      console.log("Raw Gemini Response:", text);

      return {
        reply: text,
        memory_update: { should_update: false, data: {} }
      };
    }

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};