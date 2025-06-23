
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { searchUsersByUsername } from "../../api/user.api";
import UserItem from "../ui/UserItem";
// import UserItemSkeleton from "../ui/UserItemSkeleton";
import toast from "react-hot-toast";
import UserItemSkeleton from "../skeleton/UserItemSkeleton";

const SearchModal = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch users
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await searchUsersByUsername(debouncedQuery);
        if (data.success) {
          setResults(data.data);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (debouncedQuery.trim()) fetchResults();
    else setResults([]);
  }, [debouncedQuery]);

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
              <Search className="w-5 h-5" />
              <span>Search Users</span>
            </div>
            <button onClick={onClose} className="hover:text-red-500 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search input */}
          <input
            type="text"
            placeholder="Search by username"
            className="input input-bordered w-full mb-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Search results */}
          <div className="max-h-[300px] overflow-auto scrollbar-hide space-y-2">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <UserItemSkeleton key={i} />)
            ) : results.length > 0 ? (
              results.map((user) => (
                <UserItem key={user._id} user={user} onClose={onClose} />
              ))
            ) : debouncedQuery ? (
              <p className="text-center text-gray-500">No users found.</p>
            ) : null}
          </div>
        </div>

        {/* Background overlay */}
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

export default SearchModal;
