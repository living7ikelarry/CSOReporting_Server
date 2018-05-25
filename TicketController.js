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

// specify location for image storage
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});

var upload = multer({storage: storage});

var nodemailer = require('nodemailer');

// specify email account
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'csoreportingapp@gmail.com',
    pass: 'Tucs265!'
  }
});

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
          // create email
          var mailOptions = {
            from: 'csoreportingapp@gmail.com',
            to: 'hoernsbj@mail.uc.edu',
            subject: 'CSO Trouble Ticket: ' + req.body.category + ' at ' + req.body.location,
            text: 'That was easy!',
            html: 'Issue description: ' + req.body.description + '<br><br> <img src="cid:unique@kreata.ee"/>',
            attachments: [{
                filename: 'image.jpg',
                path: './public/images/uploads/' + req.file.filename,
                cid: 'unique@kreata.ee' // same cid value as in the html img src
            }]
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
      });
});

router.get('/', function (req, res) {
    Ticket.find({}, function (err, tickets) {
        if (err) return res.status(500).send("There was a problem finding the tickets.");
        res.status(200).send(tickets);
    });
});

// other api routes that may be used

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
