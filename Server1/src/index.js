// index.js
import dotenv from "dotenv";
import connectDB from "./db/index.db.js";
import app from "./app.js";

dotenv.config({ path: './.env' }); // ✅ Load .env first!
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at port ${PORT}`);
  });
});
