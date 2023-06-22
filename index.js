// @ts-nocheck
const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();
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

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});