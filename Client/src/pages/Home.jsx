
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { postsFetched } from "../redux/reducer/postSlice";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import PostCard from "../components/ui/PostCard";
import { getAllPosts } from "../api/server1.api";
import PostSkeleton from "../components/skeleton/PostSkeleton";
import { Helmet } from "react-helmet";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, page, hasMore, hasFetchedPosts } = useSelector(
    (state) => state.posts
  );
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (page) => {
    const toastId = toast.loading("Fetching Posts...");
    setLoading(true);
    try {
      const { data } = await getAllPosts(page);
      if (data?.success) {
        dispatch(
          postsFetched({
            posts: data.data.posts,
            totalPages: data.data.totalPages,
            currentPage: data.data.currentPage,
          })
        );
      }
    } catch (error) {
      toast.error(`${error?.response?.data?.message}`, { id: toastId });
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    if (!hasFetchedPosts) fetchPosts(page);
  }, []);

  return (
    <div className="pr-1 md:px-2 py-6 md:w-full max-w-xl mx-auto h-[calc(100vh-70px)] overflow-auto scrollbar-hide relative">
      <AnimatePresence>
        {loading && !posts.length
          ? [...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PostSkeleton />
              </motion.div>
            ))
          : posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
      </AnimatePresence>

      {hasMore && !loading ? (
        <div className="flex justify-center my-4">
          <button
            onClick={() => fetchPosts(page)}
            className="btn btn-outline btn-primary hover:scale-105 transition-transform duration-200"
          >
            Load More
          </button>
        </div>
      ) : null}

      {hasMore && loading && (
        <div className="my-4">
          {[...Array(1)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      )}

      {!hasMore && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 my-4"
        >
          No more posts
        </motion.p>
      )}
    </div>
  );
};

export default Home;
