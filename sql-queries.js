'use strict';

const mysql = require('mysql2/promise');

const config = require('./config.json');


async function getUnitLength() {
  const sql = await init();
  const [rows] = await sql.query('SELECT COUNT(*) AS count FROM unit_list');
  shutDown();
  return Number(rows[0].count);
}

async function listUnits() {
  const sql = await init();

  const query = 'SELECT id, unitname FROM unit_list ORDER BY id';
  const [rows] = await sql.query(query);
  return rows;
}



async function addUnit(unitname, userid) {
  const sql = await init();
  const insertQuery = sql.format('INSERT INTO unit_list SET ? ;', {unitname, userid});
  await sql.query(insertQuery);
}

let sqlPromise = null;

async function init() {
  if (sqlPromise) return sqlPromise;

  sqlPromise = newConnection();
  return sqlPromise;
}

async function shutDown() {
  if (!sqlPromise) return;
  const stashed = sqlPromise;
  sqlPromise = null;
  await releaseConnection(await stashed);
}

async function newConnection() {
  const sql = await mysql.createConnection(config.mysql);

  // handle unexpected errors by just logging them
  sql.on('error', (err) => {
    console.error(err);
    sql.end();
  });

  return sql;
}

async function releaseConnection(connection) {
  await connection.end();
}

process.on('unhandledRejection', console.error);


module.exports = {
  getLength: getUnitLength,
  shutDown: shutDown,
  addUnit: addUnit,
  listUnits: listUnits,
}
