import { server2Json } from "./server/server2Axios";

// chat
export const getMyChats = () => server2Json.get(`/chats/`);
export const findChat = (targetUserId) => server2Json.get(`/chats/find?targetUserId=${targetUserId}`);

// messages

// friendRequest
export const sendFriendRequest = (jsonData) => server2Json.post(`/friendRequests/new-request`,jsonData);
export const respondFriendRequest = (jsonData) => server2Json.post(`/friendRequests/respond-request`,jsonData);


// notification
export const fetchNotifications = () => server2Json.get(`/notifications/`);
export const markAllNotificationsSeen = () => server2Json.patch(`/notifications/mark-all-seen`);




// router.get("/", fetchNotifications);
// router.patch("/mark-all-seen", markAllNotificationsSeen);