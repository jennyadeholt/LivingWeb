'use strict';

var debug = require('debug')('Living:server');
var http = require('http');

var app = require('./lib/app');

process.on('oncaugtException', function(err) {
  console.log("UncaughtException", err, err.stack);
  process.exit(1);
});

function start() {
  var port = process.env.PORT || 3000;

  server.listen(port, function() {
    console.log("Port", port);
    console.log("URL", 'http://localhost:' + port);
  })
}


var server = http.createServer(app);
server.app = app;
server.start = start;

module.exports = server;

if (require.main === module) {
  start();
}
