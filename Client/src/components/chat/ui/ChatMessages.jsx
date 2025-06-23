// // ChatMessages.jsx
// import { useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import { formatMessageTime } from "../../../utils/formatMessageTime";
// import { fileFormat, transformImage } from "../../../utils/features";
// import { RenderAttachment } from "../../container/renderattachment";

// const ChatMessages = ({
//   messages,
//   chat,
//   hasMore,
//   loading,
//   loadMoreMessages,
//   currentPage,
// }) => {
//   const { _id, friend } = chat;
//   const messagesEndRef = useRef(null);
//   const { currentUser } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   // Scroll to bottom whenever messages update
//   useEffect(() => {
//     if (currentPage == 1)
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//       {/* Load More Button */}
//       {hasMore && (
//         <div className="flex justify-center mb-4">
//           <button
//             onClick={loadMoreMessages}
//             disabled={loading}
//             className="px-4 py-1 text-sm border rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
//           >
//             {loading ? "Loading..." : "Load earlier messages"}
//           </button>
//         </div>
//       )}

//       {/* Message List */}
//       {messages.length === 0 && (
//         <p className="text-center text-gray-400 mt-10">No messages yet</p>
//       )}

//       {messages.map((msg) => {
//         const isSender = msg.sender === currentUser._id;
//         return (
//           <div
//             key={msg._id}
//             className={`flex flex-col max-w-xs mb-4 ${
//               isSender ? "ml-auto items-end" : "mr-auto items-start"
//             }`}
//           >
//             {/* Attachments */}
//             {msg.attachments && msg.attachments.length > 0 && (
//               <div className="mt-2 py-1 flex flex-wrap gap-2">
//                 {/* {msg.attachments.map((att) => (
//                   <a
//                     key={att._id}
//                     href={att.url}
//                     className="w-24 h-24 object-cover rounded-lg border"
//                     target="_blank"
//                     download
//                   >
//                     <img
//                       src={transformImage(att.url)}
//                       alt="attachment preview"
//                       className="w-full h-full object-cover rounded"
//                       download
//                     />
//                   </a>
//                   // <img
//                   //   key={att._id}
//                   //   src={att.url}
//                   //   alt="attachment"
//                   //   className="w-24 h-24 object-cover rounded-lg border"
//                   // />
//                 ))} */}
//                 {msg.attachments.map((att) => (
//             <div
//               key={att._id}
//               className="w-48 max-w-full rounded-lg overflow-hidden border"
//             >
//               <RenderAttachment
//                 type={fileFormat(att.url)}
//                 url={att.url}
//               />
//             </div>
//           ))}
//               </div>
//             )}

//             {/* Message content */}
//             {msg.content && (
//               <div
//                 className={`px-4 rounded-lg ${
//                   isSender ? "bg-blue-600 text-white" : "bg-white border"
//                 }`}
//               >
//                 {msg.content}
//               </div>
//             )}

//             {/* Timestamp */}
//             <span className="text-xs text-gray-400 mt-1">
//               {formatMessageTime(msg.createdAt)}
//             </span>
//           </div>
//         );
//       })}
//       <div ref={messagesEndRef} />
//     </div>
//   );
// };

// export default ChatMessages;


import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatMessageTime } from "../../../utils/formatMessageTime";
import { fileFormat } from "../../../utils/features";
import { RenderAttachment } from "../../ui/renderattachment";
import { motion, AnimatePresence } from "framer-motion";

const ChatMessages = ({
  messages,
  chat,
  hasMore,
  loading,
  loadMoreMessages,
  currentPage,
}) => {
  const { _id, friend } = chat;
  const messagesEndRef = useRef(null);
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Scroll to bottom when messages change and it's the latest page
  useEffect(() => {
    if (currentPage === 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  


  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mb-4">
          <button
            onClick={loadMoreMessages}
            disabled={loading}
            className="px-4 py-1 text-sm border rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load earlier messages"}
          </button>
        </div>
      )}

      {/* No Messages */}
      {messages.length === 0 && (
        <p className="text-center text-gray-400 mt-10">No messages yet</p>
      )}

      <AnimatePresence initial={false}>
        {messages.map((msg) => {
          const isSender = msg.sender === currentUser._id;

          return (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col max-w-xs mb-4 ${
                isSender ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              {/* Attachments */}
              {msg.attachments?.length > 0 && (
                <div className="mt-1 py-1 flex flex-wrap gap-2">
                  {msg.attachments.map((att) => (
                    <motion.div
                      key={att._id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.10 }}
                      className="w-30 max-w-full rounded-lg overflow-hidden border hover:shadow-md transition"
                    >
                      <RenderAttachment type={fileFormat(att.url)} url={att.url} />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Message Text */}
              {msg.content && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`px-4 py-2 rounded-xl text-sm shadow ${
                    isSender ? "bg-blue-600 text-white" : "bg-white border text-gray-800"
                  }`}
                >
                  {msg.content}
                </motion.div>
              )}

              {/* Timestamp */}
              <span className="text-xs text-gray-400 mt-1">
                {formatMessageTime(msg.createdAt)}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
