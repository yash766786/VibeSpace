import { useState } from "react";
import { toast } from "react-hot-toast";
import { uploadPost } from "../api/server1.api";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function CreatePostPage() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/") && !selected.type.startsWith("video/")) {
      return toast.error("Only images and videos are allowed");
    }

    setFile(selected);
    setPreviewURL(URL.createObjectURL(selected));
  };

  const handleUploadPost = async () => {
    if (!file) return toast.error("File is required");

    const allowedTypes = ["image/", "video/"];
    if (!allowedTypes.some((type) => file.type.startsWith(type))) {
      return toast.error("Only images or videos are allowed");
    }

    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount > 100) {
      return toast.error("Description must not exceed 100 words");
    }

    const formData = new FormData();
    formData.append("postFile", file);
    formData.append("description", description);

    try {
      setLoading(true);
      await uploadPost(formData);
      toast.success("Post uploaded!");
      setFile(null);
      setPreviewURL("");
      setDescription("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Post</h2>

      <textarea
        placeholder="Write a caption..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full h-24 resize-none p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
        maxLength={100}
      />
      <p className="text-right text-sm text-gray-500 mb-4">{description.length}/100</p>

      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="mb-4 border border-zinc-300 rounded-md w-full"
      />

      <AnimatePresence>
        {previewURL && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-2">Post Preview</h3>
            <PostPreview
              description={description}
              fileURL={previewURL}
              fileType={file?.type}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleUploadPost}
        disabled={!file || loading}
        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Posting...
          </>
        ) : (
          "Post"
        )}
      </button>
    </div>
  );
}

export function PostPreview({ description, fileURL, fileType }) {
  return (
    <motion.div
      layout
      className="border rounded-lg shadow overflow-hidden bg-white"
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {fileType?.startsWith("image/") ? (
        <img
          src={fileURL}
          alt="preview"
          className="w-full max-h-[400px] object-cover"
        />
      ) : (
        <video controls className="w-full max-h-[400px]">
          <source src={fileURL} />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="p-3">
        <p className="text-gray-800">{description}</p>
      </div>
    </motion.div>
  );
}