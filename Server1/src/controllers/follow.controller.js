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
    if(!isValidObjectId(targetUserId)){
        throw new ApiError(400, "Invalid user ID");
    }
    
    // 4. check if currentUserId is trying to follow/unfollow themselves
    if(targetUserId === userId){
        throw new ApiError(400, "You cannot follow/unfollow yourself");
    }
    
    // 5. Find the Follow document by follower and following
    const existingFollow = await Follow.findOne({
        follower: userId,
        following: targetUserId,
    });
    
    // 6. If it exists, delete it (unfollow)
    // 7. If it doesn't exist, create a new Follow document (follow)
    if(existingFollow){
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


// getFollowers List
const getFollowers = asyncHandler(async (req, res) => {
    // 1. Get the targetUserId of the user whose followers you want to fetch
    const { targetUserId } = req.params;
    
    // 2. validate the targetUserId
    if(!isValidObjectId(targetUserId)){
        throw new ApiError(400, "Invalid user ID");
    }

    // 3. get the followers of the targetUser and populate the follower details
    const followers = await Follow.find({ following: targetUserId })
    .populate("follower", "_id username fullname avatar")
    .sort({ createdAt: -1 });
    
    // 4. return the followers list
    return res
        .status(200)
        .json(new ApiResponse(200, followers, "Followers fetched successfully"));

})


// getFollowings List
const getFollowings = asyncHandler(async (req, res) => {
    // 1. Get the targetUserId of the user whose followers you want to fetch
    const { targetUserId } = req.params;

    // 2. validate the targetUserId
    if(!isValidObjectId(targetUserId)){
        throw new ApiError(400, "Invalid user ID");
    }
    
    // 3. get the followers of the targetUser and populate the follower details
    const followings = await Follow.find({ follower: targetUserId })
    .populate("following", "_id username fullname avatar")
    .sort({ createdAt: -1 });
    
    // 4. return the followers list
    return res
        .status(200)
        .json(new ApiResponse(200, followings, "Followings fetched successfully"));
})

export {
    toggleFollowUser,
    getFollowers,
    getFollowings
}