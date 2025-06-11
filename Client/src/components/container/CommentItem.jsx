import React, { useState } from "react";
import { FcLike } from "react-icons/fc";
import { CiHeart } from "react-icons/ci";
import { AiFillDelete } from "react-icons/ai"; // Import delete icon
import { useComment } from "../../context/CommentState";
import { useLike } from "../../context/LikeState";
import { useUser } from "../../context/UserState";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../utils/timeAgo";

function CommentItem({ comment, onDelete }) {
  const { _id, owner, isLikedByCurrentUser, likeCount, content, createdAt } = comment;

  const { user } = useUser();
  const navigate = useNavigate();
  const { deleteComment } = useComment();
  const { toggleCommentLike } = useLike();

  const [isLiked, setIsLikedByUser] = useState(isLikedByCurrentUser);
  const [totalLiked, setTotalLiked] = useState(likeCount);


  const toggleLikeComment = async () => {
    try {
      isLiked ? setTotalLiked(totalLiked - 1) : setTotalLiked(totalLiked + 1);
      setIsLikedByUser(!isLiked);
      //   setTotalLiked(100);

      const response = await toggleCommentLike(_id);
      // checking the response
      if (response && !response.success) {
        isLiked ? setTotalLiked(totalLiked - 1) : setTotalLiked(totalLiked + 1);
        setIsLikedByUser(!isLiked);
      }
      // console.log(response);
    } catch (error) {
      // console.log("Error toggling like:", error);
    }
  };

  const handleProfileNavigation = (username) => {
    navigate(`/u/${username}`);
  };

  

  const handleDeleteComment = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const response = await deleteComment(_id);
        if (response && response.success) {
          // console.log("Comment deleted successfully.");
          onDelete(_id); // Notify the parent to remove the comment
        }
      } catch (error) {
        // console.log("Error while deleting comment", error);
      }
    }
  };

  return (
    <div className="flex items-start gap-3">
      <img
        src={owner.avatar}
        alt={`${owner.username}'s avatar`}
        className="w-8 h-8 rounded-full cursor-pointer"
        onClick={() => handleProfileNavigation(owner.username)}
      />
      <div>
        <p className="text-gray-600">
          <span
            className="text-gray-200 font-semibold cursor-pointer"
            onClick={() => handleProfileNavigation(owner.username)}
          >
            @{owner.username}
          </span>
          <span className="text-gray-400 mx-2">{content}</span>
        </p>
        {/* Display time ago */}
        <p className="text-sm text-gray-400">{timeAgo(createdAt)}</p>
        <div className="flex items-center gap-1">
          {/* <FaHeart className="text-red-500" /> */}
          {isLiked ? (
            <FcLike
              onClick={toggleLikeComment}
              className="size-6 cursor-pointer"
            />
          ) : (
            <CiHeart
              onClick={toggleLikeComment}
              className="size-6 cursor-pointer"
            />
          )}
          <span>{totalLiked}</span>

          {/* Show delete button only if the comment belongs to the current user */}
          {user?.username === owner.username && (
            <AiFillDelete
              onClick={handleDeleteComment}
              className="ml-6 text-white-500 cursor-pointer"
              title="Delete comment"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
