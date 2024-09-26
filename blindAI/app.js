const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const mealplanRouter = require('./routes/ai/');

app.use(bodyParser.json());

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the home page');
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});