const express = require('express');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', noteRoutes);
app.use((req, res,) => {
    res.status(500).json({ message: 'Internal Server Error' });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});