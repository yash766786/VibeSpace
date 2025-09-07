import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  addComment,
  deleteComment,
  getPostComments,
  toggleCommentLike,
} from "../../api/server1.api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Heart, Trash, MessageCircle } from "lucide-react";
import { formatMessageTime } from "../../utils/formatMessageTime";
import { useNavigate } from "react-router";

const CommentModal = ({ postId, onClose, setCommentCount }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // 🆕 Added
  const [loadingMore, setLoadingMore] = useState(false); // 🆕 Added

  const fetchComments = async (pg = 1) => {
    if (pg === 1) setLoading(true); // 🆕 Only show skeleton on first fetch
    const { data } = await getPostComments({ postId, pg });
    setComments((prev) =>
      pg === 1 ? data.data.comments : [...prev, ...data.data.comments]
    );
    setPage(data.data.currentPage);
    setTotalPages(data.data.totalPages);
    setLoading(false); // 🆕 End loading
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (!content.trim()) return;
    const { data } = await addComment(postId, { content });

    const newComment = {
      _id: data.data._id,
      content: data.data.content,
      owner: {
        _id: currentUser._id,
        username: currentUser.username,
        fullname: currentUser.fullname,
        avatar: currentUser.avatar,
      },
      createdAt: data.data.createdAt,
      likeCount: 0,
      isLikedByCurrentUser: false,
    };

    setComments([newComment, ...comments]);
    setContent("");
    setCommentCount(prev => prev+1)
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments(comments.filter((c) => c._id !== commentId));
    setCommentCount(prev => prev-1)
  };

  const lastClickRef = useRef(0);
  const handleToggleCommentLike = async (commentId) => {
    const now = Date.now();
        // debounce: ignore if < 500ms since last click
        if (now - lastClickRef.current < 500) {
          toast.error("Wait a moment...");
          return;
        }
        lastClickRef.current = now;
    await toggleCommentLike(commentId);
    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId
          ? {
              ...c,
              isLikedByCurrentUser: !c.isLikedByCurrentUser,
              likeCount: c.isLikedByCurrentUser
                ? c.likeCount - 1
                : c.likeCount + 1,
            }
          : c
      )
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      >
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 z-60">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <MessageCircle className="w-5 h-5 stroke-primary" />
              <span>Comments</span>
            </div>
            <button onClick={onClose} className="hover:text-red-500 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Input */}
          <div className="flex gap-2 mb-5">
            <input
              type="text"
              className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Add a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-500 hover:bg-blue-600 transition text-white px-3 py-2 rounded-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          {/* Comments */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <>
                <CommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
              </>
            ) : comments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No comments yet.
              </p>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    onDelete={handleDeleteComment}
                    onToggleLike={handleToggleCommentLike}
                    onClose={onClose}
                  />
                ))}

                {page < totalPages && (
                  <>
                    {!loadingMore ? (
                      <button
                        onClick={async () => {
                          setLoadingMore(true);
                          await fetchComments(page + 1);
                          setLoadingMore(false);
                        }}
                        className="text-sm text-blue-600 hover:underline block mx-auto"
                        // disabled={loading}
                      >
                        load More
                      </button>
                    ) : (
                      <>
                        <CommentSkeleton />
                        <CommentSkeleton />
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile overlay */}
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={onClose}
        />
      </motion.div>
    </AnimatePresence>
  );
};

const CommentItem = ({ comment, onDelete, onToggleLike }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const isOwner = currentUser._id === comment.owner._id;
  const navigate = useNavigate()

  const handleProfileNavigation = (username) => {
    navigate(`/${username}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3"
    >
      <img
        src={comment.owner.avatar.url}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover border"
        onClick={() => handleProfileNavigation(comment.owner.username)}
      />
      <div className="flex-1">
        <div
          className="flex justify-between items-center mb-1"
          onClick={() => handleProfileNavigation(comment.owner.username)}
        >
          <p className="font-medium">{comment.owner.username}</p>
          {isOwner && (
            <button
              onClick={() => onDelete(comment._id)}
              className="text-red-500 hover:text-red-600 cursor-pointer text-xs flex items-center gap-1"
            >
              <Trash className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
        <p className="text-sm">{comment.content}</p>
        <div className="text-xs text-gray-500 flex gap-4 items-center mt-1">
          <span>{formatMessageTime(comment.createdAt)}</span>
          <button
            onClick={() => onToggleLike(comment._id)}
            className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition"
          >
            <Heart
              className={`w-4 h-4 ${
                comment.isLikedByCurrentUser
                  ? "fill-pink-500 stroke-pink-500"
                  : "stroke-gray-400"
              }`}
            />
            {comment.likeCount}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// 🆕 Comment skeleton loader component
const CommentSkeleton = () => {
  return (
    <div className="flex items-start gap-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-300" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/4 bg-gray-300 rounded" />
        <div className="h-3 w-3/4 bg-gray-200 rounded" />
        <div className="h-2 w-1/3 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default CommentModal;