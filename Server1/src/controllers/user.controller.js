// controllers/user.controller.js
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Follow } from "../models/follow.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendVerificationEmail } from "../helper/mailer.js";
import { cookieOptions, cookieOptionsForResetPassword, deleteCookieOptions } from "../constant/constant.js";
import { destroyFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateAccessToken, generateResetToken } from "../utils/tokenGenerator.js";


// done
const registerUser = asyncHandler(async (req, res) => {

    // 1. Get user data from request body
    const { username, email, fullname, password } = req.body;
    const avatarBuffer = req.file;

    // 2. Validate required fields and avatar
    if ([username, email, fullname, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (!avatarBuffer) {
        throw new ApiError(400, "Avatar file is required");
    }

    // 3: Check for existing user by email or by username
    const [existingUserByEmail, existingUserByUsername] = await Promise.all([
        User.findOne({ email }),
        User.findOne({ username: username.toLowerCase() })
    ]);

    if (existingUserByEmail) {
        if (existingUserByEmail.isVerified) {
            throw new ApiError(409, "User with this email already exists");
        } else {
            await destroyFromCloudinary(existingUserByEmail.avatar.public_id);
            await existingUserByEmail.deleteOne();
        }
    }

    if (existingUserByUsername && existingUserByUsername.email !== email) {
        if (existingUserByUsername.isVerified) {
            throw new ApiError(409, "User with this username already exists");
        } else {
            await destroyFromCloudinary(existingUserByUsername.avatar.public_id);
            await existingUserByUsername.deleteOne();
        }
    }

    // 4: Upload avatar to Cloudinary
    const uploadedAvatar = await uploadOnCloudinary(avatarBuffer);

    if (!uploadedAvatar) {
        throw new ApiError(500, "Failed to upload avatar to Cloudinary");
    }
    const avatar = {
        public_id: uploadedAvatar.public_id,
        url: uploadedAvatar.url,
    };

    // 5: Generate random 6-digit verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

    // 6: Create user object in database
    const newUser = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        password,
        avatar,
        verifyCode,
        verifyCodeExpiry,
    });

    if (!newUser) {
        throw new ApiError(500, "Failed to create user account");
    }

    // 7. Generate access token
    const accessToken = await generateAccessToken(newUser);

    // 8. Send verification email
    const subject = 'Your OTP Code for Email Verification'
    const emailSentStatus = await sendVerificationEmail(newUser, verifyCode, "REGISTER", subject);

    if (!emailSentStatus) {
        // Rollback: delete avatar from Cloudinary and user object from DB
        await destroyFromCloudinary(newUser.avatar.public_id);
        await newUser.deleteOne();
        throw new ApiError(500, "Failed to send verification email. Please try again later.");
    }

    // 9. Remove sensitive fields from the user object
    const createdUser = newUser.toObject();
    delete createdUser.password;
    delete createdUser.verifyCode;
    delete createdUser.verifyCodeExpiry;

    // 10. Send response
    return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(new ApiResponse(201, createdUser, `OTP has sent to ${email}. Please verify your account.`));
});

// done
const verifyEmail = asyncHandler(async (req, res) => {
    // 1. Get the userId from the token
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized access. Please login first.");
    }

    // 2. Get the verification code from the request
    const { verifyCode } = req.body;
    if (!verifyCode) {
        throw new ApiError(400, "Verification code is required");
    }

    // 3. Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 4. check if user is already verified
    if (user.isVerified) {
        throw new ApiError(409, "You are already verified");
    }

    // 5. check the verifyCodeExpiry
    if (user.verifyCodeExpiry && user.verifyCodeExpiry < Date.now()) {
        throw new ApiError(400, "Verification code has expired, please Register Again, Your Record has been deleted");
    }

    // 6. Verify the code
    if (user.verifyCode !== verifyCode) {
        throw new ApiError(400, "Verification code is invalid");
    }

    // 7. Mark the user as verified
    user.isVerified = true;
    user.verifyCode = "000000"; // Clear the verification code
    user.verifyCodeExpiry = Date.now();
    await user.save();

    const subject = `Hey ${user.fullname}, Welcome Aboard! 🥳 Your VibeSpace Account is Ready`
    await sendVerificationEmail(user, null, "WELCOME", subject);

    // 8. Remove sensitive fields from the user object
    const verifiedUser = user.toObject();
    delete verifiedUser.password;
    delete verifiedUser.verifyCode;
    delete verifiedUser.verifyCodeExpiry;

    // 9. Send response
    return res
        .status(200)
        .json(new ApiResponse(200, verifiedUser, "Email verified successfully"));
});

