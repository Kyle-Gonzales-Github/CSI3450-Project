-- CREATE TABLE Actors (firstname TEXT, lastname TEXT, moviesActedIn INT);
-- INSERT INTO Actors (firstname, lastname, moviesActedIn) VALUES ("Alex", "G", 4);
-- Create the database
-- CREATE DATABASE IF NOT EXISTS movieDB;
-- USE movieDB;

-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS Movies;
DROP TABLE IF EXISTS Producers;
DROP TABLE IF EXISTS Actors;
DROP TABLE IF EXISTS Actresses;
DROP TABLE IF EXISTS Persons;
DROP TABLE IF EXISTS Writers;
DROP TABLE IF EXISTS Directors;

-- Create Producers Table
CREATE TABLE Producers (
    producerID INT PRIMARY KEY AUTO_INCREMENT,
    position VARCHAR(50)
);

-- Create Movies Table
CREATE TABLE Movies (
    movieID INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    releaseDate DATE,
    synopsis TEXT,
    rating VARCHAR(10),
    length INT,
    category VARCHAR(50),
    producerID INT,
    FOREIGN KEY (producerID) REFERENCES Producers(producerID)
);

Create Actors Table
    CREATE TABLE Actors (
    actorID INT PRIMARY KEY AUTO_INCREMENT,
    role VARCHAR(255),
    movieID INT,
    FOREIGN KEY (movieID) REFERENCES Movies(movieID)
);

