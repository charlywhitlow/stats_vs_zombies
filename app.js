const express = require('express');
const bodyParser = require('body-parser');

// create an instance of an express app
const app = express();
const router = express.Router();

// serve game
app.use(express.static(__dirname + '/game'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// update express settings
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// status
app.get('/status', (req, res, next) => {
    res.status(200);
    res.json({ 'status': 'ok' });
});

// catch all other routes
app.use((req, res, next) => {
  res.status(404);
  res.json({ message: '404 - Not Found' });
});

// handle errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error : err });
});

// start server listening on port
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
