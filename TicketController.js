// TicketController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Ticket = require('./Ticket');

var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/myproject';

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});
var insertDocuments = function(db, filePath, callback) {
    var collection = db.collection('images');
    collection.insertOne({'imagePath' : filePath }, (err, result) => {
        assert.equal(err, null);
        callback(result);
    });
}
var upload = multer({storage: storage});

router.post('/', upload.single('image'), (req, res, next) => {
  Ticket.create({
          location : req.body.location,
          category : req.body.category,
          description : req.body.description,
          imagePath:  '/public/images/uploads/' + req.file.filename
      },
      function (err, ticket) {
          if (err) return res.status(500).send("There was a problem adding the ticket to the database.");
          res.status(200).send(ticket);
      });
});

router.post('/upload', upload.single('image'), (req, res, next) => {
    // do something here
});

router.get('/', function (req, res) {
    Ticket.find({}, function (err, tickets) {
        if (err) return res.status(500).send("There was a problem finding the tickets.");
        res.status(200).send(tickets);
    });
});

// get ticket by id
router.get('/:id', function (req, res) {
    Ticket.findById(req.params.id, function (err, ticket) {
        if (err) return res.status(500).send("There was a problem finding the ticket.");
        if (!ticket) return res.status(404).send("No ticket found.");
        res.status(200).send(ticket);
    });
});

// delete ticket
router.delete('/:id', function (req, res) {
    Ticket.findByIdAndRemove(req.params.id, function (err, ticket) {
        if (err) return res.status(500).send("There was a problem deleting the ticket.");
        res.status(200).send("Ticket "+ req.params.id +" was deleted.");
    });
});

// update ticket
router.put('/:id', function (req, res) {
    Ticket.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, ticket) {
        if (err) return res.status(500).send("There was a problem updating the ticket.");
        res.status(200).send(ticket);
    });
});



module.exports = router;
