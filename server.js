const express = require('express');
const app = express();
const db = require('./Model/db'); // Database connection
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route to add an actor
app.post('/addActor', (req, res) => {
    const { firstName, lastName, role } = req.body;
    const sql = 'INSERT INTO Person (firstName, lastName, pay) VALUES (?, ?, ?)';
    db.run(sql, [firstName, lastName, 0], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error adding actor to Person table.' });
            console.error(err.message);
            return;
        }

        const personID = this.lastID; // Get inserted person ID
        const actorSql = 'INSERT INTO Actor (personID, role) VALUES (?, ?)';
        db.run(actorSql, [personID, role], function (err) {
            if (err) {
                res.status(500).json({ message: 'Error adding actor to Actor table.' });
                console.error(err.message);
            } else {
                res.json({ message: 'Actor added successfully!' });
            }
        });
    });
});

// Route to add a movie
app.post('/addMovie', (req, res) => {
    const { title, releaseDate, synopsis, rating, length, category } = req.body;
    const sql = 'INSERT INTO Movie (title, releaseDate, synopsis, rating, length, category) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(sql, [title, releaseDate, synopsis, rating, length, category], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error adding movie to the database.' });
            console.error(err.message);
        } else {
            res.json({ message: 'Movie added successfully!' });
        }
    });
});

// Route to move a movie to "Coming Soon"
app.post('/moveMovie', (req, res) => {
    const { movieID, status } = req.body;
    const sql = 'UPDATE Movie SET category = ? WHERE movieID = ?';
    db.run(sql, [status, movieID], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error updating movie status.' });
            console.error(err.message);
        } else {
            res.json({ message: 'Movie status updated successfully!' });
        }
    });
});

// Route to schedule a movie in two theatres
app.post('/scheduleMovie', (req, res) => {
    const { movieID, theatre1, theatre2 } = req.body;
    const sql = 'INSERT INTO MovieTheatre (movieID, theatreID) VALUES (?, ?), (?, ?)';
    db.run(sql, [movieID, theatre1, movieID, theatre2], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error scheduling movie in theatres.' });
            console.error(err.message);
        } else {
            res.json({ message: 'Movie scheduled in two theatres successfully!' });
        }
    });
});

// Route to list movies by a producer
app.get('/moviesByProducer', (req, res) => {
    const { producerID } = req.query;
    const sql = `
        SELECT M.title 
        FROM Movie M
        JOIN MovieProducer MP ON M.movieID = MP.movieID
        WHERE MP.producerID = ?;
    `;
    db.all(sql, [producerID], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Error retrieving movies by producer.' });
            console.error(err.message);
        } else {
            res.json({ data: rows });
        }
    });
});

// Route to list movies by a director
app.get('/moviesByDirector', (req, res) => {
    const { directorID } = req.query;
    const sql = `
        SELECT M.title 
        FROM Movie M
        JOIN MovieDirector MD ON M.movieID = MD.movieID
        WHERE MD.directorID = ?;
    `;
    db.all(sql, [directorID], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Error retrieving movies by director.' });
            console.error(err.message);
        } else {
            res.json({ data: rows });
        }
    });
});

// Route to find the most expensive movie produced by a producer
app.get('/mostExpensiveMovie', (req, res) => {
    const { producerID } = req.query;
    const sql = `
        SELECT M.title, MAX(P.pay) AS maxCost 
        FROM Movie M
        JOIN MovieProducer MP ON M.movieID = MP.movieID
        JOIN Producer P ON MP.producerID = P.producerID
        WHERE P.producerID = ?
        GROUP BY M.title;
    `;
    db.all(sql, [producerID], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Error retrieving most expensive movie.' });
            console.error(err.message);
        } else {
            res.json({ data: rows });
        }
    });
});

// Route to find movies produced in the same year
app.get('/moviesByYear', (req, res) => {
    const { year } = req.query;
    const sql = `
        SELECT title 
        FROM Movie 
        WHERE strftime('%Y', releaseDate) = ?;
    `;
    db.all(sql, [year], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Error retrieving movies by year.' });
            console.error(err.message);
        } else {
            res.json({ data: rows });
        }
    });
});

// Test route
app.get('/', (req, res) => {
    res.send('Server is working!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
