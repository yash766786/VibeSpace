// middlewares/auth.middleware.js
import Jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const verifyToken = asyncHandler(async (req, res, next) => {
    // Retrieve the token from cookies 
    // console.log({request: req})
    const token = req.cookies?.accessTokenWs 
    
    if (!token) {
        throw new ApiError(401, "Please authenticate using a valid token")
    }

    // verify token 
    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decodedToken;
    next();
})


// to be discuss later
const socketAuthenticator = asyncHandler(async (err, socket, next) => {
    if (err) return next(err);

    const authToken = socket.request.cookies["accessTokenWs"] || "accessTokenWs";
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