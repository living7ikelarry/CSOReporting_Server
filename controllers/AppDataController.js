// TicketController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/myproject';
var assert = require('assert');
var fs = require('fs');
var path = require('path');

var AppData = require('../models/AppData.js');
var data = require('../appdata/appdata.json');


router.get('/', function (req, res) {
    /*
    AppData.find({}, function (err, appdata) {
        if (err) return res.status(500).send("There was a problem finding application data.");
        res.status(200).send(appdata);
    });
    */
    // var data = JSON.parse(fs.readFileSync(jsondata, 'utf8'));
    res.status(200).send(data);
});

module.exports = router;
