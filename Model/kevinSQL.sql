UPDATE Actress
SET amountEarned = (
    SELECT COALESCE(SUM(M.cost / (SELECT COUNT(*) FROM MovieActress WHERE MovieActress.movieID = M.movieID)), 0)
    FROM Movie M
    JOIN MovieActress MA ON M.movieID = MA.movieID
    WHERE MA.actressID = Actress.personID
);
