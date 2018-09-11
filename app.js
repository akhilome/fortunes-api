const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const fortunes = require('./data/fortunes');

const app = express();

app.use(bodyParser.json());

app.get('/fortunes', (req, res) => {
  res.json(fortunes);
});

app.get('/fortunes/random', (req, res) => {
  res.json(fortunes[Math.floor(Math.random() * fortunes.length)]);
});

app.get('/fortunes/:id', (req, res) => {
  res.json(fortunes.find(fortune => fortune.id == req.params.id));
});


// DRYing things up!
const writeFortunes = (json) => {
  fs.writeFile('./data/fortunes.json', JSON.stringify(json), err => {
    console.log(err)
  });
}

app.post('/fortunes', (req, res) => {
  // Get data out of request body
  const { message, luckyNumber, spiritAnimal } = req.body;
  // Get all ids of every fortune already in db
  const fortuneIds = fortunes.map(fortune => fortune.id);
  // Make new fortune based on data sent by user
  const newFortunes = fortunes.concat({ 
    id: (fortuneIds.length ? Math.max(...fortuneIds) : 0) + 1,
    message,
    luckyNumber, 
    spiritAnimal
  });
  // Update the 'database'
  writeFortunes(newFortunes);

  res.json(newFortunes);
});

app.put('/fortunes/:id', (req, res) => {
  const { id } = req.params;
  // Get the fortune to be updated based on the provide id
  const oldFortune = fortunes.find(fortune => fortune.id == id);
  // Update the fortune with provided data
  ['message', 'luckyNumber', 'spiritAnimal'].forEach(key => {
    if (req.body[key]) oldFortune[key] = req.body[key];
  });
  // update the 'db'
  writeFortunes(fortunes);

  res.json(fortunes);
});

app.delete('/fortunes/:id', (req, res) => {
  const { id } = req.params;
  // Filter db, removing the passed id
  const newFortunes = fortunes.filter(fortune => fortune.id != id);
  // update db
  writeFortunes(newFortunes);

  res.json(newFortunes);
});

module.exports = app;
