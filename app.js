// app.js
var express = require('express');
var app = express();
var db = require('./db');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var Ticket = require('./Ticket');

var TicketController = require('./TicketController');
app.use('/tickets', TicketController);

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    Ticket.find({}, function (err, tickets) {
        if (err) return res.status(500).send("There was a problem finding the tickets.");
        res.render('tickets.ejs', { "tickets": tickets });
    });
});

module.exports = app;
