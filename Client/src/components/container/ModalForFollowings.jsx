import React from "react";
import { useNavigate } from "react-router-dom";

const ModalForFollowings = ({ isOpen, onClose, userFollowings }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleProfileNavigation = (username) => {
    navigate(`/u/${username}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-300 p-6 rounded-lg w-full max-w-md shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          &times;
        </button>

        {/* Modal Header */}
        <h2 className="text-lg font-semibold mb-4">Following</h2>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-60">
          {userFollowings && userFollowings.length > 0 ? (
            userFollowings.map((following) => (
              <div
                key={following._id}
                className="flex items-center mb-3 cursor-pointer"
                onClick={() => handleProfileNavigation(following.following.username)}
              >
                <img
                  src={following.following.avatar}
                  alt={following.following.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold">{following.following.fullname}</p>
                  <p className="text-gray-600">
                    @{following.following.username}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No followings to display</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalForFollowings;
