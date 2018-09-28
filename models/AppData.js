// AppData.js
var mongoose = require('mongoose');
var AppDataSchema = new mongoose.Schema({
  location: String,
  department: String,
  input: String
});

mongoose.model('AppData', AppDataSchema, 'appdata');
module.exports = mongoose.model('AppData');
