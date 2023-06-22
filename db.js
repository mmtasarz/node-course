const sqlite3 = require("sqlite3").verbose();
const path = require('path');

const DB_PATH = path.join(__dirname,"mydb.db");

const db = new sqlite3.Database(DB_PATH);


  db.run(`CREATE TABLE IF NOT EXISTS Users(
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    username STRING
    )`, []
  );
  
  db.run(`CREATE TABLE IF NOT EXISTS Exercises (
    userId INTEGER,
    exerciseId INTEGER,
    duration INTEGER,
    description STRING,
    date STRING
  )`, []);

  module.exports = db;