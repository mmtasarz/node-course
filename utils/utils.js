const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPromise = open({
  filename: "mydb.db",
  driver: sqlite3.Database,
});

async function selectAllUsersFromDatabase() {
  const db = await dbPromise;
  const users = await db.all(`SELECT * FROM Users`);
  if (users) {
    return users;
  }
}

async function selectUserExercisesFromDatabase(
  id,
  fromDate = null,
  toDate = null,
  limit = null
) {
  const db = await dbPromise;
  let selectUserExercises = `
      SELECT 
      *,
       COUNT(*) OVER() AS countLogs
      FROM 
        Exercises
      WHERE
        userId=?
        `;

  if (fromDate || toDate) {
    if (fromDate && toDate) {
      selectUserExercises += `
            AND
              DATE(date) BETWEEN '${fromDate}' AND '${toDate}'
          `;
    }

    if (fromDate && !toDate) {
      selectUserExercises += `
          AND
            DATE(date) >= '${fromDate}'
        `;
    }

    if (toDate && !fromDate) {
      selectUserExercises += `
          AND
            DATE(date) <= '${toDate}'
        `;
    }

    selectUserExercises += `
        ORDER BY 
          Exercises.date ASC
        `;
  }

  if (limit) {
    selectUserExercises += ` LIMIT ${limit}`;
  }

  const logs = await db.all(selectUserExercises, id);

  if (logs) {
    return logs;
  }
}

module.exports = {
  selectAllUsersFromDatabase,
  selectUserExercisesFromDatabase,
};
