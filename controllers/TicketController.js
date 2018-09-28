// TicketController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/tickets';
var assert = require('assert');

var Ticket = require('../models/Ticket.js');

var mailLists = require('../appdata/mailLists.js');

// specify location for image storage
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});

var upload = multer({storage: storage});

var nodemailer = require('nodemailer');

// specify email account
var transporter = nodemailer.createTransport({
  host: 'smtp.uc.edu',
  port: 25,
  secure: false,
  tls: {
        rejectUnauthorized: false
  },
});

router.post('/', upload.single('image'), (req, res, next) => {
      Ticket.create({
          location : req.body.location,
          department : req.body.department,
          description : req.body.description,
          imagePath:  './images/' + req.file.filename
      },
      function (err, ticket) {
          if (err) return res.status(500).send("There was a problem adding the ticket to the database.");
          res.status(200).send(ticket);
          // route email to appropriate party based on department, try multiple recipients as well
          var mailList;
          if (req.body.department === 'Food Services') {
            mailList = mailLists.mailLists.foodservices;
          }
          else if (req.body.department === 'Parking') {
            mailList = mailLists.mailLists.parking;
          }
          else if (req.body.department === 'CES' & (req.body.location === 'TUC' || req.body.location === 'SSLC')) {
            mailList = mailLists.mailLists.cesTS;
          }
          else if (req.body.department === 'CES' & req.body.location === 'West Pavilion') {
            mailList = mailLists.mailLists.cesWP;
          }
          else if (req.body.department === 'CES' & req.body.location === 'Kingsgate') {
            mailList = mailLists.mailLists.cesKG;
          }
          else if (req.body.department === 'Bearcat Card') {
            mailList = mailLists.mailLists.bearcatcard;
          }
          else {
            mailList = 'hoernsbj@mail.uc.edu';
          }

          // create email
          var mailOptions = {
            from: 'csopers@uc.edu',
            to: mailList,
            subject: 'CS Notify: ' + req.body.department + ' issue at ' + req.body.location,
            html: 'Issue description: ' + req.body.description + '<br><br> <img src="cid:ticket@cso.uc.edu"/>',
            attachments: [{
                filename: 'image.jpg',
                path: './images/' + req.file.filename,
                cid: 'ticket@cso.uc.edu' // same cid value as in the html img src
            }]
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              // console.log(mailList);
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
