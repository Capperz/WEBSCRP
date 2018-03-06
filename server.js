
'use static';

const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

const GoogleAuth = require('simple-google-openid');
const unitdb = require('./sql-queries.js');

// you can put your client ID here
app.use(GoogleAuth('684640848172-mopuc1c4mnmv9fhnnd3vj8ugnfd4o4gv.apps.googleusercontent.com'));

// this will serve the HTML file shown below
app.use('/', express.static('src'));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`StudyPlan app listening on port ${PORT}!`);
});


app.get('/api/hello', (req, res) => {
  res.send('Hello ' + (req.user.displayName || 'user without a name') + '!');
  console.log('successful authenticated request by ' + req.user.emails[0].value);
});

app.get('/api/length', async (req, res) => {
  const length = await unitdb.getLength();
  res.send(length + '');
});

app.get('/api/unit_list', async (req, res) => {
  const units = await unitdb.listUnits();
  res.send(units);
});

app.post('/api/add', async (req, res) => {
  const userId = req.user.id;
  const unitName = req.query.unitname;
  console.log(req.query.unitname);
  if (unitName == "") {
    res.sendStatus(400);
  }
  else {
    await unitdb.addUnit(unitName, userId);
    res.sendStatus(200);
  }
});
