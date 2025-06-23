// ChatHeader.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { useSocketEvent } from "../../../hooks/useSocketEvent";
import { TYPING_STATUS } from "../../../constant/events";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { transformImage } from "../../../utils/features";
import { useNavigate } from "react-router";

const ChatHeader = ({ goBack, chat }) => {
  const { _id, friend } = chat;
  const onlineUsers = useSelector((state) => state.onlineUsers.onlineUsers);
  const { currentUser } = useSelector((state) => state.auth);
  const [isFriendTyping, setIsFriendTyping] = useState(false);

  useSocketEvent(TYPING_STATUS, ({ userId, chatId, isTyping }) => {
    if (chatId === _id && userId !== currentUser?._id) {
      setIsFriendTyping(isTyping);
    }
  });
  const navigate = useNavigate()
  const handleProfileNavigation = (username) => {
    navigate(`/${username}`);
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.10 }}
      className="flex items-center justify-between p-3 border-b border-gray-300 bg-white fixed top-0 md:static z-50 md:z-0 w-full"
    >
      {/* Back button (only on mobile) */}
      {goBack && (
        <button
          onClick={goBack}
          className="md:hidden p-1 text-blue-600 hover:bg-blue-50 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {/* Friend avatar and info */}
      <div className="flex items-center gap-3">
        <img
          src={transformImage(friend.avatar.url, 200)}
          alt={friend.fullname || friend.username}
          className="w-10 h-10 rounded-full object-cover border"
          onClick={() => handleProfileNavigation(friend?.username)}
        />
        <div className="flex flex-col">
          <span className="text-base font-semibold leading-5 text-gray-900"
          onClick={() => handleProfileNavigation(friend?.username)}>
            {friend.fullname}
          </span>
          {isFriendTyping ? (
            <span className="text-xs text-blue-600 font-medium">Typing...</span>
          ) : (
            <span
              className={`text-xs font-medium ${
                onlineUsers.includes(friend._id)
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {onlineUsers.includes(friend._id) ? "Online" : "Offline"}
            </span>
          )}
        </div>
      </div>

      {/* Right-side options (placeholder for future) */}
      <button className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
        <MoreVertical className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export default ChatHeader;
