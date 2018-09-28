// server.js
var express = require('express');
var app = express();

app.use('/', require('./app.js'));

var port = process.env.PORT || 3000;
var test = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
