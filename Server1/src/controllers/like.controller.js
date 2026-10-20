import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";


// fetch Post likes
const getPostLikes = asyncHandler(async (req, res) => {
    // 1. Get the postId from the request parameters
    // 2. Get page and limit from the request query
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user?._id

    // 3. convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // 4. Validate the postId
    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    // 5. Fetch the likes for the post and populate the likedBy field and paginate the results
    const [likes, totalLikes] = await Promise.all([
        Like.find({ post: postId })
            .populate("likedBy", "_id username fullname avatar")
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize),
        Like.countDocuments({ post: postId })
    ])

    const isLikedByUser = likes.some(like => like.likedBy._id === userId);

    const totalPages = Math.ceil(totalLikes / pageSize);
    const currentPage = pageNumber;

    // 6. Return the likes in the response
    return res
        .status(200)
        .json(new ApiResponse(200, { likes, totalPages, currentPage, isLikedByUser }, "Likes fetched successfully"));

})


// togglePostLike
const togglePostLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  // 🔥 Ensure post exists (also needed for tags)
  const post = await Post.findById(postId).select("tags likesCount");
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // 🔍 Check if already liked
  const existingLike = await Like.findOne({
    post: postId,
    user: userId
  });

  // ❌ UNLIKE
  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });

    await Post.findByIdAndUpdate(postId, {
      $inc: { likesCount: -1 }
    });

    return res.status(200).json(
      new ApiResponse(200, {}, "Post unliked successfully")
    );
  }

  // ✅ LIKE
  try {
    const like = await Like.create({
      post: postId,
      user: userId
    });

    await Post.findByIdAndUpdate(postId, {
      $inc: { likesCount: 1 }
    });

    // 🔥 Update user interests (important for recommendation)
    if (post.tags?.length) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { interests: { $each: post.tags } }
      });
    }

    return res.status(201).json(
      new ApiResponse(201, like, "Post liked successfully")
    );

  } catch (err) {
    // ⚠️ Handle duplicate like edge case (unique index)
    if (err.code === 11000) {
      return res.status(200).json(
        new ApiResponse(200, {}, "Already liked")
      );
    }
    throw err;
  }
});


// toggleCommentLike
const toggleCommentLike = asyncHandler(async (req, res) => {
    // 1. Get the commentId from the request parameters
    // 2. Get the userId from the authenticated user
    const { commentId } = req.params;
    const userId = req.user._id;

    // 3. Validate the commentId
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // 4. Find the like by commentId and userId
    const isLiked = await Like.findOne({
        comment: commentId,
        likedBy: userId
    });

    // 5. If the like exists, delete it and return success message
    if (isLiked) {
        const unlike = await Like.findByIdAndDelete(isLiked._id);
        return res
            .status(200)
            .json(new ApiResponse(200, unlike, "Comment unliked successfully"));
    }
    // 6. If the like does not exist, create a new like and return success message
    else {
        const like = await Like.create({
            comment: commentId,
            likedBy: userId
        });
        return res
            .status(201)
            .json(new ApiResponse(201, like, "Comment liked successfully"));
    }
});

export {
    getPostLikes,
    togglePostLike,
    toggleCommentLike
};
