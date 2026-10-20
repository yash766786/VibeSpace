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
import { Follow } from "../models/follow.model.js";


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
    const { description = "" } = req.body;
    const postLocalFilePath = req.file;

    if (!postLocalFilePath) {
        throw new ApiError(400, "Post file is required");
    }

    // 🔥 Upload to cloudinary
    const postFile = await uploadOnCloudinary(postLocalFilePath);
    if (!postFile) {
        throw new ApiError(500, "Error while uploading post file");
    }

    // 🔥 Extract tags (#tag)
    const tags =
        description.match(/#\w+/g)?.map(tag =>
            tag.slice(1).toLowerCase()
        ) || [];

    // 🔥 Extract mentions (@username)
    const mentionUsernames =
        description.match(/@\w+/g)?.map(u =>
            u.slice(1).toLowerCase()
        ) || [];

    // 🔥 Remove duplicates
    const uniqueUsernames = [...new Set(mentionUsernames)];

    // 🔥 Convert usernames → userIds
    let mentionIds = [];

    if (uniqueUsernames.length > 0) {
        const users = await User.find({
            username: { $in: uniqueUsernames }
        }).select("_id");

        mentionIds = users.map(u => u._id);
    }

    // 🔥 Create post
    const post = await Post.create({
        postFile: {
            url: postFile.url,
            public_id: postFile.public_id
        },
        description,
        owner: req.user?._id,
        tags,
        mentions: mentionIds
    });

    if (!post) {
        throw new ApiError(500, "Error while publishing post");
    }

    return res.status(201).json(
        new ApiResponse(201, post, "Post published successfully")
    );
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


const getRecommendedFeed = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 🔥 get full user (IMPORTANT FIX)
  const user = await User.findById(userId).select("interests");

  const { cursor, limit = 10, exclude } = req.query;

  const pageSize = Math.min(parseInt(limit, 10) || 10, 20);
  const objectUserId = new mongoose.Types.ObjectId(userId);

  // 🔹 STEP 1: Parse exclude (max 50)
  let excludeIds = [];
  if (exclude) {
    excludeIds = exclude
      .split(",")
      .slice(-50)
      .map((id) => new mongoose.Types.ObjectId(id));
  }

  // 🔹 STEP 2: Following list
  const followingDocs = await Follow.find({ follower: userId }).select("following");
  const followingIds = followingDocs.map((f) => f.following.toString());
  const followingObjectIds = followingDocs.map((f) => f.following);

  // 🔹 STEP 3: Base match (NO over-filtering)
  const baseMatch = {
    isDeleted: false,
  };

  if (excludeIds.length > 0) {
    baseMatch._id = { $nin: excludeIds };
  }

  if (cursor) {
    baseMatch.createdAt = { $lt: new Date(cursor) };
  }

  // 🔥 STEP 4: FETCH CANDIDATES (SORT ONLY BY createdAt)
  const candidates = await Post.aggregate([
    { $match: baseMatch },

    // 🔥 IMPORTANT: pagination-safe sort
    { $sort: { createdAt: -1 } },

    { $limit: 500 }, // large pool

    // 🔹 owner details
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },

    // 🔹 liked by current user
    {
      $lookup: {
        from: "likes",
        let: { postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$post", "$$postId"] },
                  { $eq: ["$likedBy", objectUserId] },
                ],
              },
            },
          },
        ],
        as: "likedByMe",
      },
    },

    {
      $addFields: {
        isLikedByCurrentUser: { $gt: [{ $size: "$likedByMe" }, 0] },
        ownerDetails: { $arrayElemAt: ["$ownerDetails", 0] },
      },
    },

    {
      $project: {
        description: 1,
        postFile: 1,
        tags: 1,
        likesCount: 1,
        commentsCount: 1,
        createdAt: 1,
        owner: {
          _id: "$ownerDetails._id",
          username: "$ownerDetails.username",
          fullname: "$ownerDetails.fullname",
          avatar: "$ownerDetails.avatar",
        },
        isLikedByCurrentUser: 1,
      },
    },
  ]);

  // 🔹 STEP 5: Seen set
  const seenSet = new Set(excludeIds.map((id) => id.toString()));

  // 🔥 STEP 6: SCORING WITH DECAY
  const scoredPosts = candidates.map((post) => {
    let score = 0;

    const hoursAgo =
      (Date.now() - new Date(post.createdAt)) / (1000 * 60 * 60);

    // 🔥 decay factor
    const decay = 1 / (1 + hoursAgo / 10);

    // 🔥 Following
    if (followingIds.includes(post.owner._id.toString())) {
      score += 80;
    }

    // 🔥 Engagement (with decay)
    score += (post.likesCount || 0) * 1.2 * decay;
    score += (post.commentsCount || 0) * 2 * decay;

    // 🔥 Recency boost
    score += Math.max(0, 15 - hoursAgo);

    // 🔥 Tag match
    const matchCount = (post.tags || []).filter((tag) =>
      user?.interests?.includes(tag)
    ).length;

    score += matchCount * 20;

    // 🔥 Seen penalty
    if (seenSet.has(post._id.toString())) {
      score -= 30;
    }

    return { post, score };
  });

  // 🔥 STEP 7: SORT (score-based)
  scoredPosts.sort((a, b) => {
    if (b.score === a.score) return Math.random() - 0.5;
    return b.score - a.score;
  });

  // 🔥 STEP 8: DIVERSITY CONTROL (relaxed)
  const seenUsers = new Map();
  const finalFeed = [];

  for (const item of scoredPosts) {
    const ownerId = item.post.owner._id.toString();

    if ((seenUsers.get(ownerId) || 0) >= 3) continue;

    seenUsers.set(ownerId, (seenUsers.get(ownerId) || 0) + 1);

    finalFeed.push(item.post);

    if (finalFeed.length === pageSize) break;
  }

  // 🔹 STEP 9: Cursor (based on createdAt ONLY)
  const nextCursor =
    finalFeed.length > 0
      ? finalFeed[finalFeed.length - 1].createdAt
      : null;

  // 🔴 STEP 10: Fallback (ensures ALL posts reachable)
  if (finalFeed.length === 0 && excludeIds.length > 0) {
    const fallbackPosts = await Post.find({
      isDeleted: false,
      _id: { $nin: excludeIds },
    })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .populate("owner", "username fullname avatar");

    const fallbackCursor =
      fallbackPosts.length > 0
        ? fallbackPosts[fallbackPosts.length - 1].createdAt
        : null;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          posts: fallbackPosts,
          nextCursor: fallbackCursor,
        },
        "Fallback feed"
      )
    );
  }

  // 🔹 STEP 11: Response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts: finalFeed,
        nextCursor,
      },
      "Feed fetched successfully"
    )
  );
});


export {
    getAllPosts,
    uploadPost,
    updatePost,
    deletePost,
    getPostsOfUser,
    getRecommendedFeed
}