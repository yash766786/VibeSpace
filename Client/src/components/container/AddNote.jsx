import React, { useState } from "react";
import { useNote } from "../../context/NoteState.jsx";
import { useAlert } from "../../context/AlertState.jsx";

function AddNote() {
  const { showAlert } = useAlert();
  const { addNote } = useNote();

  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState({
    title: "",
    description: "",
    theme: "black", // Default theme
  });

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await addNote(note.title, note.description, note.theme);

    if (response.success) {
      showAlert(response.message, "success");
    } else {
      showAlert(response.message, "danger");
    }

    setIsLoading(false);
    setNote({
      title: "",
      description: "",
      theme: "black", // Reset to default theme
    });
  };

  return (
    <form>
      <h1 className="text-3xl lg:text-5xl font-bold text-primary mb-4 text-center">
        Create Your Personal Note
      </h1>

      {/* Title Input */}
      <div className="mb-4">
        <textarea
          type="text"
          className="textarea textarea-bordered h-auto w-full text-2xl font-medium lg:text-[28px]"
          id="title"
          name="title"
          placeholder="Title"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          required
        />
      </div>

      {/* Description Input */}
      <div className="mb-4">
        <textarea
          type="text"
          className="textarea textarea-bordered h-[57vh] lg:h-96 w-full text-xl lg:text-[20px]"
          id="description"
          name="description"
          placeholder="Description"
          value={note.description}
          onChange={(e) => setNote({ ...note, description: e.target.value })}
          required
        />
      </div>

      {/* Theme Selection */}
      <div className="mb-4">
        <label className="block font-medium text-lg mb-2">Select Theme:</label>
        <div className="flex flex-wrap gap-4">
          {["black", "blue", "green", "red", "yellow", "purple"].map((color) => (
            <label key={color} className="flex items-center gap-2">
              <input
                type="radio"
                name="theme"
                value={color}
                checked={note.theme === color}
                onChange={(e) => setNote({ ...note, theme: e.target.value })}
                className="radio radio-primary"
              />
              <span className={`text-${color}-500 capitalize`}>{color}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div>
        {isLoading ? (
          <button
            type="submit"
            className="btn btn-primary w-full text-base"
            onClick={handleClick}
            disabled
          >
            <span className="loading loading-dots loading-md"></span>
          </button>
        ) : (
          <button
            type="submit"
            className="btn btn-primary w-full text-base"
            onClick={handleClick}
            disabled={note.title.length === 0 || note.description.length === 0}
          >
            Add
          </button>
        )}
      </div>
    </form>
  );
}

export default AddNote;
