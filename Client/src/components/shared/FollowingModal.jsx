
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCheck2 } from "lucide-react";
import { getFollowings } from "../../api/server1.api";
import UserItem from "../ui/UserItem";
import UserItemSkeleton from "../skeleton/UserItemSkeleton";

const FollowingModal = ({ userId, onClose }) => {
  const [followings, setFollowings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchFollowings = async (pg = 1) => {
    setLoading(true);
    try {
    const { data } = await getFollowings(userId, pg);
    const newFollowings = data.data.transformedFollowings;
    setFollowings((prev) => (pg === 1 ? newFollowings : [...prev, ...newFollowings]));
    setPage(data.data.currentPage);
    setTotalPages(data.data.totalPages);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowings();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white w-full max-w-md rounded-xl shadow-lg relative z-60 p-5">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <div className="flex items-center gap-2 text-primary font-semibold text-lg">
              <UserCheck2 className="w-5 h-5 stroke-primary" />
              <span>Following</span>
            </div>
            <button onClick={onClose} className="hover:text-red-500 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* <div className="max-h-[300px] overflow-auto scrollbar-hide">
            {followings.length > 0 ? (
              followings.map((user) => <UserItem key={user._id} user={user} onClose={onClose} />)
            ) : (
              <p className="text-center text-gray-500">No followings yet.</p>
            )}
          </div> */}
<div className="max-h-[300px] overflow-auto scrollbar-hide">
  {loading && page === 1 ? (
    // Show 6 skeletons on initial load
    Array.from({ length: 6 }).map((_, i) => <UserItemSkeleton key={i} />)
  ) : followings.length > 0 ? (
    followings.map((user) => <UserItem key={user._id} user={user} onClose={onClose} />)
  ) : (
    <p className="text-center text-gray-500">No followings yet.</p>
  )}
</div>
      
          {page < totalPages && (
  <button
    onClick={() => fetchFollowings(page + 1)}
    className="mt-4 w-full text-sm text-blue-600 hover:underline disabled:opacity-50"
    disabled={loading}
  >
    {loading ? "Loading..." : "Load more"}
  </button>
)}
        </div>

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

export default FollowingModal;
