// @ts-nocheck
const asyncHandler = require("express-async-handler");
const {selectAllUsersFromDatabase, selectUserExercisesFromDatabase} = require('../utils/utils');


exports.get_logs = asyncHandler (async function (req, res) {
    const userId = +req.params._id;
    let results = await selectUserExercisesFromDatabase(userId);
    const usersList = await selectAllUsersFromDatabase();
    const user = usersList?.find(user => user._id === userId);
    const {from, to, limit} = req.query;
    try{
      if(!results || results.length === 0){
         res.writeHead(404, { 'Content-Type': 'text/plain' });
         res.end('There are no logged exercises from this user.');
         return;
      }
  
      if(!user){
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('User with given id does not exist.');
         return;
      }
  
      if(req.query && from && to){
        results = await selectUserExercisesFromDatabase(userId, from, to, limit);
      }
  
      res.json({
        username: user.username,
        _id: userId,
        logs:results?.map(row => {
          return {
            id: row.exerciseId,
            description: row.description,
            duration: row.duration,
            date: row.date
          }
        }),
        count: results?.length,
      });
     
    }catch(error){ 
      console.error(error.message);
    }
  })
  
  