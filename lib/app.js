'use strict';

var express = require('express');
var tweetRoute = require('./routes/booli');

var app = express();

app.use('/api/booli', tweetRoute);
app.use(express.static(__dirname + '/../client'))

module.exports = app;
