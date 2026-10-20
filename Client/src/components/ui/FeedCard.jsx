import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";

import { togglePostLike } from "../../api/server1.api";
import { formatMessageTime } from "../../utils/formatMessageTime";
import { fileFormat, transformImage } from "../../utils/features";
import { RenderAttachment } from "./renderattachment";

const FeedCard = ({ post }) => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  const {
    owner,
    createdAt,
    updatedAt,
    postFile,
    description,
    isLikedByCurrentUser,
    likesCount,
    commentsCount,
    _id,
  } = post;

  const [isLiked, setIsLiked] = useState(isLikedByCurrentUser);
  const [likeCount, setLikeCount] = useState(likesCount || 0);
  const [commentCount] = useState(commentsCount || 0);

  const type = fileFormat(postFile?.url);

  const lastClickRef = useRef(0);

  const handleLike = async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastClickRef.current < 500) {
      return;
    }
    lastClickRef.current = now;

    try {
      await togglePostLike(_id);

      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleProfileNavigation = (username) => {
    navigate(`/${username}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card w-full bg-white shadow-lg rounded-2xl mt-3 border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={transformImage(owner?.avatar?.url)}
                alt="avatar"
                className="object-cover cursor-pointer"
                onClick={() => handleProfileNavigation(owner.username)}
              />
            </div>
          </div>

          <div>
            <h3
              className="font-medium text-sm cursor-pointer hover:text-blue-900"
              onClick={() => handleProfileNavigation(owner.username)}
            >
              {owner?.fullname}
            </h3>
            <p className="text-xs text-gray-500">@{owner?.username}</p>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-right">
          {updatedAt !== createdAt && <p className="italic">updated</p>}
          <p>{formatMessageTime(createdAt)}</p>
        </div>
      </div>

      {/* Media */}
      <div className="w-full h-[400px] flex justify-center overflow-hidden">
        <RenderAttachment type={type} url={postFile?.url} />
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        {description && <p className="mb-3 text-sm">{description}</p>}

        <div className="flex items-center gap-6 text-sm text-gray-700">
          {/* Like */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1 hover:text-red-500 transition"
          >
            {isLiked ? (
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            ) : (
              <Heart className="w-5 h-5" />
            )}
            {likeCount}
          </button>

          {/* Comment count only (no modal yet) */}
          <div className="flex items-center gap-1 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            {commentCount}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedCard;