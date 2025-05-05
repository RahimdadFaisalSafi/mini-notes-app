const NoteList = ({ notes, onDeleteNote }) => {
  if (notes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        <p>No notes available. Start adding some!</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-gray-50 rounded-lg p-4  border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <p className="text-gray-800 whitespace-pre-wrap break-words">
              {note.text}
            </p>
            <button
              onClick={() => onDeleteNote(note.id)}
              className="ml-2 text-red-500 hover:text-red-700"
              aria-label="Delete note"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-2">{note.date}</p>
        </div>
      ))}
    </div>
  );
};

export default NoteList;