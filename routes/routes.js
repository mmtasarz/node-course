const express = require("express");
const router = express.Router();

const { create_exercise } = require("../handlers/exercises_handler");
const { get_logs } = require("../handlers/logs_handler");
const { create_user, get_users } = require("../handlers/user_handler");


const EXERCISES_PATH = "/api/users/:_id/exercises";
const LOGS_PATH = `/api/users/:_id/logs`;
const USERS_PATH = "/api/users";


router.route(USERS_PATH).post(create_user).get(get_users);

router.post(EXERCISES_PATH, create_exercise);

router.get(LOGS_PATH, get_logs);

module.exports = router;