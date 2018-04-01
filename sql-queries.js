'use strict';

const mysql = require('mysql2/promise');
const config = require('./config.json');

let mysqlConn = null;

async function mysqlConnection() //Handles MySQL Database connections
{
  if (mysqlConn) //If a connection already exists
  {
    return mysqlConn; //Return the existing connection
  }
  else { //Else if no connection exists
    mysqlConn = newMysqlConnection(); //Make a new connection
    return mysqlConn; //Return the new connection
  }
}

async function newMysqlConnection() { //Creates a MySQL Database connection
  const newMysqlConn = await mysql.createConnection(config.mysql); //Create MySQL connection using the settings from the config
  return newMysqlConn; //Return the new connection
}

async function mysqlSelect(queryStr,queryVars){ //Runs MySQL Select Queries and returns results
  try {
  const sqlConnection = await mysqlConnection(); //get the connection
  const newQuery = sqlConnection.format(queryStr,queryVars); //format the query to avoid SQL Injection
  let [results, fields] = await sqlConnection.execute(newQuery) //run query
  return results; //return results
  }
  catch (error){
    console.log(error);
    return null; //return null as an SQL error was encountered trying to select
  }
}

async function mysqlInsert(queryStr,queryVars){ //Runs MySQL Insert Queries and returns whether the query was successful
  try {
  const sqlConnection = await mysqlConnection(); //get the connection
  const newQuery = sqlConnection.format(queryStr,queryVars); //format the query to avoid SQL Injection
  await sqlConnection.query(newQuery) //run query
  return true; //return true as any errors would drop to the catch statement below
  }
  catch (error){
    console.log("\x1b[31mSQL Failure:\n\x1b[37m%s\x1b[0m",error); //catch SQL errors and print to console in colour
    return false; //return false as there was an SQL error
  }
}

async function addUser(userID) {
    const Query = await mysqlSelect('SELECT ID FROM User WHERE googleToken = ?;',userID);
      if (Query==""){
        await mysqlInsert('INSERT INTO User(googleToken) VALUES (?);', userID);
        console.log('User added to database');
      }
      else {
        console.log('User (%s) Already exists.',userID);
        return;
      }
}

async function addUnit(unitName, userID, unitColour) {
  unitColour = '#' + unitColour;
  const Query = await mysqlInsert('INSERT IGNORE INTO Unit(userID, unitname, colour) VALUES((SELECT ID FROM User WHERE googleToken = ?), ?, ?);', [userID, unitName, unitColour]);
  console.log('Unit ' + unitName + ' Added to database.');
}

async function addWeek(userID, unitname, weekDesc) {
  const Query = await mysqlInsert('INSERT IGNORE INTO Week(userID, unitID, weekDesc) VALUES ((SELECT ID FROM User WHERE googleToken = ?), (SELECT id FROM Unit WHERE unitname = ? AND userID = (SELECT ID FROM User WHERE googleToken = ?)), ?);', [userID, unitname, userID, weekDesc]);
  console.log('Week added to db');
}

async function getUnits(googleID) {
  return await mysqlSelect('SELECT unitname, colour FROM Unit WHERE userID = (SELECT ID FROM User WHERE googleToken = ?);', googleID);
}

async function getWeeks(userID, unitID) {
  return await mysqlSelect('SELECT weekDesc FROM Week WHERE userID = (SELECT ID FROM User WHERE googleToken = ?) AND unitID = (SELECT id FROM Unit WHERE unitname = ? AND userID = (SELECT ID FROM User WHERE googleToken = ?));', [userID, unitID, userID]);
}

module.exports = {
  addUser: addUser,
  addUnit: addUnit,
  getUnits: getUnits,
  getWeeks: getWeeks,
  addWeek: addWeek
}
