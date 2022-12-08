const express = require('express');
const cors = require('cors');
const fs = require('fs');


const app = express();

app.use(cors());

app.use('/img', express.static('database/img'));
app.use('/avatar', express.static('database/avatars'));
app.use('/other', express.static('database/other'));
app.use('/placeholder', express.static('database/placeholder'));
app.use('/d', express.static('database/description'));


app.get('/favicon.ico', (req, res) => res.end())

app.get('/unit/*', (req, res) => {
  res.send(require('./database/unit/' + req.params[0]))
})

app.get('/topcreator/*', (req, res) => {
  const login = require('./database/users/topcreator.json')[req.params[0]]
  const topcreator = require('./database/users/' + login)
  res.send(topcreator)
})

app.get('/:user', (req, res) => {
  const path = './database/users/' + req.params.user + '.json'
  res.send(
    fs.existsSync(path)
      ? require(path)
      : req.params.user + ': not found'
  )
})

app.listen(8000, (() => console.log('Start server')))