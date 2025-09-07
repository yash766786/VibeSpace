// app.js
import cors from "cors";
import express from "express"
import { Server } from "socket.io";
import { createServer } from "http"
import cookieParser from "cookie-parser";
import { corsOptions } from "./constants/corsOption.js";
import { setupSocket } from "./socket/index.socket.js";
import { errorMiddleware } from "./middlewares/error.middleware.js"

// create server
const app = express();
const server = new createServer(app);

// define middlewares
app.use(cors(corsOptions));
const io = new Server(server, {
    cors: corsOptions,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));


// set app and io
app.set("io", io);
setupSocket(io);

// import routes
import userRouter from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js"
import messageRoute from "./routes/message.route.js"
import friendRequestRoute from "./routes/friendRequest.route.js"
import notificationRoute from "./routes/notification.route.js"

// declare routes
app.use("/api/v3/users", userRouter);
app.use("/api/v3/chats", chatRoute);
app.use("/api/v3/messages", messageRoute);
app.use("/api/v3/friendRequests", friendRequestRoute);
app.use("/api/v3/notifications", notificationRoute);

// define error handling middleware
app.use(errorMiddleware);

export { server }