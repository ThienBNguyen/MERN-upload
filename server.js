if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const multer = require('multer');
const app = express();
var fs = require('fs');
const imgs = require('./route/img.route');
//HTTP request logger
app.use(morgan('tiny'));
const ejs = require('ejs');
//HTTP request logger
app.use(morgan('tiny'));

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(upload.array());
app.use(express.static('public'));
// app.use('/files', express.static('files'));
// app.use(bodyParser.json());

// Set EJS as templating engine
app.set('view engine', 'ejs');

// const dbConnect = process.env.DATABASE_URL;
// mongoose.connect(dbConnect, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on('error', (error) => console.error(error));
// db.once('open', () => console.log('Connected to Mongoose'));

const MongoClient = require('mongodb').MongoClient;
const myurl = process.env.DATABASE_URL;

MongoClient.connect(
  myurl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.log(err);
    db = client.db('test');
    app.listen(3000, () => {
      console.log('listening on 3000');
    });
  }
);
// app.get('/', (req, res) => res.render('imgviews'));
// app.use('/add', imgs);
app.listen(process.env.PORT || 5000, function (res) {
  console.log('server running on port 5000');
});
//

// ROUTES
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

var upload = multer({ storage: storage });
app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
});
//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files;
  if (!files) {
    const error = new Error('Please choose files');
    error.httpStatusCode = 400;
    return next(error);
  }

  res.send(files);
  app.use(function (err, req, res, next) {
    console.log('This is the invalid field ->', err.field);
    next(err);
  });
});
app.post('/uploadphoto', upload.single('myImage'), (req, res) => {
  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString('base64');
  // Define a JSONobject for the image attributes for saving to database

  var finalImg = {
    contentType: req.file.mimetype,
    image: new Buffer(encode_image, 'base64'),
  };
  db.collection('quotes').insertOne(finalImg, (err, result) => {
    console.log(result);

    if (err) return console.log(err);

    console.log('saved to database');
    res.redirect('/');
  });
});
app.get('/photos', (req, res) => {
  console.log(db.collection);
  db.collection('mycollection')
    .find()
    .toArray((err, result) => {
      const imgArray = result.map((element) => element._id);
      console.log(imgArray);

      if (err) return console.log(err);
      res.send(imgArray);
    });
});

app.get('/photo/:id', (req, res) => {
  var filename = req.params.id;

  db.collection('mycollection').findOne(
    { _id: ObjectId(filename) },
    (err, result) => {
      if (err) return console.log(err);

      res.contentType('image/jpeg');
      res.send(result.image.buffer);
    }
  );
});
