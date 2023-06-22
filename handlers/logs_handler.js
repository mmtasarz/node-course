// @ts-nocheck
const asyncHandler = require("express-async-handler");
const {
  selectAllUsersFromDatabase,
  selectUserExercisesFromDatabase,
  validateDate
} = require("../utils/utils");

exports.get_logs = asyncHandler(async function (req, res) {
  const userId = +req.params._id;
  let results = await selectUserExercisesFromDatabase(userId);
  const usersList = await selectAllUsersFromDatabase();
  const user = usersList?.find((user) => user._id === userId);
  const { from, to, limit } = req.query;
  try {
    if (!results || results.count === 0) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("There are no logged exercises from this user.");
      return;
    }

    if (!user) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("User with given id does not exist.");
      return;
    }

    if(from || to || limit){
      if(from && !validateDate(from)){
        res.writeHead(422, { "Content-Type": "text/plain" });
        res.end("Wrong from date value. Please provide date in YYYY-MM-DD format.");
        return;
      }

      if(to && !validateDate(to)){
        res.writeHead(422, { "Content-Type": "text/plain" });
        res.end("Wrong to date value. Please provide date in YYYY-MM-DD format.");
        return;
      }

      if(limit && !Number(limit)){
        res.writeHead(422, { "Content-Type": "text/plain" });
        res.end("Limit has to be a numeric value");
        return;
      }

      results = await selectUserExercisesFromDatabase(userId, from, to, limit);
    }

    res.json({
      username: user.username,
      _id: userId,
      logs: results?.map((row) => {
        return {
          id: row.exerciseId,
          description: row.description,
          duration: row.duration,
          date: row.date,
        };
      }),
      count: results[0].countLogs,
    });
  } catch (error) {
    console.error(error.message);
  }
});
