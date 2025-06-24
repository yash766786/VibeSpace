import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



// get comments of a post
const getPostComments = asyncHandler(async (req, res) => {
    // 1. Get postId from the request parameters
    // 2. Get page and limit from the request query
    // 3. Get userId from the authenticated user
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;
    const objectUserId = new mongoose.Types.ObjectId(userId);

    // 3. convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // 4. Validate the postId
    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    // 5. fetching the comments of the post along with likes on the comments
    // aggregation pipeline
    const [commentsWithLikes, totalComments] = await Promise.all([Comment.aggregate([
        // match the postId
        { $match: { post: new mongoose.Types.ObjectId(postId) } },
        // sort the latest comments first
        { $sort: { createdAt: -1 } },
        // pagination: skip and limit
        { $skip: (pageNumber - 1) * pageSize },
        { $limit: pageSize },
        // lookup the owner of the comment as ownerDetails
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        // lookup the likes on the comment as likes
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        // addfields to the comment object(likeCount, isLikedByCurrentUser, likersId)
        {
            $addFields: {
                likeCount: { $size: "$likes" },
                isLikedByCurrentUser: {
                    $in: [objectUserId, {
                        $map: {
                            input: "$likes",
                            as: "like",
                            in: "$$like.likedBy"
                        }
                    }]
                },
                likersId: "$likes.likedBy"
            }
            // lookup the likers details
        },
        {
            $lookup: {
                from: "users",
                localField: "likersId",
                foreignField: "_id",
                as: "likersDetails"
            }
        },
        // addfields to the comment object(owner)
        {
            $addFields: {
                owner: { $arrayElemAt: ["$ownerDetails", 0] }
            }
        },
        // project the required fields(owner(owner's username, fullname, _id, avatar), _id, content, createdAt, likeCount, isLikedByCurrentUser, likersDetails(username))
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                owner: {
                    _id: "$owner._id",
                    username: "$owner.username",
                    fullname: "$owner.fullname",
                    avatar: "$owner.avatar",
                }, // Get single owner object
                likeCount: 1,
                isLikedByCurrentUser: 1,
                // likersDetails : "$likersDetails.username" // Get likers' usernames
            }
        }
    ]),
    Comment.countDocuments({ post: postId })

    ])

    // 6. count the total comments for pagination and total pages
    const totalPages = Math.ceil(totalComments / pageSize);

    // 7. return the comments in the response
    return res.status(200).json(new ApiResponse(200, {
        comments: commentsWithLikes,
        totalPages: totalPages,
        currentPage: pageNumber,
    }, "Comments fetched successfully"));
})


// add comment on a post
const addComment = asyncHandler(async (req, res) => {
    // 1. Get the postId from the request parameters
    // 2. Get the userId from the authenticated user
    // 3. get the content from the request body
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    // 4. validate the postId
    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    // 5. validate the content
    if (!content || !content.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    // 6. create a new comment
    const comment = await Comment.create({
        content: content.trim(),
        post: postId,
        owner: userId
    });

    // 7. return the comment
    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"));
})


// delete comment from the post
const deleteComment = asyncHandler(async (req, res) => {
    // 1. Get the commentId from the request parameters
    // 2. Get the userId from the authenticated user
    const { commentId } = req.params;
    const userId = req.user._id;

    // 3. validate the commentId
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // 4. delete the comment
    const deletedComment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: userId, // Ensure the comment belongs to the logged-in user
    });

    // 5. check if the comment was deleted
    if (!deletedComment) {
        throw new ApiError(404, "Comment not found");
    }

    // 6. delete all likes on the comment
    await Like.deleteMany({
        comment: commentId,
    });

    // 7. return success message
    return res
        .status(200)
        .json(new ApiResponse(200, deletedComment, "Comment deleted successfully"));
})

export {
    getPostComments,
    addComment,
    deleteComment
};
