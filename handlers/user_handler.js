// @ts-nocheck
const asyncHandler = require("express-async-handler");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const {selectAllUsersFromDatabase} = require('../utils/utils');

const dbPromise = open({
  filename: "mydb.db",
  driver: sqlite3.Database,
});

const sqlInsertIntoUsers = `INSERT INTO Users (_id, username) VALUES(?,?)`;

exports.create_user = asyncHandler(async function (req, res) {
  const db = await dbPromise;
  const allExistingUsers = await selectAllUsersFromDatabase();
  const newUsername = req.body.username;

  if (
    allExistingUsers &&
    allExistingUsers.find((user) => user.username === newUsername)
  ) {
    return res.send(
      "<p>This username is already taken. Please choose different username.</p>"
    );
  }
  if (newUsername.length === 0) {
    return res.send("<p>Username cannot be empty.</p>");
  }

  const newUser = {
    _id: Math.floor(Math.random() * 1e9),
    username: req.body.username,
  };

  await db.run(sqlInsertIntoUsers, [newUser._id, newUser.username], (error) => {
    if (error) {
      console.error(error.message);
    }

    console.log("A new row was created");
  });
  res.json(newUser);
});

exports.get_users = asyncHandler(async function (req, res) {
  const users = await selectAllUsersFromDatabase();
  try {
    if (!users || users.length === 0) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("There are no users in the database.");
      return;
    }
    res.json(users);
  } catch (error) {
    console.error(error.message);
  }
});

