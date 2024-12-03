-- -- Create tables in proper order
-- CREATE TABLE Person (
--     personID INTEGER PRIMARY KEY AUTOINCREMENT,
--     lastName TEXT NOT NULL,
--     firstName TEXT NOT NULL,
--     pay REAL
-- );

-- CREATE TABLE Movie (
--     movieID INTEGER PRIMARY KEY AUTOINCREMENT,
--     title TEXT NOT NULL,
--     releaseDate DATE,
--     synopsis TEXT,
--     rating REAL,
--     length INTEGER, 
--     category TEXT
-- );

-- CREATE TABLE Producer (
--     producerID INTEGER PRIMARY KEY AUTOINCREMENT,
--     personID INTEGER NOT NULL,
--     position TEXT,
--     FOREIGN KEY (personID) REFERENCES Person(personID)
-- );

-- CREATE TABLE Actor (
--     actorID INTEGER PRIMARY KEY AUTOINCREMENT,
--     personID INTEGER NOT NULL,
--     role TEXT,
--     FOREIGN KEY (personID) REFERENCES Person(personID)
-- );

-- CREATE TABLE Actress (
--     actressID INTEGER PRIMARY KEY AUTOINCREMENT,
--     personID INTEGER NOT NULL,
--     role TEXT,
--     FOREIGN KEY (personID) REFERENCES Person(personID)
-- );

-- CREATE TABLE Writer (
--     writerID INTEGER PRIMARY KEY AUTOINCREMENT,
--     personID INTEGER NOT NULL,
--     contribution TEXT,
--     FOREIGN KEY (personID) REFERENCES Person(personID)
-- );

-- CREATE TABLE Director (
--     directorID INTEGER PRIMARY KEY AUTOINCREMENT,
--     personID INTEGER NOT NULL,
--     position TEXT,
--     FOREIGN KEY (personID) REFERENCES Person(personID)
-- );

-- CREATE TABLE MovieProducer (
--     movieID INTEGER NOT NULL,
--     producerID INTEGER NOT NULL,
--     PRIMARY KEY (movieID, producerID),
--     FOREIGN KEY (movieID) REFERENCES Movie(movieID),
--     FOREIGN KEY (producerID) REFERENCES Producer(producerID)
-- );

-- CREATE TABLE MovieActor (
--     movieID INTEGER NOT NULL,
--     actorID INTEGER NOT NULL,
--     PRIMARY KEY (movieID, actorID),
--     FOREIGN KEY (movieID) REFERENCES Movie(movieID),
--     FOREIGN KEY (actorID) REFERENCES Actor(actorID)
-- );

-- CREATE TABLE MovieActress (
--     movieID INTEGER NOT NULL,
--     actressID INTEGER NOT NULL,
--     PRIMARY KEY (movieID, actressID),
--     FOREIGN KEY (movieID) REFERENCES Movie(movieID),
--     FOREIGN KEY (actressID) REFERENCES Actress(actressID)
-- );

-- CREATE TABLE MovieWriter (
--     movieID INTEGER NOT NULL,
--     writerID INTEGER NOT NULL,
--     PRIMARY KEY (movieID, writerID),
--     FOREIGN KEY (movieID) REFERENCES Movie(movieID),
--     FOREIGN KEY (writerID) REFERENCES Writer(writerID)
-- );

-- CREATE TABLE MovieDirector (
--     movieID INTEGER NOT NULL,
--     directorID INTEGER NOT NULL,
--     PRIMARY KEY (movieID, directorID),
--     FOREIGN KEY (movieID) REFERENCES Movie(movieID),
--     FOREIGN KEY (directorID) REFERENCES Director(directorID)
-- );

-- -- Insert sample data
-- INSERT INTO Person (lastName, firstName, pay) VALUES ('Smith', 'John', 50000);
-- INSERT INTO Person (lastName, firstName, pay) VALUES ('Doe', 'Jane', 60000);

-- INSERT INTO Actor (personID, role) VALUES (1, 'Lead Actor');
-- INSERT INTO Actress (personID, role) VALUES (2, 'Supporting Actress');
----------------------------------------------------------------------------------
-- Kevins UPDATE STARTS HERE
----------------------------------------------------------------------------------
INSERT INTO Movie (title, releaseDate, synopsis, rating, length, category, producerID) 
VALUES ('Inception', '2010-07-16', 'A mind-bending thriller.', 8.8, 148, 'Released',4);
INSERT INTO Movie (title, releaseDate, synopsis, rating, length, category,producerID) 
VALUES ('Avatar', '2009-12-18', 'A sci-fi epic.', 7.9, 162, 'Coming Soon',5);

INSERT INTO MovieProducer (producerID,movieID) 
VALUES (4,8);
INSERT INTO MovieProducer (producerID,movieID) 
VALUES (5,9);

INSERT INTO MovieDirector (movieID, directorID) 
VALUES (9,1);
INSERT INTO MovieDirector (movieID,directorID) 
VALUES (9,2);

UPDATE Movie SET producerID = 1 WHERE movieID = 1;
UPDATE Movie SET producerID = 2 WHERE movieID = 2;
UPDATE Movie SET producerID = 3 WHERE movieID = 3;
UPDATE Movie SET producerID = 4 WHERE movieID = 4;
UPDATE Movie SET producerID = 5 WHERE movieID = 5;
UPDATE Movie SET producerID = 8, cost = 10497 WHERE movieID = 8;
UPDATE Movie SET producerID = 9, cost = 200505 WHERE movieID = 9;

UPDATE MovieProducer SET producerID = 1 WHERE movieID = 1;
UPDATE MovieProducer SET producerID = 2 WHERE movieID = 2;
UPDATE MovieProducer SET producerID = 3 WHERE movieID = 3;
UPDATE MovieProducer SET producerID = 4 WHERE movieID = 4;
UPDATE MovieProducer SET producerID = 5 WHERE movieID = 5;
UPDATE MovieProducer SET producerID = 8 WHERE movieID = 8;
UPDATE MovieProducer SET producerID = 9 WHERE movieID = 9;