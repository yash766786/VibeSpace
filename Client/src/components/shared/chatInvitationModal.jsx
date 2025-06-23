import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { sendFriendRequest } from "../../api/server2.api";

const ChatInvitationModal = ({ targetUserId, onClose }) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    try {
      await sendFriendRequest({ targetUserId, message });
      toast.success("Invitation sent!");
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error sending request");
    }
  };

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
              <MessageCircle className="w-5 h-5 stroke-primary" />
              <span>Send Invitation</span>
            </div>
            <button onClick={onClose} className="hover:text-red-500 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <textarea
            className="w-full border rounded p-2 mb-4"
            rows="4"
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={60}
          />

          <button
            onClick={handleSend}
            className="bg-primary text-white px-4 py-1 rounded text-sm"
          >
            Send
          </button>
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

export default ChatInvitationModal;
