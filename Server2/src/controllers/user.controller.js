import { cookieOptions, deleteCookieOptions } from "../constants/constant.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessToken } from "../utils/tokenGenerator.js";

// done
const loginUser = asyncHandler(async (req, res) => {
    // Step 1: user info
    const { user } = req.body;
    console.log("calling for loging in server2...")
    console.log(req.body)

    // Step 5: Generate access token
    const accessTokenWs = await generateAccessToken(user);

    // Step 7: Send response with cookie
    return res
        .status(200)
        .cookie("accessTokenWs", accessTokenWs, cookieOptions)
        .json(new ApiResponse(200, user, "User logged in webserver successfully "));
});

// done
const logoutUser = asyncHandler(async (req, res) => {
    console.log("calling for logout in server2...")
    return res
        .status(200)
        .clearCookie("accessTokenWs", deleteCookieOptions)
        .json(new ApiResponse(200, null, "User logged Out from webserver"))
})

export { 
    loginUser, 
    logoutUser 
}