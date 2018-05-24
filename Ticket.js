// Ticket.js
var mongoose = require('mongoose');
var TicketSchema = new mongoose.Schema({
  location: String,
  category: String,
  description: String,
  imagePath: String
});
mongoose.model('Ticket', TicketSchema);
module.exports = mongoose.model('Ticket');
