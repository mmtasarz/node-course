// @ts-nocheck
const express = require("express");
const app = express();

const sqlite3 = require("sqlite3");
const cors = require("cors");
require("dotenv").config();
const { open } = require("sqlite");
const bodyParser = require("body-parser");
const routes = require('./routes/routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.static("public"));

app.use("/", routes);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const dbPromise = open({
  filename: "mydb.db",
  driver: sqlite3.Database,
  
});


const setup = async () => {
  const db = await dbPromise;
  await db.migrate([]);
  const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
};

setup();
