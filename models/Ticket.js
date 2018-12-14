// Ticket.js
var mongoose = require('mongoose');
var TicketSchema = new mongoose.Schema({
  location: String,
  department: String,
  description: String,
  imagePath: String,
  date: Number
});

mongoose.model('Ticket', TicketSchema, 'tickets');
module.exports = mongoose.model('Ticket');