// done
const resendVerificationCode = asyncHandler(async (req, res) => {
    // 1. Get the userId from the token
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized access. Please login first.");
    }

    // 2. Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 3. check if user is already verified
    if (user.isVerified) {
        throw new ApiError(409, "You are already verified");
    }

    // 4: Generate random 6-digit verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

    // 5. store the new verifyCode and verifyCodeExpiry in db
    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = verifyCodeExpiry;
    const updatedUser = await user.save();

    if (!updatedUser) {
        throw new ApiError(500, "Internal Server Error! Try after sometime")
    }

    // 6. Send verification email
    const subject = 'Your New OTP for Email Verification'
    const emailSentStatus = await sendVerificationEmail(updatedUser, verifyCode, "REGISTER", subject);

    if (!emailSentStatus) {
        throw new ApiError(500, "Failed to send verification email. Please try again later.");
    }

    // 7. Remove sensitive fields from the user object
    const unVerifiedUser = updatedUser.toObject();
    delete unVerifiedUser.password;
    delete unVerifiedUser.verifyCode;
    delete unVerifiedUser.verifyCodeExpiry;

    return res
        .status(201)
        .json(new ApiResponse(201, unVerifiedUser, ` New OTP has sent to ${updatedUser.email}. Please verify your account.`));
})

// done
const loginUser = asyncHandler(async (req, res) => {
    // Step 1: Get login details -> username, email, password
    const { email, password } = req.body;
    console.log(req.body)

    // Step 2: Check validation -> need anyone field (username or email) and password
    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required");
    }

    // Step 3: Find the user
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    console.log(user)

    // Step 4: Check password
    const isPasswordCorrect = await user.verifyPassword(password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password");
    }

    // Step 5: Generate access token
    const accessToken = await generateAccessToken(user);

    // Step 6: Remove sensitive fields from the user object
    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.verifyCode;
    delete loggedInUser.verifyCodeExpiry;

    

    // Step 7: Send response with cookie
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));

});

// done
const logoutUser = asyncHandler(async (req, res) => {

    return res
        .status(200)
        .clearCookie("accessToken", deleteCookieOptions)
        .json(new ApiResponse(200, null, "User logged Out"))
})

// done
const getCurrentUser = asyncHandler(async (req, res) => {
    // Step 1: Get the user ID from the token
    const userId = req.user._id;

    // Step 2: Find the user
    const user = await User.findById(userId).select("-password -verifyCode -verifyCodeExpiry");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Step 3: Send response
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Current user fetched successfully"));

});

// done
const updateAccountDetails = asyncHandler(async (req, res) => {

    // get the detail
    const userId = req.user._id;
    const { fullname, username, bio } = req.body
    if (!fullname || !username || !bio) {
        throw new ApiError(400, "All fields are required")
    }

    // Check the new username is already taken by someone else
    const existedUserByUsername = await User.findOne({ username })
    if (existedUserByUsername && existedUserByUsername._id.toString() !== userId.toString()) {
        throw new ApiError(400, "Username is already taken  by someone else")
    }

    // update the field
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullname,
            username,
            bio
        }
    },
        {
            new: true
        }).select("-password -verifyCode -verifyCodeExpiry")

    // send response
    return res
        .status(200)
        .json(new ApiResponse(200, user, "account details updated successfully"))

})

// done
const updateUserAvatar = asyncHandler(async (req, res) => {
    // get the details and userid
    const userId = req.user?._id
    const avatarLocalPath = req.file

    // check for file 
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // upload on cloudinary
    const newAvatar = await uploadOnCloudinary(avatarLocalPath)
    if (!newAvatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
    }

    // get the old avatar 
    const userWithOldAvatar = await User.findById(userId)

    // update avatar
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                avatar: {
                    public_id: newAvatar.public_id,
                    url: newAvatar.url
                }
            }
        },
        { new: true }
    ).select("-password -verifyCode -verifyCodeExpiry")

    // delete old avatar from cloudinary
    const oldAvatarPublicId = userWithOldAvatar.avatar.public_id
    await destroyFromCloudinary(oldAvatarPublicId)

    // send response
    return res
        .status(200)
        .json(new ApiResponse(200, user, "post updated successfully"))
})

