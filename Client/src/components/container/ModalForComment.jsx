import React, { useEffect, useState } from "react";
import { CommentItem } from "../index.js";
// import { useComment } from "../../context/CommentState.jsx";

const ModalForComments = ({
  isOpen,
  onClose,
  comments,
  commentContent,
  setCommentContent,
  handleAddComment,
  onDelete
}) => {

  // const { deleteComment } = useComment();

  // const handleDeleteComment = async (commentId) => {
  //   if (window.confirm("Are you sure you want to delete this comment?")){
  //     try {
  //       const response = await deleteComment(commentId);
  //     } catch (error) {
  //       // console.log("Error while deleting comment", error);
        
  //     }
  //   }
  // }
  if (!isOpen) return null;
  // console.log("comment section.", comments);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-base-300 p-4 rounded-lg w-11/12 md:w-1/2 relative">

        {/* Comments Section */}
        <div className="mt-6">
          <input
            type="text"
            className="input input-bordered w-full mb-2"
            placeholder="Add a comment..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <button
            className="btn btn-success btn-sm mb-2"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>

        {/* Cross icon to close modal */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Comments</h2>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={onDelete}
              // handleDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalForComments;
