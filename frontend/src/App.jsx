import { useState, useEffect } from "react";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }
        const data = await response.json();
        setNotes(data);
        setError(null);
      } catch (err){
        setError("Failed to fetch notes");
        console.log(err);
      } 
      finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const addNote = async (text) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
    } catch (error) {
      console.error("Error adding note:", error);
      setError("Failed to add note");
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      setError("Failed to delete note. Please try again.");
      console.error("Error deleting note:", err);
    }
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