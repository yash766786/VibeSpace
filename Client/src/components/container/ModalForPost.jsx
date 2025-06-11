// ModalForPost.jsx
import React from "react";

const ModalForPost = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  description,
  setDescription,
}) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-base-300 p-6 rounded-lg w-full max-w-md shadow-lg relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 text-2xl"
        >
          &times;
        </button>

        {/* Modal Content */}
        <h3 className="font-bold text-lg mb-4">Edit Caption</h3>
        <textarea
          className="textarea textarea-bordered w-full mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button className="btn btn-success" onClick={onSave}>
            Save Changes
          </button>
          <button className="btn btn-error" onClick={handleDelete}>
            Delete Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalForPost;
