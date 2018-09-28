// app.js
var express = require('express');
var app = express.Router();
var db = require('./db');
var Ticket = require('./models/Ticket.js');
var AppData = require('./models/AppData.js');

app.use(express.static( "public" ));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var TicketController = require('./controllers/TicketController');
app.use('/tickets', TicketController);

var AppDataController = require('./controllers/AppDataController');
app.use('/appdata', AppDataController);

/*
// web display
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    Ticket.find({}, function (err, tickets) {
        if (err) return res.status(500).send("There was a problem finding the tickets.");
        res.render('tickets.ejs', { "tickets": tickets });
    });
});
*/

module.exports = app;
