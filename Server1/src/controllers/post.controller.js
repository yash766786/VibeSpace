import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import {
    uploadOnCloudinary,
    destroyFromCloudinary
} from "../utils/cloudinary.js";
import mongoose, { isValidObjectId } from "mongoose";


// done
const getAllPosts = asyncHandler(async (req, res) => {
    // 1. Get the userId from the authenticated user
    // 2. Get page and limit from the request query
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const objectUserId = new mongoose.Types.ObjectId(userId);


    // 3. convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // 4. fetch post with pagination and count comments on the post and count the likes and add isLikedByCurrentUser field
    const posts = await Post.aggregate([
        { $sort: { createdAt: -1 } }, // Sort by latest posts first
        { $skip: (pageNumber - 1) * pageSize }, // Pagination: Skip previous pages
        { $limit: pageSize }, // Pagination: Limit to page size
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "likes"
            }
        },
        {
            $addFields: {
                commentCount: { $size: "$comments" },
                likeCount: { $size: "$likes" },
                isLikedByCurrentUser: {
                    $anyElementTrue: {
                        $map: {
                            input: "$likes",
                            as: "like",
                            in: { $eq: ["$$like.likedBy", objectUserId] }
                        }
                    }
                }
            }
        },
        {
            $project: {
                postId: "$_id",
                description: 1,
                postFile: {
                    public_id: "$postFile.public_id",
                    url: "$postFile.url",
                },
                owner: {
                    _id: { $arrayElemAt: ["$ownerDetails._id", 0] },
                    username: { $arrayElemAt: ["$ownerDetails.username", 0] },
                    fullname: { $arrayElemAt: ["$ownerDetails.fullname", 0] },
                    avatar: { $arrayElemAt: ["$ownerDetails.avatar", 0] }
                },
                commentCount: 1,
                likeCount: 1,
                isLikedByCurrentUser: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);

    // 5. total number of posts, current page number, total number of pages
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / pageSize);
    const currentPage = pageNumber;

    // 6. return the posts in the response
    return res.status(200).json(new ApiResponse(200, {
        posts,
        totalPosts,
        totalPages,
        currentPage
    }, "Posts fetched successfully"));

})

// done
const getPostsOfUser = asyncHandler(async (req, res) => {
    // 1. Get the userId from the authenticated user
    // 2. Get page and limit from the request query
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const { targetUserId } = req.params
    const objectUserId = new mongoose.Types.ObjectId(userId);

    // 3. convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // 4. fetch post with pagination and count comments on the post and count the likes and add isLikedByCurrentUser field
    const posts = await Post.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(targetUserId) } },
        { $sort: { createdAt: -1 } }, // Sort by latest posts first
        { $skip: (pageNumber - 1) * pageSize }, // Pagination: Skip previous pages
        { $limit: pageSize }, // Pagination: Limit to page size
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "likes"
            }
        },
        {
            $addFields: {
                commentCount: { $size: "$comments" },
                likeCount: { $size: "$likes" },
                isLikedByCurrentUser: {
                    $anyElementTrue: {
                        $map: {
                            input: "$likes",
                            as: "like",
                            in: { $eq: ["$$like.likedBy", objectUserId] }
                        }
                    }
                }
            }
        },
        {
            $project: {
                postId: "$_id",
                description: 1,
                postFile: {
                    public_id: "$postFile.public_id",
                    url: "$postFile.url",
                },
                owner: {
                    _id: { $arrayElemAt: ["$ownerDetails._id", 0] },
                    username: { $arrayElemAt: ["$ownerDetails.username", 0] },
                    fullname: { $arrayElemAt: ["$ownerDetails.fullname", 0] },
                    avatar: { $arrayElemAt: ["$ownerDetails.avatar", 0] }
                },
                commentCount: 1,
                likeCount: 1,
                isLikedByCurrentUser: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);

    // 5. total number of posts, current page number, total number of pages
    const totalPosts = await Post.countDocuments({ owner: targetUserId });

    const totalPages = Math.ceil(totalPosts / pageSize);
    const currentPage = pageNumber;

    // 6. return the posts in the response
    return res.status(200).json(new ApiResponse(200, {
        posts,
        totalPosts,
        totalPages,
        currentPage
    }, "Posts fetched successfully"));

})


const uploadPost = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const postLocalFilePath = req.file;

    if (!postLocalFilePath) {
        throw new ApiError(400, "Post file must be required")
    }

    const postFile = await uploadOnCloudinary(postLocalFilePath);
    if (!postFile) {
        throw new ApiError(500, "Error while uploading post file")
    }

    const post = await Post.create({
        postFile: {
            url: postFile.url,
            public_id: postFile.public_id
        },
        description: description || "",
        owner: req.user?._id,
    });

    if (!post) {
        throw new ApiError(500, "Error while publishing post file")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, post, "Post published successfully"));

});


const updatePost = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const { postId } = req.params;

    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    const post = await Post.findByIdAndUpdate(postId, { description: description || "" }, { new: true });

    if (!post) {
        throw new ApiError(500, "Error while updating post")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, post, "Post updated successfully"));

});


const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (!post.owner.equals(userId)) {
        throw new ApiError(400, "You are not allowed to delete this post");
    }

    const [deletedPostRes, commentsRes, deletedCloudinaryRes] = await Promise.allSettled([
        post.deleteOne(),
        Comment.find({ post: postId }),
        destroyFromCloudinary(post.postFile.public_id)
    ]);

    const comments = commentsRes.status === "fulfilled" ? commentsRes.value : [];
    const commentIds = comments.map((comment) => comment._id);

    const [likesRes, commentsDelRes, commentLikesRes] = await Promise.allSettled([
        Like.deleteMany({ post: post._id }),
        Comment.deleteMany({ post: post._id }),
        Like.deleteMany({ comment: { $in: commentIds } })
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Post deleted successfully"));
});


export {
    getAllPosts,
    uploadPost,
    updatePost,
    deletePost,
    getPostsOfUser
}