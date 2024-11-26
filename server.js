const express = require('express');
const app = express();
const db = require('./Model/db'); 
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/addActor', (req, res) => {
    const { firstName, lastName, role } = req.body;
    const sql = 'INSERT INTO Person (firstName, lastName, pay) VALUES (?, ?, ?)';
    db.run(sql, [firstName, lastName, 0], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error adding actor to Person table.' });
            console.error(err.message);
            return;
        }

        const personID = this.lastID; 
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

app.post('/updateEarnings', (req, res) => {
    const updateActorEarningsSQL = `
        UPDATE Actor
        SET amountEarned = (
            SELECT COALESCE(SUM(M.cost / (SELECT COUNT(*) FROM MovieActor WHERE MovieActor.movieID = M.movieID)), 0)
            FROM Movie M
            JOIN MovieActor MA ON M.movieID = MA.movieID
            WHERE MA.actorID = Actor.personID
        );
    `;

    const updateActressEarningsSQL = `
        UPDATE Actress
        SET amountEarned = (
            SELECT COALESCE(SUM(M.cost / (SELECT COUNT(*) FROM MovieActress WHERE MovieActress.movieID = M.movieID)), 0)
            FROM Movie M
            JOIN MovieActress MA ON M.movieID = MA.movieID
            WHERE MA.actressID = Actress.personID
        );
    `;

    db.run(updateActorEarningsSQL, [], (err) => {
        if (err) {
            console.error('Error updating actor earnings:', err.message);
            return res.status(500).json({ message: 'Failed to update actor earnings.' });
        }

        db.run(updateActressEarningsSQL, [], (err) => {
            if (err) {
                console.error('Error updating actress earnings:', err.message);
                return res.status(500).json({ message: 'Failed to update actress earnings.' });
            }

            res.json({ message: 'Earnings updated successfully for all actors and actresses.' });
        });
    });
});



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

app.get('/mostExpensiveMovie', (req, res) => {
    const { producerID } = req.query;
    const sql = `
        SELECT M.title AS Movie_Title, M.cost AS Cost
        FROM Movie M
        JOIN MovieProducer MP ON M.movieID = MP.movieID
        WHERE MP.producerID = ?
        ORDER BY M.cost DESC
        LIMIT 1;
    `;

    db.get(sql, [producerID], (err, row) => {
        if (err) {
            res.status(500).json({ message: 'Error retrieving most expensive movie.' });
            console.error(err.message);
        } else if (!row) {
            res.status(404).json({ message: 'No movies found for this producer.' });
        } else {
            res.json(row);
        }
    });
});


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

app.get('/actressNotInProducerMovies', (req, res) => {
    const { producerID } = req.query;

    if (!producerID) {
        return res.status(400).json({ message: 'Producer ID is required.' });
    }

    const sql = `
        SELECT DISTINCT P.firstName, P.lastName
        FROM Person P
        JOIN Actress A ON P.personID = A.personID
        LEFT JOIN MovieActor MA ON A.personID = MA.actorID
        LEFT JOIN MovieProducer MP ON MA.movieID = MP.movieID
        WHERE (MP.producerID != ? OR MP.producerID IS NULL);
    `;

    db.all(sql, [producerID], (err, rows) => {
        if (err) {
            console.error('Error retrieving actresses:', err.message);
            return res.status(500).json({ message: 'Database error.' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: `No actresses found not in movies produced by producer ${producerID}.` });
        }

        res.json({ actresses: rows });
    });
});

app.get('/highestEarningActor', (req, res) => {
    const sql = `
        SELECT firstName, lastName, amountEarned
        FROM Actor
        ORDER BY amountEarned DESC
        LIMIT 1;
    `;

    db.get(sql, [], (err, row) => {
        if (err) {
            console.error('Error retrieving highest earning actor:', err.message);
            return res.status(500).json({ message: 'Failed to retrieve highest earning actor.' });
        }

        if (!row) {
            return res.status(404).json({ message: 'No earnings data available for actors.' });
        }

        res.json(row);
    });
});


app.get('/highestEarningActress', (req, res) => {
    const sql = `
        SELECT firstName, lastName, amountEarned
        FROM Actress
        ORDER BY amountEarned DESC
        LIMIT 1;
    `;

    db.get(sql, [], (err, row) => {
        if (err) {
            console.error('Error retrieving highest earning actress:', err.message);
            return res.status(500).json({ message: 'Failed to retrieve highest earning actress.' });
        }

        if (!row) {
            return res.status(404).json({ message: 'No earnings data available for actresses.' });
        }

        res.json(row);
    });
});

app.get('/actorsAndActressesInMovie', (req, res) => {
    const { movieID } = req.query;

    if (!movieID) {
        return res.status(400).json({ message: 'Movie ID is required.' });
    }

    const sqlActors = `
        SELECT P.firstName, P.lastName
        FROM Actor A
        JOIN Person P ON A.personID = P.personID
        JOIN MovieActor MA ON A.personID = MA.actorID
        WHERE MA.movieID = ?;
    `;

    const sqlActresses = `
        SELECT P.firstName, P.lastName
        FROM Actress A
        JOIN Person P ON A.personID = P.personID
        JOIN MovieActress MA ON A.personID = MA.actressID
        WHERE MA.movieID = ?;
    `;

    db.all(sqlActors, [movieID], (err, actors) => {
        if (err) {
            console.error('Error retrieving actors:', err.message);
            return res.status(500).json({ message: 'Failed to retrieve actors.' });
        }

        db.all(sqlActresses, [movieID], (err, actresses) => {
            if (err) {
                console.error('Error retrieving actresses:', err.message);
                return res.status(500).json({ message: 'Failed to retrieve actresses.' });
            }

            res.json({
                movieID: movieID,
                actors: actors,
                actresses: actresses,
            });
        });
    });
});

app.get('/moviesBelowPrice', (req, res) => {
    const { price } = req.query;

    if (!price || isNaN(price)) {
        return res.status(400).json({ message: 'A valid price is required.' });
    }

    const sql = `
        SELECT movieID, title, cost
        FROM Movie
        WHERE cost < ?
        ORDER BY cost ASC;
    `;

    db.all(sql, [price], (err, rows) => {
        if (err) {
            console.error('Error retrieving movies:', err.message);
            return res.status(500).json({ message: 'Failed to retrieve movies below price.' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: `No movies found below price ${price}.` });
        }

        res.json({ movies: rows });
    });
});



app.get('/', (req, res) => {
    res.send('Server is working!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
