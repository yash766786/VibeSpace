import { useEffect, useState } from "react";
import { getPostLikes } from "../../api/server1.api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import UserItem from "../ui/UserItem";
// import UserItemSkeleton from "../ui/UserItemSkeleton"; // <- new import
import toast from "react-hot-toast";
import UserItemSkeleton from "../skeleton/UserItemSkeleton";

const LikeModal = ({ postId, onClose }) => {
  const [likes, setLikes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchLikes = async (pg = 1) => {
    setLoading(true);
    try {
      const { data } = await getPostLikes({ postId, pg });
      const newLikes = data.data.likes.map((like) => like.likedBy);
      setLikes((prev) => (pg === 1 ? newLikes : [...prev, ...newLikes]));
      setPage(data.data.currentPage);
      setTotalPages(data.data.totalPages);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white w-full max-w-md rounded-xl shadow-lg relative z-60 p-5 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <div className="flex items-center gap-2 text-primary font-semibold text-lg">
              <Heart className="w-5 h-5 fill-primary stroke-primary" />
              <span>People who liked</span>
            </div>
            <button onClick={onClose} className="hover:text-red-500 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Likes List */}
          <div className="max-h-[300px] overflow-auto scrollbar-hide">
            {loading && page === 1 ? (
              Array.from({ length: 6 }).map((_, i) => <UserItemSkeleton key={i} />)
            ) : likes.length > 0 ? (
              likes.map((user) => <UserItem key={user._id} user={user} onClose={onClose} />)
            ) : (
              <p className="text-center text-gray-500">No likes yet.</p>
            )}
          </div>

          {/* Load More */}
          {page < totalPages && (
            <button
              onClick={() => fetchLikes(page + 1)}
              disabled={loading}
              className="mt-4 w-full text-sm text-blue-600 hover:underline disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          )}
        </div>

        {/* Mobile overlay */}
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={onClose}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default LikeModal;
