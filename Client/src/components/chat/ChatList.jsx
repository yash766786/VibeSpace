// src/components/chat/ChatList.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChatItem from "./ui/ChatItem";
import { ONLINE_USERS } from "../../constant/events";
import { useSocketEvent } from "../../hooks/useSocketEvent";
import { setOnlineUsers } from "../../redux/reducer/onlineSlice";
import { useSocket } from "../../context/SocketContext";

const ChatList = ({ setSelectedChat, selectedChat }) => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const { chats } = useSelector((state) => state.chats); 
  const onlineUsers = useSelector((state) => state.onlineUsers.onlineUsers);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
  if (!socket) return;

  socket.emit("CHECK_ONLINE", currentUser?._id);
  socket.on(ONLINE_USERS, (userIds) => {
    dispatch(setOnlineUsers(userIds)); 
  });

  return () => {
    socket.off(ONLINE_USERS);
  };
}, [socket]);

  return (
  <div className="h-full overflow-y-auto px-3 py-4">
    {chats.map((chat) => (
      <ChatItem
        key={chat._id}
        chat={chat}
        isSelected={selectedChat?._id === chat._id}
        onSelect={setSelectedChat}
        isOnline={onlineUsers.includes(chat.friend._id)}
      />
    ))}
  </div>
);

  // return (
  //   <div className="h-full overflow-y-auto p-4">
  //     {chats.map((chat) => (
  //       <ChatItem
  //         key={chat._id}
  //         chat={chat}
  //         isSelected={selectedChat?._id === chat._id}
  //         onSelect={setSelectedChat}
  //         isOnline={onlineUsers.includes(chat.friend._id)}
  //       />
  //     ))}
  //   </div>
  // );
};

export default ChatList;
