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
import mongoose, { isValidObjectId, Mongoose } from "mongoose";

// Todo
// const getAllPosts = asyncHandler(async (req, res) => {
//     const { page = 1, limit = 4, query = "", sortBy = "createdAt", sortType = "desc" } = req.query;
//     const userId = req.user?._id
//     console.log(req.query)
//     console.log("....")

//     // Convert pagination params to integers
//     const pageNumber = parseInt(page, 10);
//     const pageSize = parseInt(limit, 10);

//     try {
//         // Query posts with pagination and sorting
//         const posts = await Post.aggregate([
//             // { 
//             //     $match: filter 
//             // },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "owner",
//                     foreignField: "_id",
//                     as: "ownerDetails"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "comments",
//                     localField: "_id",
//                     foreignField: "post",
//                     as: "comments"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "likes",
//                     localField: "_id",
//                     foreignField: "post",
//                     as: "likes"
//                 }
//             },
//             {
//                 $addFields: {
//                     ownerDetails: { $arrayElemAt: ["$ownerDetails", 0] },
//                     commentCount: { $size: "$comments" },
//                     likeCount: { $size: "$likes" },
//                     isLikedByCurrentUser: {
//                         $cond: {
//                             if: { $in: [new mongoose.Types.ObjectId(userId), "$likes.likedBy"] },
//                             then: true,
//                             else: false
//                         }
//                     }
//                 }
//             },
//             {
//                 $sort: { [sortBy]: sortType === "desc" ? -1 : 1 }
//             },
//             {
//                 $skip: (pageNumber - 1) * pageSize
//             },
//             {
//                 $limit: pageSize
//             },
//             {
//                 $project: {
//                     description: 1,
//                     postFile: 1,
//                     // owner: "$ownerDetails.username",
//                     owner: {
//                         username : "$ownerDetails.username",
//                         fullname : "$ownerDetails.fullname",
//                         avatar: "$ownerDetails.avatar"
//                     },
//                     commentCount: 1,
//                     likeCount: 1,
//                     isLikedByCurrentUser: 1,
//                     createdAt: 1,
//                     updatedAt: 1
//                 }
//             }
//         ]);
//         console.log(posts)
//         // Get the total number of posts matching the filter
//         const totalPosts = await Post.countDocuments();

//         return res
//             .status(200)
//             .json(new ApiResponse(200, {
//                 posts,
//                 totalPages: Math.ceil(totalPosts / pageSize),
//                 currentPage: pageNumber
//             },      
//             "Posts fetched successfully"));
//     } 
//     catch(error){
//         console.log(error);
//         return res
//             .status(500)
//             .json(new ApiError(500, "Something went wrong while fetching posts", error));
//     }
// });

// done
const getAllPosts = asyncHandler(async (req, res) => {
    // 1. Get the userId from the authenticated user
    // 2. Get page and limit from the request query
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

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
                            in: { $eq: ["$$like.likedBy", userId] }
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
    const {targetUserId} = req.params

    console.log("targetUserId..", targetUserId)

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
                            in: { $eq: ["$$like.likedBy", userId] }
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



// not in use currently
const getPostById = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    // Validate the postId
    if (!mongoose.isValidObjectId(postId)) {
        return res
            .status(400)
            .json(new ApiError(400, "Invalid post ID"));
    }

    try {
        // Aggregation to get post details along with comments, likes, and owner information
        const postDetails = await Post.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(postId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails",
                },
            },
            {
                $unwind: {
                    path: "$ownerDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post",
                    as: "comments",
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "post",
                    as: "likes",
                },
            },
            {
                $addFields: {
                    likeCount: {
                        $size: "$likes",
                    },
                    commentCount: {
                        $size: "$comments",
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "comments.owner", // Fetching usernames and avatars of users who commented
                    foreignField: "_id",
                    as: "commenterDetails",
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "comments._id", // Fetching likes for each comment
                    foreignField: "comment",
                    as: "commentLikes",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "likes.likedBy", // Fetching usernames of users who liked
                    foreignField: "_id",
                    as: "likerDetails",
                },
            },
            {
                $addFields: {
                    comments: {
                        $map: {
                            input: "$comments",
                            as: "comment",
                            in: {
                                content: "$$comment.content",
                                likeCount: {
                                    $size: {
                                        $filter: {
                                            input: "$commentLikes",
                                            as: "like",
                                            cond: {
                                                $eq: ["$$like.comment", "$$comment._id"],
                                            },
                                        },
                                    },
                                },
                                commenter: {
                                    $arrayElemAt: [
                                        {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: "$commenterDetails",
                                                        as: "user",
                                                        cond: {
                                                            $eq: ["$$user._id", "$$comment.owner"],
                                                        },
                                                    },
                                                },
                                                as: "filteredUser",
                                                in: {
                                                    username: "$$filteredUser.username",
                                                    avatar: "$$filteredUser.avatar",
                                                },
                                            },
                                        },
                                        0,
                                    ],
                                },
                            },
                        },
                    },
                    likers: {
                        $map: {
                            input: "$likerDetails",
                            as: "liker",
                            // in: "$$liker.username",
                            in: {
                                username: "$$liker.username",
                                fullname: "$$liker.fullname",
                                avatar: "$$liker.avatar",
                            }
                        },
                    },
                },
            },
            {
                $project: {
                    postFile: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "ownerDetails.username": 1,
                    "ownerDetails.avatar": 1,
                    comments: 1,
                    likeCount: 1,
                    commentCount: 1,
                    likers: 1,
                },
            },
        ]);

        // Check if the post exists
        if (!postDetails || postDetails.length === 0) {
            return res
                .status(404)
                .json(new ApiError(404, "Post not found"));
        }

        // Return the post details with comments, likes, and user details
        return res
            .status(200)
            .json(new ApiResponse(200, postDetails[0], "Post details fetched successfully"));
    } catch (error) {
        // Handle any other errors
        console.error(error);
        return res
            .status(500)
            .json(new ApiError(500, "Something went wrong while fetching post details", error));
    }
});






