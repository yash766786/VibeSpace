import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStart,
  feedFetched,
  fetchError,
} from "../redux/reducer/feedSlice";
import { getFeedPosts } from "../api/server1.api";
import PostCard from "../components/ui/PostCard";
import PostSkeleton from "../components/skeleton/PostSkeleton";
import toast from "react-hot-toast";
import FeedCard from "../components/ui/FeedCard";

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, cursor, hasMore, loading } = useSelector(
    (state) => state.feed,
  );

  const fetchFeed = async () => {
    if (loading || !hasMore) return;

    dispatch(fetchStart());

    try {
      const excludeIds = posts
        .slice(-30) // 🔥 only last 30
        .map((p) => p._id)
        .join(",");

      const { data } = await getFeedPosts({
        cursor,
        exclude: excludeIds,
      });

      if (data?.success) {
        dispatch(
          feedFetched({
            posts: data.data.posts,
            nextCursor: data.data.nextCursor,
          }),
        );
      }
    } catch (error) {
      dispatch(fetchError());
      toast.error(error?.response?.data?.message || "Failed to load feed");
    }
  };

  // initial fetch
  useEffect(() => {
    if (!posts.length) {
      fetchFeed();
    }
  }, []);

  return (
    <div className="pr-1 md:px-2 py-6 md:w-full max-w-xl mx-auto h-[calc(100vh-70px)] overflow-auto scrollbar-hide">
      {/* POSTS */}
      {posts.map((post) => (
        <FeedCard key={post._id} post={post} />
      ))}

      {/* LOADING */}
      {loading && (
        <div className="my-4">
          {[...Array(2)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      )}

      {/* LOAD MORE */}
      {hasMore && !loading && (
        <div className="flex justify-center my-4">
          <button onClick={fetchFeed} className="btn btn-outline btn-primary">
            Load More
          </button>
        </div>
      )}

      {/* END */}
      {!hasMore && (
        <p className="text-center text-gray-500 my-4">No more posts</p>
      )}
    </div>
  );
};

export default Feed;
