// middlewares/auth.middleware.js
import Jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const verifyToken = asyncHandler(async (req, res, next) => {
    // Retrieve the token from cookies
    const token = req.cookies?.accessToken;
    if (!token) {
        throw new ApiError(401, "Please authenticate using a valid token")
    }

    // verify token 
    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decodedToken
    next();
})


const VerifyResetToken = asyncHandler(async (req, res, next) => {
    // Retrieve the token from cookies 
    const token = req.cookies?.resetToken;
    if (!token) {
        throw new ApiError(401, "Missing token. Please provide a valid reset token to proceed.")
    }

    // Verify the token
    const decodedToken = Jwt.verify(token, process.env.RESET_TOKEN_SECRET);

    // Validate token type/scope
    if (decodedToken.type !== "PASSWORDRESET") {
        throw new ApiError(401, "Invalid token type. Please use a valid password reset token.")
    }

    // Attach email to req object
    req.userEmail = decodedToken.email;

    // Proceed to the next middleware or controller
    next();
});


export {
    verifyToken,
    VerifyResetToken
}