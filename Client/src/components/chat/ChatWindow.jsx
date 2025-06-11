// ChatWindow.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { conf, configWithHeaders } from "../../conf/conf";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import MessageInput from "./components/MessageInput";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";

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
      setLoading(true);
      console.log("fetching....");

      const { data } = await axios.get(
        `${conf.server2Url}/messages/${chat._id}?page=${page}`,
        configWithHeaders
      );

      console.log(data);
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
      console.error("Failed to fetch messages:", error);
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
