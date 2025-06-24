// src/components/container.jsx
import { useSelector } from "react-redux";
import { formatMessageTime } from "../../utils/formatMessageTime";
import LikeModal from "../shared/LikeModal";
import PostModal from "../shared/PostModal";
import CommentModal from "../shared/CommentModal";
import { useState } from "react";
import toast from "react-hot-toast";
import { deletePost, togglePostLike } from "../../api/server1.api";
import { fileFormat, transformImage } from "../../utils/features";
import { RenderAttachment } from "./renderattachment";
import {
  Heart,
  MessageCircle,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const PostCard = ({ post }) => {
  const { owner, updatedAt, createdAt, postFile, isLikedByCurrentUser, _id } =
    post;
  const { currentUser } = useSelector((state) => state.auth);

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [description, setDescription] = useState(post.description);
  const [isLiked, setIsLiked] = useState(isLikedByCurrentUser);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);

  const type = fileFormat(postFile?.url);

  const updatePostDescription = (newDesc) => {
    setDescription(newDesc);
  };

  const handleTogglePostLike = async (e) => {
    e.preventDefault();
    try {
      // await axios.post(`/posts/${post._id}/like`);
      await togglePostLike(post._id);
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(post._id);
      toast.success("Post deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const navigate = useNavigate();
  const handleProfileNavigation = (username) => {
    navigate(`/${username}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="card w-full bg-white shadow-xl rounded-2xl ml-0.5 mt-3 max-w-2xl mx-auto border border-gray-200"
    >
      {/* Modals */}
      {showCommentModal && (
        <CommentModal postId={_id} onClose={() => setShowCommentModal(false)}
        setCommentCount={setCommentCount} />
      )}
      {showLikeModal && (
        <LikeModal postId={_id} onClose={() => setShowLikeModal(false)} />
      )}
      {showEditModal && (
        <PostModal
          post={{ _id, description }}
          onClose={() => setShowEditModal(false)}
          onUpdate={updatePostDescription}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={transformImage(owner?.avatar?.url)}
                alt="user avatar"
                className="object-cover cursor-default"
                onClick={() => handleProfileNavigation(owner.username)}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm cursor-default hover:text-blue-950" onClick={() => handleProfileNavigation(owner?.username)}>{owner?.fullname}</h3>
            <p className="text-xs text-gray-500 cursor-default hover:text-blue-950" onClick={() => handleProfileNavigation(owner?.username)}>@{owner?.username}</p>
          </div>
        </div>
        <div className="text-xs text-gray-400 text-right">
          {updatedAt !== createdAt && <p className="italic">updated</p>}
          <p>{formatMessageTime(updatedAt)}</p>
        </div>
      </div>

      {/* Attachment */}
      <div className="w-auto h-[400px] aspect-[4/5] overflow-hidden justify-center flex">
        <RenderAttachment type={type} url={postFile?.url} />
      </div>

      {/* Description */}
      <div className="px-4 py-3">
        <p className="mb-3 text-sm">{description}</p>

        {/* Action Buttons */}
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div className="flex gap-4 items-center">
            <button
              onClick={handleTogglePostLike}
              className="flex items-center gap-1 hover:text-red-500 transition"
            >
              {isLiked ? (
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              ) : (
                <Heart className="w-4 h-4" />
              )}
              {likeCount}
            </button>

            <button
              onClick={() => setShowCommentModal(true)}
              className="flex items-center gap-1 hover:text-blue-500 transition"
            >
              <MessageCircle className="w-4 h-4" />
              {commentCount}
            </button>

            <button
              onClick={() => setShowLikeModal(true)}
              className="flex items-center gap-1 hover:text-pink-500 transition"
            >
              <Users className="w-4 h-4" />
              View Likes
            </button>
          </div>

          {/* Owner-only Actions */}
          {currentUser._id === owner._id && (
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setShowEditModal(true)}
                className="hover:text-yellow-500 transition"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeletePost}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
