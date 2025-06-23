// ChatWindow.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { conf, configWithHeaders } from "../../conf/conf";
import ChatHeader from "./ui/ChatHeader";
import ChatMessages from "./ui/ChatMessages";
import MessageInput from "./ui/MessageInput";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { useSocketEvent } from "../../hooks/useSocketEvent";
import { NEW_MESSAGE_ALERT } from "../../constant/events";
import { getMessages } from "../../api/server2.api";
import toast from "react-hot-toast";

const ChatWindow = ({ chat, goBack }) => {
  const { socket, isConnected } = useSocket();
  const { currentUser } = useSelector((state) => state.auth);
  const userId = currentUser?._id;
  const chatId = chat?._id;
  const members = chat?.members || [];

  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async (page = 1) => {
    if (!chat?._id) return;

    try {
      setLoading(true)
      const { data } = await getMessages(chat._id, page)

      if (data?.success) {
        const newMessages = data.data.messages.reverse(); // Make oldest on top
        setMessages((prev) => [...newMessages, ...prev]);
        const totalPages = data.data.totalPages;
        const currentPageFromServer = data.data.currentPage;

        // Set hasMore if more pages are available
        setHasMore(currentPageFromServer < totalPages);
        setCurrentPage(currentPageFromServer); // Server is the source of truth
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  // Reset state when chat changes
  setMessages([]);
  setCurrentPage(1);
  setHasMore(true);
}, [chat?._id]);  // safer dependency than full chat object


  useEffect(() => {
    fetchMessages();
  }, [chat]);

  const loadMoreMessages = () => {
  if (loading || !hasMore) return;
  fetchMessages(currentPage + 1);
};

  useSocketEvent(NEW_MESSAGE_ALERT, ({chatId, message }) => {
    if (chatId !== chat._id)  return;
    if(message.sender == currentUser._id) return;
    setMessages((prev) => [...prev, message])
  });


  if (!chat) return null;
  return (
    <div className="flex flex-col h-full w-full md:w-auto">
      {/* Top Header */}
      <ChatHeader goBack={goBack} chat={chat} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {/* <ChatMessages messages={messages} chat={chat} /> */}
        <ChatMessages
          messages={messages}
          chat={chat}
          hasMore={hasMore}
          loading={loading}
          currentPage={currentPage}
          loadMoreMessages={loadMoreMessages}
        />
      </div>

      {/* Input Area */}
      <MessageInput
        chatId={chatId}
        userId={currentUser?._id}
        onNewMessage={(msg) => setMessages((prev) => [...prev, msg])}
      />
    </div>
  );
};

export default ChatWindow;
