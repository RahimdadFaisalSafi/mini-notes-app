import { useState, useEffect } from "react";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";


function App() {
  const [notes, setNotes] = useState(() => {
    
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });


  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (text) => {
    const newNote = {
      id: Date.now(),
      text,
      date: new Date().toLocaleString(),
    };
    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-blue-500">
          <h1 className="text-xl font-bold text-white">Notes App</h1>
        </div>
        <div className="p-6">
          <NoteForm onAddNote={addNote} />
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
             My Notes
            </h2>
            <NoteList notes={notes} onDeleteNote={deleteNote} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
