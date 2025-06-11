//
import axios from "axios";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { conf, configWithHeaders } from "../conf/conf";
import { postsFetched } from "../redux/reducer/postSlice";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useRef } from "react";
import PostCard from "../components/container/PostCard";
import { useState } from "react";
import Footer from "../layout/Footer";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.auth);
  const { posts, page, hasMore, hasFetchedPosts } = useSelector(
    (state) => state.posts
  );
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (page = "1") => {
    const toastId = toast.loading("Fetching Post...");
    console.log(page);
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${conf.server1Url}/posts?page=${page}`,
        configWithHeaders
      );
      console.log(data?.data);
      if (data?.success) {
        dispatch(
          postsFetched({
            posts: data?.data?.posts,
            totalPages: data?.data?.totalPages,
            currentPage: data?.data?.currentPage,
          })
        );
      } else {
        toast.error(`${data.message}`, { id: toastId });
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

  useEffect(() => {
    const handelInfiniteScroll = async () => {
      try {
        if (
          window.innerHeight + document.documentElement.scrollTop + 1 >=
            document.documentElement.scrollHeight &&
          hasMore
        ) {
          console.log("Infinite scroll triggered", { hasMore, page });
          fetchPosts(page); // Fetch next page of posts
        }
      } catch (error) {
        console.log(error);
      }
    };

    window.addEventListener("scroll", handelInfiniteScroll);
    return () => window.removeEventListener("scroll", handelInfiniteScroll);
  }, [hasMore, page]); // 👈 ensure latest values are used

  // return (
  //   <div className="pr-1 md:px-2 py-6 md:w-full max-w-xl mx-auto h-[calc(100vh-70px)] overflow-auto scrollbar-hide">
  //     <Toaster />
  //     {posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
  //     {hasMore && <button onClick={() => fetchPosts(page)}>load more</button>}
  //     {!hasMore && (
  //       <p className="text-center text-gray-500 my-4">No more posts</p>
  //     )}
  //   </div>
  // );

   return (
    <div className="pr-1 md:px-2 py-6 md:w-full max-w-xl mx-auto h-[calc(100vh-70px)] overflow-auto scrollbar-hide relative">
      <Toaster />

      <AnimatePresence>
        {posts &&
          posts.map((post, index) => (
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

      {hasMore && (
        <div className="flex justify-center my-4">
          <button
            onClick={() => fetchPosts(page)}
            className="btn btn-outline btn-primary hover:scale-105 transition-transform duration-200"
          >
            Load More
          </button>
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

// fetch post and append post
// infinite scrollbar
// add end of page-> re-fetch post if(totalpage>currentPage or hasmore==true)
