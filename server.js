
'use static';

const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const GoogleAuth = require('simple-google-openid');
const database = require('./sql-queries.js');

app.use(GoogleAuth('684640848172-mopuc1c4mnmv9fhnnd3vj8ugnfd4o4gv.apps.googleusercontent.com'));

//simple express server
app.use('/', express.static('src'));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`StudyPlan app listening on port ${PORT}!`);
});



app.get('/api/auth', userAuth);
app.get('/api/week_list', getWeeks);
app.get('/api/unit_list', getUnits);
app.post('/api/addunit', addUnit);
app.post('/api/addweek', addWeek);

async function userAuth(req, res) {
  const userID = req.user.id;
  await database.addUser(userID);
  res.sendStatus(200);
};

async function getUnits(req, res) {
  const userId = req.user.id;
  const units = await database.getUnits(userId);
  res.send(units);
};

async function addUnit(req,res) {
  const userId = req.user.id;
  const unitName = req.query.unitname;
  const unitColour = req.query.unitcolour;
  if (unitName == "") {
    res.sendStatus(400);
  }
  else {
    await database.addUnit(unitName, userId, unitColour);
    res.sendStatus(200);
  }
};

async function addWeek(req, res) {
  const userID = req.user.id;
  const weekDesc = req.query.weekdesc;
  const unitID = req.query.unitid;
  if (weekDesc == "") {
    res.sendStatus(400);
  }
  else {
    await database.addWeek(userID, unitID, weekDesc);
    res.sendStatus(200);
  }
};

async function getWeeks(req, res){
  const userID = req.user.id;
  const unitID = req.query.unit;
  const weeks = await database.getWeeks(userID, unitID);
  res.send(weeks);
};
