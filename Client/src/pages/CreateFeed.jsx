import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { uploadPost } from "../api/server1.api";
import { searchUsersByUsername } from "../api/user.api";
import { extractTags, extractMentions } from "../utils/extract";
import { Loader2 } from "lucide-react";

export default function CreateFeed() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 mention system
  const [mentionQuery, setMentionQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(mentionQuery), 400);
    return () => clearTimeout(timer);
  }, [mentionQuery]);

  // fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await searchUsersByUsername(debouncedQuery);
        if (data.success) {
          setSuggestions(data.data);
        }
      } catch (err) {
        toast.error("Failed to fetch users");
      }
    };

    if (debouncedQuery) fetchUsers();
    else setSuggestions([]);
  }, [debouncedQuery]);

  // detect @ typing
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);

    const lastWord = value.split(" ").pop();

    if (lastWord.startsWith("@")) {
      setMentionQuery(lastWord.slice(1));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // select mention
  const handleSelectUser = (username) => {
    const words = description.split(" ");
    words[words.length - 1] = `@${username}`;

    setDescription(words.join(" ") + " ");
    setShowSuggestions(false);
  };

  // upload
  const handleUpload = async () => {
    if (!file) return toast.error("File required");

    const tags = extractTags(description);
    const mentionUsernames = extractMentions(description);

    const formData = new FormData();
    formData.append("postFile", file);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags));
    formData.append("mentions", JSON.stringify(mentionUsernames));

    try {
      setLoading(true);
      await uploadPost(formData);

      toast.success("Posted!");

      setFile(null);
      setPreviewURL("");
      setDescription("");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h2 className="text-xl font-bold mb-4">Create Feed</h2>

      {/* TEXTAREA */}
      <div className="relative">
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Write something... use #tags and @mentions"
          className="w-full p-3 border rounded-lg"
        />

        {/* 🔥 Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute bg-white border w-full mt-1 rounded shadow max-h-40 overflow-auto z-10">
            {suggestions.map((user) => (
              <div
                key={user._id}
                onClick={() => handleSelectUser(user.username)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                @{user.username}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FILE */}
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => {
          const f = e.target.files[0];
          if (!f) return;
          setFile(f);
          setPreviewURL(URL.createObjectURL(f));
        }}
        className="my-4"
      />

      {/* PREVIEW */}
      {previewURL && (
        <div className="mb-4">
          {file?.type.startsWith("image") ? (
            <img src={previewURL} className="rounded-lg" />
          ) : (
            <video src={previewURL} controls className="rounded-lg" />
          )}
        </div>
      )}

      {/* SUBMIT */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Post"}
      </button>
    </div>
  );
}