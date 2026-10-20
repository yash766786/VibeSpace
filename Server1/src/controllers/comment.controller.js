import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js";



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
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  if (!content || !content.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  // 🔥 ensure post exists
  const postExists = await Post.exists({ _id: postId });
  if (!postExists) {
    throw new ApiError(404, "Post not found");
  }

  const comment = await Comment.create({
    content: content.trim(),
    post: postId,
    owner: userId
  });

  await Post.findByIdAndUpdate(postId, {
    $inc: { commentsCount: 1 }
  });

  return res.status(201).json(
    new ApiResponse(201, comment, "Comment added successfully")
  );
});


// delete comment from the post
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  // 🔥 find first (we need postId)
  const comment = await Comment.findOne({
    _id: commentId,
    owner: userId
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const postId = comment.post;

  // delete comment
  await Comment.deleteOne({ _id: commentId });

  // delete likes on that comment
  await Like.deleteMany({ comment: commentId });

  // 🔥 decrement safely
  await Post.findByIdAndUpdate(postId, {
    $inc: { commentsCount: -1 }
  });

  return res.status(200).json(
    new ApiResponse(200, {}, "Comment deleted successfully")
  );
});

export {
    getPostComments,
    addComment,
    deleteComment
};
