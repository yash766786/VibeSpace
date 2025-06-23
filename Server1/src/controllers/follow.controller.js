import { isValidObjectId } from "mongoose"
import { Follow } from "../models/follow.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// Toggle follow/unfollow a user
const toggleFollowUser = asyncHandler(async (req, res) => {
    // 1. Get the targetUserId of the user to be followed/unfollowed
    // 2. Get the userId of the logged-in user
    const { targetUserId } = req.params;
    const userId = req.user._id;

    // 3. if the userId is not valid, return an error
    if (!isValidObjectId(targetUserId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    // 4. check if currentUserId is trying to follow/unfollow themselves
    if (targetUserId === userId) {
        throw new ApiError(400, "You cannot follow/unfollow yourself");
    }

    // 5. Find the Follow document by follower and following
    const existingFollow = await Follow.findOne({
        follower: userId,
        following: targetUserId,
    });

    // 6. If it exists, delete it (unfollow)
    // 7. If it doesn't exist, create a new Follow document (follow)
    if (existingFollow) {
        const follow = await Follow.findByIdAndDelete(existingFollow._id)
        return res
            .status(200)
            .json(new ApiResponse(200, follow, `You have unfollowed ${targetUserId}`));
    }
    else {
        const follow = await Follow.create({
            follower: userId,
            following: targetUserId,
        });
        return res
            .status(200)
            .json(new ApiResponse(200, follow, `You are now following ${targetUserId}`));
    }

})


const getFollowers = asyncHandler(async (req, res) => {
    const { targetUserId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(targetUserId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize

    // Paginated followers and Total followers count
    const [followers, totalFollowers] = await Promise.all([
        Follow.find({ following: targetUserId })
        .select("follower")
            .populate("follower", "_id username fullname avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize),
        Follow.countDocuments({ following: targetUserId })
    ])
    const transformedFollowers = followers.map((follow) => {
        return follow.follower
    })

    const totalPages = Math.ceil(totalFollowers / pageSize);
    const currentPage = pageNumber;

    return res
        .status(200)
        .json(new ApiResponse(200, { transformedFollowers, totalPages, currentPage }, "Followers fetched successfully"));
});


const getFollowings = asyncHandler(async (req, res) => {
    const { targetUserId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(targetUserId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize

    // Paginated followings and Total followings count
    const [followings, totalFollowings] = await Promise.all([
        Follow.find({ follower: targetUserId })
            .select("following")
            .populate("following", "_id username fullname avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize),
        Follow.countDocuments({ following: targetUserId })
    ])
    const transformedFollowings = followings.map((follow) => {
        return follow.following
    })

    const totalPages = Math.ceil(totalFollowings / pageSize);
    const currentPage = pageNumber;

    return res
        .status(200)
        .json(new ApiResponse(200, { transformedFollowings, totalPages, currentPage }, "Followers fetched successfully"));
});


export {
    toggleFollowUser,
    getFollowers,
    getFollowings
}