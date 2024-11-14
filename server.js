const express = require('express');
const app = express();
const db = require('./Model/db'); // import the database connection
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.static('public')); // Serve static files from the "public" directory

// Route to retrieve all data from the Actors table
app.get('/data', (req, res) => {
    db.all('SELECT * FROM Actors', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            data: rows
        });
    });
});

// Route to add a new row to the Actors table
app.post('/add-row', (req, res) => {
    const { firstname, lastname, moviesActedIn } = req.body;

    const sql = 'INSERT INTO Actors (firstname, lastname, moviesActedIn) VALUES (?, ?, ?)';
    db.run(sql, [firstname, lastname, moviesActedIn], function(err) {
        if (err) {
            res.status(500).json({ message: 'Error adding data to database.' });
            console.error(err.message);
        } else {
            res.json({ message: 'Data added successfully!' });
        }
    });
});

// Test root route to check if server is working
app.get('/', (req, res) => {
    res.send('Server is working!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
