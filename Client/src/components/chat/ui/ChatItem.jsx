import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NEW_MESSAGE_ALERT, TYPING_STATUS } from "../../../constant/events";
import { useSocketEvent } from "../../../hooks/useSocketEvent";
import { motion } from "framer-motion";
import { Dot } from "lucide-react";

const ChatItem = ({ chat, isSelected, onSelect, isOnline }) => {
  const { _id, friend } = chat;
  const { currentUser } = useSelector((state) => state.auth);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const [newMessageAlert, setNewMessageAlert] = useState(false);

  // working
  const handleOnSelect = () => {
    onSelect(chat);
    // Reset new message alert when chat is selected
    if (newMessageAlert) {
      setNewMessageAlert(false);
    }
  }

  // working
  useSocketEvent(TYPING_STATUS, ({ userId, chatId, isTyping }) => {
    if (chatId === _id && userId !== currentUser?._id) {
      setIsFriendTyping(isTyping);
    }
  });

  // working
  useSocketEvent(NEW_MESSAGE_ALERT, ({chatId, message }) => {
    if (chatId === _id && !isSelected) {
      setNewMessageAlert(true);
    }
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onClick={handleOnSelect}
      className={`flex items-center justify-between gap-3 p-3 mx-0.5 rounded-xl cursor-pointer mb-2 transition ${
        isSelected ? "bg-blue-100" : "hover:bg-gray-100 w-full"
      }`}
    >
      {/* Left Side: Avatar and Info */}
      <div className="flex items-center gap-3 w-full">
        <div className="relative">
          <img
            src={friend.avatar.url}
            alt={friend.username}
            className="w-10 h-10 rounded-full object-cover border"
          />
          {isOnline && (
            <Dot
              // className="text-green-500 absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5"
              className="text-green-500 absolute -bottom-8 -right-8 bg-inherit rounded-full p-0.5 size-20"
              
              // size={50}
            />
           
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-black truncate">
            {friend.fullname}
          </p>
          {isFriendTyping ? (
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              {/* <Dot className="animate-pulse text-green-500" size={16} /> Typing... */}
              Typing...
            </p>
          ) : (
            <p className="text-xs text-gray-500 truncate">@{friend.username}</p>
          )}
        </div>

        {/* New Message Badge */}
        {newMessageAlert && !isSelected && (
          <div className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
            NEW
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatItem;
