import { useState } from "react";
const NoteForm = ({ onAddNote }) => {
  const [noteText, setNoteText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (noteText.trim().length > 0) {
      onAddNote(noteText);
      setNoteText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-4">
        <label
          htmlFor="note"
          className="block text-gray-700 text-sm font-medium mb-2"
        >
          Note:
        </label>
        <textarea
          id="note"
          value={noteText}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Write your note here..."
          onChange={(e) => setNoteText(e.target.value)}
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Save Note
      </button>
    </form>
  );
};

export default NoteForm;
