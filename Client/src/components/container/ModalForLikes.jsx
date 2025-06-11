// ModalForLikes.jsx
import React from "react";
import { useNavigate } from "react-router-dom";


const ModalForLikes = ({ isOpen, onClose, likes, timeAgo }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleProfileNavigation = (username) => {
    navigate(`/u/${username}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-300 p-6 rounded-lg w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Liked by</h2>
        <div className="overflow-y-auto max-h-60">
          {likes && likes.length > 0 ? ( // Check if likes is a valid array and has items
            likes.map((like) => (
              <div
                key={like._id}
                className="flex items-center mb-3 cursor-pointer"
                onClick={() => handleProfileNavigation(like.likedBy.username)}
              >
                <img
                  src={like.likedBy.avatar}
                  alt={like.likedBy.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold">{like.likedBy.fullname}</p>
                  <p className="text-gray-600">
                    @{like.likedBy.username}
                    <span className="text-sm text-gray-400 ml-7">
                      {timeAgo(like.createdAt)}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No likes to display</p> // Message for empty or undefined likes array
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalForLikes;
