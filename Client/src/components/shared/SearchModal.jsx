import { useState, useEffect } from "react";
import { searchUsersByUsername } from "../../api/user.api";
import toast from "react-hot-toast";
import { Link } from "react-router";

const SearchModal = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  const searchUser = async () => {
    setLoading(true);
    try {
      const { data } = await searchUsersByUsername(debouncedQuery);
      console.log(data);
      if (data.success) setResults(data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    searchUser();
  }, [debouncedQuery]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Search Users</h2>
          <button onClick={onClose}>✖</button>
        </div>

        <input
          type="text"
          placeholder="Search by username"
          className="input input-bordered w-full mb-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading && <p className="text-center text-sm">Searching...</p>}
        {!loading && results?.length === 0 && query && (
          <p className="text-center text-sm text-gray-500">No users found</p>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {results.map((user) => (
            <SearchItem key={user._id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Local component for rendering each user
const SearchItem = ({ user }) => {
  return (
    <Link to={`/${user.username}`}>
      <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
        <img
          src={user.avatar.url}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">{user.username}</p>
          <p className="text-sm text-gray-500">{user.fullname}</p>
        </div>
      </div>
    </Link>
  );
};

export default SearchModal;