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

app.post('/fortunes', (req, res) => {
  // Get data out of request body
  const { message, luckyNumber, spiritAnimal } = req.body;
  // Get all ids of every fortune already in db
  const fortuneIds = fortunes.map(fortune => fortune.id);
  // Make new fortune based on data sent by user
  const fortune = { 
    id: (fortuneIds.length ? Math.max(...fortuneIds) : 0) + 1,
    message: message,
    luckyNumber: luckyNumber, 
    spiritAnimal: spiritAnimal
  };

  const newFortunes = fortunes.concat(fortune);
  // Update the 'database'
  fs.writeFile('./data/fortunes.json', JSON.stringify(newFortunes), err => {
    console.log(err)
  });
  
  res.json(newFortunes);
});

module.exports = app;
