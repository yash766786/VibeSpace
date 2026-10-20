import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "./db/index.db.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import app from "./app.js";

const PORT = 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("🍃 MongoDB connected");

    await connectRabbitMQ();

    app.listen(PORT, () => {
      console.log(`🚀 Server running at port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();