const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(fileUpload());

app.use('/i', express.static('database/img'));
app.use('/a', express.static('database/avatars'));
app.use('/other', express.static('database/other'));
app.use('/placeholder', express.static('database/placeholder'));
app.use('/d', express.static('database/description'));


app.post('/add', (req, res) => {

  path = 'database/'

  if (req.body.name && req.body.author && req.files.image) {
    const item = {
      id: (Math.floor(Math.random() * 65536)).toString(16),
      creator: req.body.author,
      name: req.body.name,
      price: Math.floor(Math.random() * 1000) / 100,
      highestBid: Math.floor(Math.random() * 1000) / 100,
      tags: [],
      collection: []
    }

    if (!fs.existsSync(path + 'users/' + req.body.author + '.json')) {
      res.status(404)
      res.send('not found user')
    }

    fs.writeFileSync('database/unit/' + item.id + '.json', JSON.stringify(item))

    const user = JSON.parse(fs.readFileSync('database/users/' + req.body.author + '.json'))
    user.item.unshift(item.id)
    fs.writeFileSync('database/users/' + req.body.author + '.json', JSON.stringify(user))

    fs.writeFileSync('database/img/' + item.id + '.png', req.files.image.data)

    const units = JSON.parse(fs.readFileSync('database/AllUnits.json'))
    units.unshift(item)
    fs.writeFileSync('database/AllUnits.json', JSON.stringify(units))

    res.send('OK')

  }
  res.status(400)
  res.send('error')
})

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