// @ts-nocheck
const asyncHandler = require("express-async-handler");
const db = require('../db');
const {selectAllUsersFromDatabase} = require('../utils/utils');

const sqlInsertIntoUsers = `
INSERT INTO Users (username) VALUES(?)`;

exports.create_user = asyncHandler(async function (req, res) {
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
 
  const userId = new Promise(function(resolve, reject){
    db.run(sqlInsertIntoUsers, [newUsername], function( error) {
      if (error) {
        console.error(error.message);
        reject(error)
      }
      resolve(this.lastID);
    });
  })
 
  res.json({
      _id: await userId,
      username: req.body.username,
    });
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

