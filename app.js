// app.js
var express = require('express');
var app = express();
var db = require('./db');

var TicketController = require('./TicketController');
app.use('/tickets', TicketController);

module.exports = app;
