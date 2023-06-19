
CREATE TABLE IF NOT EXISTS Users(
  _id INTEGER PRIMARY KEY,
  username STRING
  );

CREATE TABLE IF NOT EXISTS Exercises (
  userId INTEGER,
  exerciseId INTEGER,
  duration INTEGER,
  description STRING,
  date STRING
);