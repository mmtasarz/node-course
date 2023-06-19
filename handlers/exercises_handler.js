const asyncHandler = require("express-async-handler");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPromise = open({
  filename: "mydb.db",
  driver: sqlite3.Database,
});

const sqlInsertIntoExercises = 
`INSERT INTO Exercises (userId, exerciseId, duration, description, date)
VALUES(?,?,?,?,?)`;


exports.create_exercise = asyncHandler(async function (req, res) {
    const db = await dbPromise;
    const { duration, description, date } = req.body;

    if(!duration || !description ){
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Required data was not provided.');
      return;
    }

    const newExercise = {
      "userId": Number(req.params._id),
      "exerciseId": Math.floor(Math.random() * 100000),
      "duration": +duration,
      "description": description,
      "date": date ? date : new Date().toISOString().split('T')[0],
    }

    await db.run(sqlInsertIntoExercises, Object.values(newExercise),
      (error) => {
        if (error) {
          console.error(error.message);
        };

        console.log('A new exercise was created');
      });

    res.json(newExercise);
  });
