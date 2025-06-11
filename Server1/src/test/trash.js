// const getPostComments = asyncHandler(async (req, res) => {
//     const { postId } = req.params;
//     const { page = 1, limit = 10 } = req.query;

//     if (!mongoose.isValidObjectId(postId)) {
//         return res.status(400).json(new ApiError(400, "Invalid post ID"));
//     }

//     const pageNumber = parseInt(page, 10);
//     const pageSize = parseInt(limit, 10);
//     const currentUserId = req.user?._id; // Authenticated user's ID

//     try {
//         // Aggregation Pipeline
//         const commentsWithLikes = await Comment.aggregate([
//             { $match: { post: new mongoose.Types.ObjectId(postId) } }, // Match comments by postId
//             { $sort: { createdAt: -1 } }, // Sort by latest comments first
//             { $skip: (pageNumber - 1) * pageSize }, // Pagination: Skip previous pages
//             { $limit: pageSize }, // Pagination: Limit to page size
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
//                     from: "likes",
//                     localField: "_id",
//                     foreignField: "comment",
//                     as: "likes"
//                 }
//             },
//             {
//                 $addFields: {
//                     likeCount: { $size: "$likes" }, // Count number of likes
//                     isLikedByCurrentUser: {
//                         $in: [new mongoose.Types.ObjectId(currentUserId), "$likes.likedBy"]
//                     }, // Check if the current user liked this comment
//                     likers: {
//                         $map: {
//                             input: "$likes",
//                             as: "like",
//                             in: "$$like.likedBy"
//                         }
//                     } // Extract likers' user IDs
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "likers",
//                     foreignField: "_id",
//                     as: "likersDetails"
//                 }
//             },
//             {
//                 $addFields: {
//                     owner: { $arrayElemAt: ["$ownerDetails", 0] }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     content: 1,
//                     createdAt: 1,
//                     owner: { 
//                         _id: "$owner._id",
//                         username: "$owner.username",
//                         fullname: "$owner.fullname",
//                         avatar: "$owner.avatar",
//                      }, // Get single owner object
//                     likeCount: 1,
//                     isLikedByCurrentUser: 1,
//                     likers: "$likersDetails.username" // Get likers' usernames
//                 }
//             }
//         ]);

//         // Count total comments for pagination
//         const totalComments = await Comment.countDocuments({ post: postId });

//         return res.status(200).json(new ApiResponse(200, {
//             comments: commentsWithLikes,
//             totalPages: Math.ceil(totalComments / pageSize),
//             currentPage: pageNumber
//         }, "Comments fetched successfully"));

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new ApiError(500, "Something went wrong while fetching comments", error));
//     }
// });