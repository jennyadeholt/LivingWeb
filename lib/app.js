'use strict';

var express = require('express');
var route = require('./routes/booli');

var app = express();

app.use('/api/booli', route);
app.use(express.static(__dirname + '/../client'))

module.exports = app;