// done
const changeCurrentPassword = asyncHandler(async (req, res) => {
    // Get the user ID from the token
    const userId = req.user._id;

    // get possword - current, new and confirm
    const { currentPassword, newPassword, confirmPassword } = req.body
    if (!currentPassword || !newPassword || !confirmPassword) {
        throw new ApiError(400, "All fields are required")
    }

    if (newPassword != confirmPassword) {
        throw new ApiError(400, "New password and confirm password do not match")
    }

    // Find the user and also check user is verified or not
    const user = await User.findById(userId).select("-verifyCode -verifyCodeExpiry");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.isVerified) {
        throw new ApiError(404, "User is not verified. Please verify first");
    }

    // check current password
    const verifyPassword = await user.verifyPassword(currentPassword)
    if (!verifyPassword) {
        throw new ApiError(400, "Invalid current password")
    }

    // update password
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    // send response
    return res
        .status(200)
        .json(new ApiResponse(200, null, "password changed successfully"))

})

// done
const searchUsersByUsername = asyncHandler(async (req, res) => {
    const { username = "" } = req.query;

    let users;
    if (username && username.trim() !== "") {
        const regex = new RegExp(username.trim(), "i"); // case-insensitive startsWith
        users = await User.find(
            { username: { $regex: regex } },
            "_id username fullname avatar"
        );
    } else {
        // No username provided — return all users
        users = await User.find({}, "_id username fullname avatar");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users fetched successfully"));
});

// done
const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { username } = req.params;

    const user = await User.findOne({ username: username })
        .select("_id username fullname avatar bio");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const [postCount, followerCount, followingCount, isFollowing] = await Promise.all([
        Post.countDocuments({ owner: user._id }),
        Follow.countDocuments({ following: user._id }),
        Follow.countDocuments({ follower: user._id }),
        Follow.exists({ follower: userId, following: user._id })
    ])

    const isUserFollowing = !!isFollowing;
    const responseData = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        avatar: user.avatar,
        bio: user.bio || "",
        followerCount: followerCount,
        followingCount: followingCount,
        postCount,
        isUserFollowing,
    };

    return res.status(200).json(new ApiResponse(200, responseData, "User profile fetched successfully"));
});


// FORGOT PASSWORD: step 1
const initiateForgotPasswordReset = asyncHandler(async (req, res) => {

    // Step 1: Get email from the request body
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    // Step 2: Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User with this email does not exist.")
    }

    // Step 3: Generate verification code and expiry
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const verifyCodeExpiry = Date.now() + 20 * 60 * 1000; // Expires in 10 minutes

    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = verifyCodeExpiry;

    // Step 4: Save user with verification details
    await user.save();

    // Step 5: Send verification email
    const subject = "OTP for Forget Password"
    sendVerificationEmail(user, verifyCode, "PASSWORDRESET", subject);

    // step 6. generating token
    const resetToken = await generateResetToken(user.email);

    // Step 8: Send success response
    return res
        .status(200)
        .cookie("resetToken", resetToken, cookieOptionsForResetPassword)
        .json(new ApiResponse(200, email, "Password reset OTP has been sent to your email."));


});

// FORGOT PASSWORD: step 2
const verifyCodeAndResetPassword = asyncHandler(async (req, res) => {
    // Step 1: Validate inputs
    const { verifyCode, password } = req.body;
    const email = req.userEmail;

    if (!verifyCode || !password) {
        throw new ApiError(400, "Both verifyCode and password are required.")
    }

    // Step 2: Get email from token
    if (!email) {
        throw new ApiError(401, "Invalid session. Please try again.")
    }

    // Step 3: Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "No user found with the provided email.")
    }

    // Step 4: Match the verifyCode
    if (user.verifyCode !== verifyCode) {
        throw new ApiError(400, "Invalid verification code.")
    }

    // Step 4.1: Check expiry
    if (user.verifyCodeExpiry < Date.now()) {
        throw new ApiError(400, "Verification code has expired. Please request a new one.")
    }

    // Step 4.2: Clear verifyCode and expiry
    user.verifyCode = "000000";
    user.verifyCodeExpiry = Date.now()

    // Step 5: Update and hash password
    user.password = password;
    await user.save({ validateBeforeSave: false });

    // Step 6: Save the user
    await user.save();


    // Step 7: Clear cookies
    // Step 8: Send success response
    return res
        .status(200)
        .clearCookie("resetToken", deleteCookieOptions)
        .json(new ApiResponse(200, null, "Password has been successfully updated."));

});

export {
    registerUser,
    verifyEmail,
    resendVerificationCode,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    changeCurrentPassword,
    searchUsersByUsername,
    getUserProfile,
    initiateForgotPasswordReset,
    verifyCodeAndResetPassword,
}