const publishPost = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const postLocalFilePath = req.file?.path;

    console.log("Step 1: Received request to publish post");
    console.log("Step 2: Extracted description:", description);
    console.log("Step 3: Extracted post file path:", postLocalFilePath);

    if (!postLocalFilePath) {
        console.error("Step 4: Validation failed - Post file is missing");
        return res.status(400).json(new ApiError(400, "Post file must be required"));
    }

    if (req.customConnectionClosed) {
        console.warn("Step 5: Connection closed prematurely, aborting upload...");
        return;
    }

    try {
        console.log("Step 6: Uploading post to Cloudinary...");
        const postFile = await uploadOnCloudinary(postLocalFilePath);
        console.log("Step 7: Uploaded file details:", postFile);

        if (req.customConnectionClosed) {
            const publicIdOfPost = postFile.url.split("/").pop().split(".")[0];
            console.warn("Step 8: Connection closed, cleaning up uploaded file...");
            await destroyFromCloudinary(publicIdOfPost);
            return;
        }

        if (!postFile) {
            console.error("Step 9: Cloudinary upload failed");
            return res.status(500).json(new ApiError(500, "Error while uploading post file"));
        }

        console.log("Step 10: Creating post document in database...");
        const post = await Post.create({
            postFile: postFile.url,
            description: description || "",
            owner: req.user?._id,
        });
        console.log("Step 11: Created post document:", post);

        if (!post) {
            console.error("Step 12: Post creation failed in database");
            return res.status(500).json(new ApiError(500, "Error while publishing post file"));
        }

        console.log("Step 13: Successfully published post");
        return res.status(200).json(new ApiResponse(200, post, "Post published successfully"));
    } catch (error) {
        console.error("Error in publishPost:", error);
        return res.status(500).json(new ApiError(500, "Something went wrong while publishing post", error));
    }
});


const updatePost = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const { postId } = req.params;

    console.log("Step 1: Received request to update post");
    console.log("Step 2: Post ID:", postId);
    console.log("Step 3: New description:", description);

    try {
        if (!isValidObjectId(postId)) {
            console.error("Step 4: Validation failed - Invalid Post ID");
            return res.status(400).json(new ApiError(400, "Invalid post ID"));
        }

        console.log("Step 5: Updating post in database...");
        const post = await Post.findByIdAndUpdate(postId, { description: description || "" }, { new: true });
        console.log("Step 6: Updated post details:", post);

        if (!post) {
            console.error("Step 7: Post not found or failed to update");
            return res.status(500).json(new ApiError(500, "Error while updating post"));
        }

        console.log("Step 8: Successfully updated post");
        return res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
    } catch (error) {
        console.error("Error in updatePost:", error);
        return res.status(500).json(new ApiError(500, "Something went wrong while updating post", error));
    }
});


const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    console.log("Step 1: Received request to delete post");
    console.log("Step 2: Post ID:", postId);

    try {
        if (!isValidObjectId(postId)) {
            console.error("Step 3: Validation failed - Invalid Post ID");
            return res.status(400).json(new ApiError(400, "Invalid post ID"));
        }

        console.log("Step 4: Deleting post document from database...");
        const post = await Post.findByIdAndDelete(postId);
        console.log("Step 5: Deleted post details:", post);

        if (!post) {
            console.error("Step 6: Post not found");
            return res.status(404).json(new ApiError(404, "Post not found"));
        }

        const publicIdOfPost = post.postFile.split("/").pop().split(".")[0];
        console.log("Step 7: Public ID of Cloudinary file:", publicIdOfPost);

        console.log("Step 8: Deleting file from Cloudinary...");
        await destroyFromCloudinary(publicIdOfPost);

        console.log("Step 9: Deleting likes associated with the post...");
        const deletedLikes = await Like.deleteMany({ post: post._id });

        console.log("Step 10: Fetching comments associated with the post...");
        const comments = await Comment.find({ post: post._id });
        console.log("Step 11: Associated comments:", comments);

        const commentIds = comments.map((comment) => comment._id);

        console.log("Step 12: Deleting likes on comments...");
        const deletedCommentLikes = await Like.deleteMany({ comment: { $in: commentIds } });

        console.log("Step 13: Deleting comments...");
        const deletedComments = await Comment.deleteMany({ post: post._id });

        console.log("Step 14: Successfully deleted post and associated data", {deletedLikes, deletedComments, deletedCommentLikes});
        return res.status(200).json(
            new ApiResponse(200, { post, deletedLikes, comments, deletedCommentLikes, deletedComments }, "Post deleted successfully")
        );
    } catch (error) {
        console.error("Error in deletePost:", error);
        return res.status(500).json(new ApiError(500, "Something went wrong while deleting post", error));
    }
});

export {
    getAllPosts,
    getPostById,
    publishPost,
    updatePost,
    deletePost,
    getPostsOfUser
}