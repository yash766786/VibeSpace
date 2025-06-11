import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
// import PostPreview from "./PostPreview";

export default function CreatePostPage() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/") && !selected.type.startsWith("video/")) {
      toast.error("Only images and videos are allowed");
      return;
    }

    setFile(selected);
    setPreviewURL(URL.createObjectURL(selected));
  };

  const handlePost = async () => {
    if (!description.trim() || !file) return toast.error("All fields are required");

    // handle post logic here...
    toast.success("Post uploaded!");
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Toaster />
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Post</h2>

      <textarea
        placeholder="Write a caption..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full h-24 resize-none p-3 border rounded-lg focus:outline-none focus:ring focus:ring-violet-400 mb-4"
        maxLength={2200}
      />
      <p className="text-right text-sm text-gray-500 mb-4">{description.length}/2200</p>

      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="mb-4"
        placeholder="choose your mood"
      />

      {previewURL && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Post Preview</h3>
          <PostPreview
            description={description}
            fileURL={previewURL}
            fileType={file.type}
          />
        </div>
      )}

      <button
        onClick={handlePost}
        disabled={!description.trim() || !file}
        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
      >
        Post
      </button>
    </div>
  );
}


export function PostPreview({ description, fileURL, fileType }) {
  return (
    <div className="border rounded-lg shadow overflow-hidden bg-white">
      {fileType.startsWith("image/") ? (
        <img src={fileURL} alt="preview" className="w-full max-h-[400px] object-cover" />
      ) : (
        <video controls className="w-full max-h-[400px]">
          <source src={fileURL} />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="p-3">
        <p className="text-gray-800">{description}</p>
      </div>
    </div>
  );
}
