import { useEffect, useRef, useState } from "react";
import { getVibeMessages, sendVibeMessage } from "../api/server2.api";

const Vibe = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // 🔵 Fetch messages
  const fetchMessages = async () => {
    try {
      console.log("📥 Fetching Vibe messages...");

      const { data } = await getVibeMessages(1, 20);

      if (data.success) {
        console.log("✅ Messages fetched:", data.data.messages.length);
        setMessages(data.data.messages);
      }
    } catch (error) {
      console.error("❌ Fetch Messages Error:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 🔽 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🟢 Send message
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      message: input
    };

    // Optimistic UI
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      console.log("📤 Sending message to Vibe:", currentInput);

      const { data } = await sendVibeMessage({
        message: currentInput
      });

      if (data.success) {
        console.log("🤖 Vibe reply:", data.data.reply);

        const botMessage = {
          sender: "bot",
          message: data.data.reply
        };

        setMessages((prev) => [...prev, botMessage]);
      }

    } catch (error) {
      console.error("❌ Send Message Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-screen">

      {/* Header */}
      <div className="p-4 border-b font-semibold text-lg flex items-center gap-2">
        🤖 <span>Vibe</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-md ${
                msg.sender === "user"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-500">
            Vibe is typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Talk to Vibe..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />

        <button
          onClick={handleSendMessage}
          className="btn btn-primary"
          disabled={loading}
        >
          Send
        </button>
      </div>

    </div>
  );
};

export default Vibe;