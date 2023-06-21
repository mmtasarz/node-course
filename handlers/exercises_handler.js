const asyncHandler = require("express-async-handler");
const { selectAllUsersFromDatabase } = require("../utils/utils");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const util = require("util");

const dbPromise = open({
  filename: "mydb.db",
  driver: sqlite3.Database,
});

const sqlInsertIntoExercises = `INSERT INTO Exercises (userId, exerciseId, duration, description, date)
VALUES(?,?,?,?,?)`;

exports.create_exercise = asyncHandler(async function (req, res) {
  const db = await dbPromise;
  const allUsers = await selectAllUsersFromDatabase();
  const { duration, description, date } = req.body;
  const userId = Number(req.params._id);
  const exerciseDate = date ? date : new Date().toISOString().split("T")[0];

  if (!allUsers?.find((user) => user._id === userId)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Cannot create exercise for not existing user.");
    return;
  }

  if (!duration || !description) {
    const message = duration
      ? "Description has to be provided."
      : "Duration has to be provided.";
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(message);
    return;
  }

  if (!validateDate(exerciseDate)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(
      "Wrong date format. Please provide date using correct format - YYYY-MM-DD."
    );
    return;
  }

  const newExercise = {
    userId: userId,
    exerciseId: Math.floor(Math.random() * 100000),
    duration: +duration,
    description: description,
    date: exerciseDate,
  };

  await db.run(sqlInsertIntoExercises, Object.values(newExercise), (error) => {
    if (error) {
      console.error(error.message);
    }

    console.log("A new exercise was created");
  });

  res.json(newExercise);
});

function validateDate(date) {
  const regex = new RegExp(
    /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/
  );
  return regex.test(date);
}
