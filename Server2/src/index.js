// index.js
import dotenv from "dotenv";
import { server } from "./app.js";
import connectDB from "./db/index.db.js";

// ✅ load environmental variables first!
dotenv.config({ path: './.env' }); 

// define port
const PORT = process.env.PORT || 9021;

// database call
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running at port ${PORT}`);
  });
});