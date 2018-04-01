'use strict';

const mysql = require('mysql2/promise');
const config = require('./config.json');

let mysqlConn = null;

//Handles MySQL Database connections
async function mysqlConnection()
{
  if (mysqlConn)
  {
    return mysqlConn;
  }
  else {
    //Make a new connection and return it
    mysqlConn = newMysqlConnection();
    return mysqlConn;
  }
}

//Creates a MySQL Database connection
async function newMysqlConnection() {
  //Create MySQL connection using the settings from the config
  const newMysqlConn = await mysql.createConnection(config.mysql);
  return newMysqlConn;
}

//Runs MySQL Select Queries and returns results
async function mysqlSelect(queryStr,queryVars){
  try {
  const sqlConnection = await mysqlConnection();
  //format the query to avoid SQL Injection
  const newQuery = sqlConnection.format(queryStr,queryVars);
  let [results, fields] = await sqlConnection.execute(newQuery)
  return results;
  }
  catch (error){
    console.log("SQL Failure:", error);
    return null;
  }
}

//Runs MySQL Insert Queries and returns whether the query was successful
async function mysqlInsert(queryStr,queryVars){
  try {
  const sqlConnection = await mysqlConnection();
  const newQuery = sqlConnection.format(queryStr,queryVars);
  await sqlConnection.query(newQuery)
  return true;
  }
  catch (error){
    console.log("SQL Failure:",error);
    return false;
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
