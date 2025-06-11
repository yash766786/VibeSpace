// controllers/user.controller.js
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Follow } from "../models/follow.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendVerificationEmail } from "../helper/mailer.js";
import { cookieOptions, deleteCookieOptions } from "../constant/constant.js";
import { destroyFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateAccessToken, generateResetToken } from "../utils/tokenGenerator.js";


// done
const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user data from request body
    const { username, email, fullname, password } = req.body;
    const avatarLocalPath = req.file?.path;

    // 2. Validate required fields and avatar
    if ([username, email, fullname, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (!avatarLocalPath) {
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
            await destroyFromCloudinary(existingUserByEmail.avatar.url.split("/").pop().split(".")[0]);
            await existingUserByEmail.deleteOne();
        }
    }

    if (existingUserByUsername && existingUserByUsername.email !== email) {
        if (existingUserByUsername.isVerified) {
            throw new ApiError(409, "User with this username already exists");
        } else {
            await destroyFromCloudinary(existingUserByUsername.avatar.url.split("/").pop().split(".")[0]);
            await existingUserByUsername.deleteOne();
        }
    }

    // 4: Upload avatar to Cloudinary
    const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);
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
    console.log("Email sent status:", emailSentStatus);

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
    console.log("Email sent status:", emailSentStatus);

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

    // Step 2: Check validation -> need anyone field (username or email) and password
    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required");
    }

    // Step 3: Find the user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

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
    const avatarLocalPath = req.file?.path

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
    console.log(username)

    const user = await User.findOne({username:username})
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
    try {
        // Step 1: Get email from the request body
        const { email } = req.body;
        console.log("Step 1: Received email for password reset:", email);

        if (!email) {
            console.log("Step 1: Validation failed - email is required.");
            return res
                .status(400)
                .json(new ApiError(400, "Email is required."));
        }

        // Step 2: Find user by email
        const user = await User.findOne({ email });
        console.log("Step 2: User fetched from database:", user ? user.email : "User not found");

        if (!user) {
            console.log("Step 2: No user found for the provided email.");
            return res
                .status(404)
                .json(new ApiError(404, "User with this email does not exist."));
        }

        // Step 3: Generate verification code and expiry
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const verifyCodeExpiry = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes
        console.log("Step 3: Generated verification code and expiry:", { verifyCode, verifyCodeExpiry });

        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = verifyCodeExpiry;

        // Step 4: Save user with verification details
        await user.save();
        console.log("Step 4: User with updated verification details saved to database.");

        // Step 5: Send verification email
        sendVerificationEmail(user, verifyCode, "PASSWORDRESET");
        console.log("Step 5: Verification email sent successfully to:", user.email);

        // step 6. generating token
        const resetToken = await generateResetToken(user.email);
        console.log("Step 6: Reset token generated", resetToken);

        // Step 7: Set cookies
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None", // For cross-site cookies
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        };
        console.log("Step 7: Cookie options set", cookieOptions);

        // Step 8: Send success response
        console.log("Step 8: Sending success response.");
        return res
            .status(200)
            .cookie("resetToken", resetToken, cookieOptions)
            .json(new ApiResponse(200, email, "Password reset OTP has been sent to your email.")
            );

    } catch (error) {
        console.log("An error occurred during the password reset process:", error);
        return res.status(500).json(
            new ApiError(500, "An unexpected error occurred. Please try again later.", error)
        );
    }
});

// FORGOT PASSWORD: step 2
const verifyCodeAndResetPassword = asyncHandler(async (req, res) => {
    try {
        // Step 1: Validate inputs
        console.log("Step 1: Validating inputs...");
        const { verifyCode, password } = req.body;
        if (!verifyCode || !password) {
            console.log("Step 1: Validation failed - Missing verifyCode or password.");
            return res
                .status(400)
                .json(new ApiError(400, "Both verifyCode and password are required."));
        }
        console.log("Step 1: Inputs validated.", { verifyCode, password });

        // Step 2: Get email from token
        console.log("Step 2: Getting email from token...");
        const email = req.userEmail;
        if (!email) {
            console.log("Step 2: Failed - No email found in token.");
            return res
                .status(401)
                .json(new ApiError(401, "Invalid session. Please try again."));
        }
        console.log("Step 2: Email extracted from token:", email);

        // Step 3: Find user by email
        console.log("Step 3: Finding user by email...");
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Step 3: Failed - No user found for email:", email);
            return res
                .status(404)
                .json(new ApiError(404, "No user found with the provided email."));
        }
        console.log("Step 3: User found:", user.email);

        // Step 4: Match the verifyCode
        console.log("Step 4: Verifying the code...");
        if (user.verifyCode !== verifyCode) {
            console.log("Step 4: Failed - Verification code does not match.");
            return res
                .status(400)
                .json(new ApiError(400, "Invalid verification code."));
        }

        // Step 4.1: Check expiry
        console.log("Step 4.1: Checking verification code expiry...");
        if (user.verifyCodeExpiry < Date.now()) {
            console.log("Step 4.1: Failed - Verification code has expired.");
            return res
                .status(400)
                .json(new ApiError(400, "Verification code has expired. Please request a new one."));
        }
        console.log("Step 4: Verification code is valid.");

        // Step 4.2: Clear verifyCode and expiry
        console.log("Step 4.2: Clearing verification code and expiry...");
        user.verifyCode = null;
        user.verifyCodeExpiry = null;

        // Step 5: Update and hash password
        console.log("Step 5: Hashing and updating the password...");
        user.password = password;
        await user.save({ validateBeforeSave: false });
        console.log("Step 5: Password updated.");

        // Step 6: Save the user
        console.log("Step 6: Saving user data...");
        await user.save();
        console.log("Step 6: User saved successfully.");

        // Step 7: Clear cookies
        console.log("Step 7: Clearing reset token cookie...");
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None", // Required for cross-site cookies
            maxAge: 0, // optional
        };
        console.log("Step 7: Reset token cookie cleared.");

        // Step 8: Send success response
        console.log("Step 8: Sending success response.");
        return res
            .status(200)
            .clearCookie("resetToken", options)
            .json(new ApiResponse(200, null, "Password has been successfully updated."));
    } catch (error) {
        console.error("Error during password reset process:", error);
        return res
            .status(500)
            .json(new ApiError(500, "An unexpected error occurred. Please try again.", error));
    }
});

const getEmailForResetPassword = asyncHandler(async (req, res) => {
    try {
        // Step 1: Get email from token
        console.log("Step 1: Getting email from token...");
        const email = req.userEmail;
        if (!email) {
            console.log("Step 1: Failed - No email found in token.");
            return res
                .status(401)
                .json(new ApiError(401, "Invalid session. Please try again."));
        }
        console.log("Step 1: Email extracted from token:", email);

        // step 2: send response
        return res
            .status(200)
            .json(new ApiResponse(200, email, "")
            );
    } catch (error) {
        console.log("An error occurred during the password reset process:", error);
        return res
            .status(500)
            .json(new ApiError(500, "An unexpected error occurred. Please try again later.", error));
    }
})

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
    getEmailForResetPassword
}
