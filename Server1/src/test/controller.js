const getPostsOfUser = asyncHandler(async (req, res) => {
    // 1. Get the userId from the authenticated user
    // 2. Get page and limit from the request query
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const {targetUserId} = req.params

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



// helper
const buildPostAggregationPipeline = ({ userId, targetUserId, pageNumber, pageSize }) => {
  const matchStage = targetUserId
    ? { $match: { owner: new mongoose.Types.ObjectId(targetUserId) } }
    : { $match: {} };

  return [
    matchStage,
    { $sort: { createdAt: -1 } },
    { $skip: (pageNumber - 1) * pageSize },
    { $limit: pageSize },
    // ...rest of your lookup, addFields, and project logic
    {
      $addFields: {
        commentCount: { $size: "$comments" },
        likeCount: { $size: "$likes" },
        isLikedByCurrentUser: {
          $anyElementTrue: {
            $map: {
              input: "$likes",
              as: "like",
              in: { $eq: ["$$like.likedBy", userId] },
            },
          },
        },
      },
    },
    // ...
  ];
};


const pipeline = buildPostAggregationPipeline({ userId, targetUserId, pageNumber, pageSize });
const posts = await Post.aggregate(pipeline);
