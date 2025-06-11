// index.js
import dotenv from "dotenv";
import connectDB from "./db/index.db.js";
import { server } from "./app.js";

// ✅ load environmental variables first!
dotenv.config({ path: './.env' }); 

// define port
const PORT = process.env.PORT || 5001;

// database call
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running at port ${PORT}`);
  });
});