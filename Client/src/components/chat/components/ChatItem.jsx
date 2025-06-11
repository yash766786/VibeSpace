import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NEW_MESSAGE_ALERT, TYPING_STATUS } from "../../../constant/events";
import { useSocketEvent } from "../../../hooks/useSocketEvent";

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
    console.log(`Received TYPING_STATUS: ${userId} isTyping: ${isTyping} for chatId: ${chatId}`);
    if (chatId === _id && userId !== currentUser?._id) {
      setIsFriendTyping(isTyping);
    }
  });

  // working
  useSocketEvent(NEW_MESSAGE_ALERT, ({chatId, message }) => {
    console.log(`Received NEW_MESSAGE_RECEIVED: ${chatId} and ${isSelected} with message:`, message);
    if (chatId === _id && !isSelected) {
      setNewMessageAlert(true);
    }
  });


  return (
    <div
      onClick={handleOnSelect}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 ${
        isSelected ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
    >
      <img
        src={friend.avatar.url}
        alt={friend.username}
        className="w-10 h-10 rounded-full object-cover"
      />
      

      <div>
        <p className="font-semibold">{friend.fullname}</p>
        {isFriendTyping ? (
          <p className="text-sm text-green-700 font-bold">Typing...</p>
        ) : (
          <p className="text-sm text-gray-500">@{friend.username}</p>
        )}
        {/* <p className="text-sm text-gray-500">@{friend.username}</p> */}
      </div>

      {isOnline && <span className="text-xs text-green-500">online</span>}

      {newMessageAlert && !isSelected && (
        <span className="top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          New
        </span>
      )}
    </div>
  );
};

export default ChatItem;
