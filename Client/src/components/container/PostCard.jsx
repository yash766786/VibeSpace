// src/components/container.jsx
import { formatMessageTime } from "../../utils/formatMessageTime";

const PostCard = ({ post }) => {
  const { owner, updatedAt, postFile, likeCount, commentCount } = post;
  // console.log(owner, postFile)
  return (
    <div className="card w-full bg-base-100 shadow-xl rounded-2xl ml-0.5 mt-2">
      {/* Top: Owner Info */}
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={owner?.avatar?.url} alt="user avatar" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm">{owner?.fullname}</h3>
            <p className="text-xs text-gray-500">@{owner?.username}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          {formatMessageTime(updatedAt)}
        </p>
      </div>

      {/* Middle: Post Image */}
      <div className="w-full max-h-[500px] overflow-hidden bg-base-200">
        <img
          src={postFile?.url}
          alt="post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom: Like/Comment Count */}
      <div className="flex items-center justify-between p-4 text-sm text-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {/* <FaRegHeart className="text-xl" /> */}
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            {/* <FaRegCommentDots className="text-xl" /> */}
            <span>{commentCount}</span>
          </div>
        </div>
        <button className="btn btn-sm btn-outline btn-primary">View</button>
      </div>
    </div>
  );
};

export default PostCard;
