const express = require('express');
const cors = require('cors');
const fs = require('fs');


const app = express();

app.use(cors());

app.use('/i', express.static('database/img'));
app.use('/a', express.static('database/avatars'));
app.use('/other', express.static('database/other'));
app.use('/placeholder', express.static('database/placeholder'));
app.use('/d', express.static('database/description'));


app.get('/favicon.ico', (req, res) => res.end())

app.get('/unit/all', (req, res) => {
  res.send(require('./database/AllUnits.json'))
})

app.get('/unit/:id', (req, res) => {
  res.send(require('./database/unit/' + req.params.id))
})

app.get('/c/all', (req, res) => {
  res.send(require('./database/AllCollections.json'))
})

app.get('/c/:id', (req, res) => {
  res.send(require('./database/collection/' + req.params.id))
})

app.get('/topcreator', (req, res) => { res.send(require('./database/top/topCreator.json')) })
app.get('/topcollection', (req, res) => { res.send(require('./database/top/topCollection.json')) })

app.get('/:user', (req, res) => {
  const path = './database/users/' + req.params.user + '.json'
  res.send(
    fs.existsSync(path)
      ? require(path)
      : req.params.user + ': not found'
  )
})

app.listen(8000, (() => console.log('Start server')))