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

function validateDate(date) {
  const regex = new RegExp(
    /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/
  );
  
  return regex.test(date) && date === new Date(date).toISOString().split("T")[0];
}

module.exports = {
  selectAllUsersFromDatabase,
  selectUserExercisesFromDatabase,
  validateDate,
};
