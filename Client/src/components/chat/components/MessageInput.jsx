import { useState, useRef } from "react"
import toast, { Toaster } from "react-hot-toast";
import { conf, configWithoutHeaders } from "../../../conf/conf";
import axios from "axios";
import { START_TYPING, STOP_TYPING } from "../../../constant/events";
import { useSocket } from "../../../context/SocketContext";

const MessageInput = ({ onNewMessage, chatId, userId }) => {
  // const { _id } = chat;
  const { socket } = useSocket();
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const [sendLoading, setSendLoading] = useState(false);
  const typingTimeout = useRef(null);
  const [userTyping, setUserTyping] = useState(false);


  // Handle text change
  const handleTextChange = (e) => {
    setText(e.target.value);
    if(!userTyping) {
      socket.emit(START_TYPING, {userId, chatId});
      // setIamTyping(true);
      console.log("User is typing...", userId);
      setUserTyping(true);
    }
    if(typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, {userId, chatId});
      setUserTyping(false);
    }, [2000]);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
    e.target.value = null; // reset input
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();

    // Validate input
    if (!text.trim() && attachments.length === 0){
      toast.error("Please enter a message or attach a file.");
      return;
    }
    
    // Validate attachments count (max 3)
    if(attachments && attachments.length > 3) {
      toast.error("You can only attach up to 5 files.");
      return;
    }

    // Validate file types allowed(images, videos, audio and documents)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm", "audio/mpeg", "audio/wav", "application/pdf"];
    for (const file of attachments) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} is not an allowed type.`);
        return;
      }
    }

    // validate file size
    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    for (const file of attachments) {
      if (file.size > maxFileSize) {
        toast.error(`File ${file.name} exceeds the maximum size of 10 MB.`);
        return;
      }
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("content", text);
    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      setText("");
      setAttachments([]);
      setSendLoading(true);
      const {data} = await axios.post(
        `${conf.server2Url}/messages/${chatId}`,
        formData,
        configWithoutHeaders
      );
      if (data.success) {
        toast.success("Message sent successfully!");
        onNewMessage(data.data); // Call the callback with the new message
      } else {
        toast.error(`Error sending message: ${data.message}`);
      }
    } catch (error) {
      toast.error(`Error sending message: ${error.message}`);
      return;
    }
    finally {
      setSendLoading(false);
    }
  };

  // Send on Enter key press (with no Shift)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Toaster/>

      {/* Loading indicator */}
      {sendLoading && (
        <span className="text-gray-500 absolute bottom-24">Sending...</span>
      )}

      {/* Attachment preview */}
      {attachments.length > 0 && (
        <div className="flex justify-center gap-2 overflow-x-auto max-w-xs bg-transparent p-2">
          {attachments.map((file, idx) => {
            const url = URL.createObjectURL(file);
            return (
              <div key={idx} className="relative">
                <img
                  src={url}
                  alt="attachment preview"
                  className="w-16 h-16 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeAttachment(idx)}
                  className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full px-1"
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      )}


      <div className="border-t p-3 flex flex-row md:flex-row items-center gap-2 bg-white">
        {/* Textarea */}
        <textarea
          className="flex-grow border rounded p-2 resize-none"
          rows={1}
          placeholder="Type a message..."
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
        />

        {/* Attach Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="text-blue-600 hover:text-blue-800"
          title="Attach files"
        >
          📎
        </button>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </>
  );
};

export default MessageInput;
