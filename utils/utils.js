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


  async function selectUserExercisesFromDatabase(id, fromDate=null, toDate=null, limit=null) {
    const db = await dbPromise;
    let  selectUserExercises =`
      SELECT 
        * 
      FROM 
        Exercises
      WHERE
        userId=?
        `;

      if(fromDate && toDate){
        selectUserExercises +=  `
          AND
            DATE(date) BETWEEN '${fromDate}' AND '${toDate}'
        `;
      }
  
      if(limit){
        selectUserExercises += ` LIMIT ${limit}`;
      }
  
      const logs = await db.all(selectUserExercises, id);

      if(logs){
        return logs;
      }
    }

   module.exports = {selectAllUsersFromDatabase, selectUserExercisesFromDatabase};