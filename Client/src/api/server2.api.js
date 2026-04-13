import { server2Form, server2Json } from "./server/server2Axios";

// chat
export const getMyChats = () => server2Json.get(`/chats/`);
export const findChat = (targetUserId) => server2Json.get(`/chats/find?targetUserId=${targetUserId}`);

// messages
export const getMessages = (chatId, page) => server2Json.get(`/messages/${chatId}?page=${page}`)
export const sendMessage = (chatId ,FormData) => server2Form.post(`/messages/${chatId}`, FormData)

// friendRequest
export const sendFriendRequest = (jsonData) => server2Json.post(`/friendRequests/new-request`,jsonData);
export const respondFriendRequest = (jsonData) => server2Json.post(`/friendRequests/respond-request`,jsonData);


// notification
export const fetchNotifications = () => server2Json.get(`/notifications/`);
export const markAllNotificationsSeen = () => server2Json.patch(`/notifications/mark-all-seen`);


// 🔵 Send message to Vibe
export const sendVibeMessage = (jsonData) =>
  server2Json.post(`/vibe/chat`, jsonData);

// 🟢 Get messages (with pagination)
export const getVibeMessages = (page = 1, limit = 20) =>
  server2Json.get(`/vibe/messages?page=${page}&limit=${limit}`);

// 🧠 Get user memory (for later use)
export const getVibeMemory = () =>
  server2Json.get(`/vibe/memory`);
