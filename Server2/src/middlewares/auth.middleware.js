// middlewares/auth.middleware.js
import Jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const verifyToken = asyncHandler(async (req, res, next) => {
    // Retrieve the token from cookies or Authorization header
    console.log("User Verification Middleware")
    const token = req.cookies?.accessToken 
    
    if (!token) {
        throw new ApiError(401, "Please authenticate using a valid token")
    }

    // verify token 
    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decodedToken;
    console.log(decodedToken)
    next();
})


// to be discuss later
const socketAuthenticator = asyncHandler(async (err, socket, next) => {
    if (err) return next(err);
    console.log("checking authentication...")

    const authToken = socket.request.cookies["accessToken"] || "accessToken";
    if (!authToken){
        throw new ApiError(401, "Please authenticate using a valid token")
    }

    const decodedToken = Jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
    socket.user = decodedToken;

    return next();
})

export { 
    verifyToken, 
    socketAuthenticator 
}