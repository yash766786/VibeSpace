import { useSelector, useDispatch } from "react-redux";
// import { markAllNotificationsSeen } from "../../api/server2.api"; // Your API call
// import { markAsSeen } from "../redux/reducer/notificationSlice";
import { useState } from "react";
import { formatMessageTime } from "../../utils/formatMessageTime";
import toast from "react-hot-toast";
import {
  markAllNotificationsSeen,
  respondFriendRequest,
} from "../../api/server2.api";
import {
  markAllSeen,
  removeNotification,
} from "../../redux/reducer/notificationSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const NotificationModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification);
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch or allow time for Redux to sync
    const timeout = setTimeout(() => setLoading(false), 800); // 800ms delay
    return () => clearTimeout(timeout);
  }, []);

  // const

  const handleNotificationClick = async (notificationId) => {
    try {
      setLoadingId(notificationId);
      await markAllNotificationsSeen(notificationId);
      dispatch(markAllSeen(notificationId));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  const handleAccept = async (requestId, notificationId) => {
    try {
      const { data } = await respondFriendRequest({ requestId, accept: true });
      dispatch(removeNotification(notificationId)); // _id of the original invite
      toast.success("Chat request accepted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Accept failed");
    }
  };

  const handleReject = async (requestId, notificationId) => {
    try {
      const { data } = await respondFriendRequest({ requestId, accept: false });
      dispatch(removeNotification(notificationId));
      toast.success("Chat request rejected");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Reject failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-inherit bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md max-h-[80vh] rounded-lg shadow-lg overflow-y-auto p-4 relative">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <button
          onClick={() => {
            onClose(), handleNotificationClick();
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* {notifications.length === 0 ? (
          <p className="text-center text-gray-500">No notifications</p>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n._id}
              notification={n}
              loadingId={loadingId}
              handleAccept={handleAccept}
              handleReject={handleReject}
              formatMessageTime={formatMessageTime}
              onClose={onClose}
            />
          ))
        )} */}

        {loading ? (
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-500">No notifications</p>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n._id}
              notification={n}
              loadingId={loadingId}
              handleAccept={handleAccept}
              handleReject={handleReject}
              formatMessageTime={formatMessageTime}
              onClose={onClose}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationModal;

const NotificationItem = ({
  notification,
  loadingId,
  handleAccept,
  handleReject,
  formatMessageTime,
  onClose
}) => {
  const user = notification?.metadata?.user;
  const navigate = useNavigate()
  const handleProfileNavigation = (username) => {
    navigate(`/${username}`);
    onClose();
  };

  return (
    <div
      key={notification._id}
      className={`flex gap-3 items-start p-3 rounded mb-3 border cursor-pointer ${
        !notification.seen
          ? "bg-blue-100 border-blue-300"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Avatar */}
      <img
        src={user?.avatar?.url}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover"
        onClick={() => handleProfileNavigation(user?.username)}
      />

      {/* Text Content */}
      <div className="flex-1">
        <p
          className="text-sm font-medium text-gray-800"
          onClick={() => handleProfileNavigation(user?.username)}
        >
          {user?.username}
        </p>
        <p className="text-sm text-gray-600">
          {notification.content || "New notification"}
        </p>
        <p className="text-xs text-gray-500">
          {formatMessageTime(notification.createdAt)}
        </p>

        {/* Accept/Reject Buttons for CHAT_INVITATION_REQUEST */}
        {notification.type === "CHAT_INVITATION_REQUEST" && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={() =>
                handleAccept(notification.metadata.requestId, notification._id)
              }
              className="text-sm px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={() =>
                handleReject(notification.metadata.requestId, notification._id)
              }
              className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        )}

        {/* Seen Loader */}
        {!notification.seen && loadingId === notification._id && (
          <p className="text-xs text-blue-500 mt-1">Marking as seen...</p>
        )}
      </div>
    </div>
  );
};

const NotificationSkeleton = () => (
  <div className="flex gap-3 items-start p-3 rounded mb-3 border bg-gray-100 animate-pulse">
    <div className="w-10 h-10 bg-gray-300 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="w-24 h-4 bg-gray-300 rounded" />
      <div className="w-full h-3 bg-gray-200 rounded" />
      <div className="w-16 h-3 bg-gray-200 rounded" />
    </div>
  </div>
);
