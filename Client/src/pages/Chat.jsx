// pages/Chat.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSocket } from "../context/SocketContext";
import { useSelector, useDispatch } from "react-redux";
import { conf, configWithHeaders } from "../conf/conf.js";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import { chatsFetched } from "../redux/reducer/chatSlice.js";
import { CHECK_ONLINE, ONLINE_USERS } from "../constant/events.js";

const Chat = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { chats, hasFetchedChats } = useSelector((state) => state.chats);

  const [selectedChat, setSelectedChat] = useState(null);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (!socket) return;
    socket.emit(CHECK_ONLINE, currentUser?._id);

    return () => {
      socket.off(ONLINE_USERS);
    };
  }, [socket]);

  const fetchChats = async () => {
    const toastId = toast.loading("Fetching Chat...");
    try {
      const { data } = await axios.get(
        `${conf.server2Url}/chats`,
        configWithHeaders
      );

      if (data?.success) {
        dispatch(
          chatsFetched({
            chats: data?.data,
          })
        );
      } else {
        toast.error(`${data.message}`, { id: toastId });
      }
    } catch (error) {
      toast.error(`${error?.response?.data?.message}`, { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    console.log(hasFetchedChats)
    if (!hasFetchedChats) fetchChats();
  }, []);

  return (
    <div className="flex h-[calc(100vh-70px)]">
    {/* // <div className="flex"> */}
      <Toaster />
      {/* Chat List */}
      <div
        className={`w-full md:w-1/3 border-r ${
          isMobile && selectedChat ? "hidden" : "block"
        }`}
      >
        <ChatList
          setSelectedChat={setSelectedChat}
          selectedChat={selectedChat}
        />
      </div>

      {/* Chat Window */}
      <div
        className={`w-full md:w-2/3 ${
          isMobile && !selectedChat ? "hidden" : "block"
        }`}
      >
        <ChatWindow chat={selectedChat} goBack={() => setSelectedChat(null)} />
      </div>
    </div>
  );
};

export default Chat;
