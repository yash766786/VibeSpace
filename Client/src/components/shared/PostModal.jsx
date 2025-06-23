import { useState } from "react";
import { updatePost } from "../../api/server1.api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FileEdit, Save, X, XCircle } from "lucide-react";

const PostModal = ({ post, onClose, onUpdate }) => {
  const [description, setDescription] = useState(post.description);

  const handleUpdate = async () => {
    try {
      await updatePost(post._id, { description });
      onUpdate(description);
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
      >
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-60">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <FileEdit className="w-5 h-5 text-primary" />
              <span>Edit Post</span>
            </div>
            <button onClick={onClose} className="hover:text-red-500 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Textarea */}
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring focus:border-blue-400 text-sm"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Update your post description..."
            maxLength={100}
          />
          <p className="text-right text-sm text-gray-500 mb-4">{description.length}/100</p>


          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostModal;
