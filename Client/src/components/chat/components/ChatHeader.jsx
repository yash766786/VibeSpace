// ChatHeader.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { useSocketEvent } from "../../../hooks/useSocketEvent";
import { TYPING_STATUS } from "../../../constant/events";

const ChatHeader = ({ goBack, chat }) => {
  const { _id, friend } = chat;
  const onlineUsers = useSelector((state) => state.onlineUsers.onlineUsers);
  const { currentUser } = useSelector((state) => state.auth);
  const [isFriendTyping, setIsFriendTyping] = useState(false);

  useSocketEvent(TYPING_STATUS, ({ userId, chatId, isTyping }) => {
    console.log(
      `Received TYPING_STATUS: ${userId} isTyping: ${isTyping} for chatId: ${chatId}`
    );
    if (chatId === _id && userId !== currentUser?._id) {
      setIsFriendTyping(isTyping);
    }
  });

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-300 bg-white fixed top-0 md:static z-15 md:z-0 w-full">
      {/* Back button for mobile */}
      {goBack && (
        <button
          className="md:hidden mr-3 text-blue-600"
          onClick={goBack}
          aria-label="Go back"
        >
          &#8592;
        </button>
      )}

      {/* Friend avatar and info */}
      <div className="flex items-center space-x-3">
        <img
          src={friend.avatar.url}
          alt={friend.fullname || friend.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold">{friend.fullname}</h2>

          {/* Online status placeholder */}
          {onlineUsers.includes(friend._id) ? (
            <span className="text-sm text-green-500">Online</span>
          ) : (
            <span className="text-sm text-gray-500">Offline</span>
          )}

          {/* Typing status */}
          {isFriendTyping && (
            <span className="text-sm text-blue-500">Typing...</span>
          )}
        </div>
      </div>

      {/* Placeholder for delete chat or other actions */}
      <div>{/* You can add delete or more options button here */}</div>
    </div>
  );
};

export default ChatHeader;
