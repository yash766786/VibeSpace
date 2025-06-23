// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// create server
const app = express();

// define middleware
app.use(cors({
  origin: "http://localhost:5173" || "http://localhost:5174",
  credentials: true,
}));
app.use(express.json({ limit: "512kb" }));
app.use(express.urlencoded({ extended: true, limit: "1024kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// import routes
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import followRouter from "./routes/follow.routes.js";
import { errorMiddleware } from './middlewares/error.middleware.js';

// define routes
app.use('/api/v3/users', userRouter);
app.use('/api/v3/posts', postRouter);
app.use('/api/v3/comments', commentRouter);
app.use('/api/v3/likes', likeRouter);
app.use('/api/v3/follows', followRouter);


// define error handling middleware
app.use(errorMiddleware);

export default app;