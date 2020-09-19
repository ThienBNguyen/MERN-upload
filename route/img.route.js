const express = require('express');
const router = express.Router();
const imgModel = require('../models/img');
const multer = require('multer');

const fs = require('fs');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads/menu ');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '_' + file.originalname);
  },
});
//init upload
const upload = multer({ storage: storage });
// Retriving the image
router.get('/', (req, res) => {
  imgModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      res.render('app', { items: items });
    }
  });
});

// Uploading the image
router.post('/', upload.single('image'), (req, res, next) => {
  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + '/uploads/' + req.file.filename)
      ),
      contentType: 'image/png',
    },
  };
  imgModel.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      // item.save();
      res.redirect('/');
    }
  });
});

module.exports = router;
