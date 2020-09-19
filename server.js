const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
var fs = require('fs');
const imgs = require('./route/img.route');
//HTTP request logger
app.use(morgan('tiny'));
const ejs = require('ejs');
//HTTP request logger
app.use(morgan('tiny'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set EJS as templating engine
app.set('view engine', 'ejs');
const dbConnect = process.env.DATABASE_URL;
mongoose.connect(dbConnect, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

app.get('/img', (req, res) => res.render('imgviews'));
app.use('/imgs', imgs);
app.listen(process.env.PORT || 5000, function (res) {
  console.log('server running on port 5000');
});
