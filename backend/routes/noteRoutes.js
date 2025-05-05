const express = require('express');
const router = express.Router();

let notes = []

// Test
router.get('/', (req, res) => {
    res.send('API is running...');
}
);

// Get all notes
router.get('/notes', async (req, res) => {
    try {
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes' });
    }
}
);

// Add a new note
router.post('/notes', async (req, res) => {
    const {text} = req.body;
    console.log(text);
    try {
        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Note text is required' });
        }
        const newNote = {
            id: Date.now(),
            text,
            date: new Date().toLocaleString(),
        }
        notes.unshift(newNote);
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: 'Error adding note' });
    }
}
);

// Delete a note
router.delete('/notes/:id', async (req, res) => {
    try{
        const noteId = parseInt(req.params.id);
        const  initialLength = notes.length;
        notes = notes.filter(note => note.id !== noteId);
        if (notes.length === initialLength) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(204).json({ message: 'Note deleted successfully' });
    } catch (error) {   
        res.status(500).json({ message: 'Error deleting note' });
    }
}
);

module.exports = router;


