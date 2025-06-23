import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { START_TYPING, STOP_TYPING } from "../../../constant/events";
import { useSocket } from "../../../context/SocketContext";
import { fileFormat, transformImage } from "../../../utils/features";
import { Paperclip, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { useEffect } from "react";
import { sendMessage } from "../../../api/server2.api";

const MessageInput = ({ onNewMessage, chatId, userId }) => {
  const { socket } = useSocket();
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const [sendLoading, setSendLoading] = useState(false);
  const typingTimeout = useRef(null);
  const [userTyping, setUserTyping] = useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);

    if (!userTyping) {
      socket.emit(START_TYPING, { userId, chatId });
      setUserTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { userId, chatId });
      setUserTyping(false);
    }, 2000);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
    e.target.value = null;
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (e) => {
    e?.preventDefault();

    if (!text.trim() && attachments.length === 0) {
      toast.error("Please enter a message or attach a file.");
      return;
    }

    if (attachments.length > 5) {
      toast.error("You can only attach up to 5 files.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/webm",
      "audio/mpeg",
      "audio/wav",
    ];

    for (const file of attachments) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} is not allowed.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 10 MB.`);
        return;
      }
    }

    const formData = new FormData();
    formData.append("content", text);
    attachments.forEach((file) => formData.append("attachments", file));

    try {
      setSendLoading(true);
      setText("");
      setAttachments([]);
      const { data } = await sendMessage(chatId, formData)

      if (data.success) {
        onNewMessage(data.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSendLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const memoizedAttachmentUrls = useMemo(() => {
    return attachments.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [attachments]);

  useEffect(() => {
    return () => {
      memoizedAttachmentUrls.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [memoizedAttachmentUrls]);

  return (
    <>
      {/* Attachment Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 overflow-x-auto max-w-full p-2 pb-0"
          >
            {memoizedAttachmentUrls.map(({ file, url }, idx) => {
              const type = fileFormat(file.name);

              return (
                <div
                  key={idx}
                  className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border bg-white shadow-sm"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {type === "image" ? (
                      <img
                        src={transformImage(url)}
                        alt="attachment"
                        className="w-full h-full object-cover"
                      />
                    ) : type === "video" ? (
                      <video
                        src={transformImage(url)}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : type === "audio" ? (
                      <audio src={url} controls className="w-full h-full" />
                    ) : null}
                  </div>
                  <button
                    onClick={() => removeAttachment(idx)}
                    className="absolute top-1 right-1 bg-black bg-opacity-60 p-1 rounded-full text-white hover:bg-opacity-80"
                    aria-label="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="border-t bg-white p-3 flex items-end gap-2">
        <textarea
          rows={1}
          placeholder="Type a message..."
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          className="flex-grow resize-none rounded-xl border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <input
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          onClick={() => fileInputRef.current.click()}
          title="Attach files"
          className="text-gray-500 hover:text-blue-600 transition"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <button
          onClick={handleSend}
          disabled={sendLoading}
          className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};

export default MessageInput;
