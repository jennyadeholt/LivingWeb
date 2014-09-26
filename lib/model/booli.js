'use strict';

var config = require('../../config');
var http = require('http');
var crypto = require('crypto');
var shasum = crypto.createHash('sha1');
var config = require('../../config');


var checksum = function(str) {
  return crypto
  .createHash('sha1')
  .update(str, 'utf8')
  .digest('hex')
}

var auth = function() {
  var unique = Math.random().toString(36).slice(2);
  var callerId = "EasyLiving";
  var time = Date.now();
  var hash = checksum(callerId + time + config.privateKey() + unique);

  return "callerId=" + callerId + "&time=" + time + "&unique=" + unique + "&hash=" + hash + "&limit=500";
}

var onCallback = function(callback) {
  return function(response) {
    var data = "";
    response.on('data', function (chunk) {
      data += chunk;
    });
    response.on('end', function() {
      callback(data);
    });
  }
};

function getListing(id, callback) {
  http.get(
    "http://api.booli.se/listings/" + id + "?" + auth(),
    onCallback(callback)
  ).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

function getListings(q, callback) {
  http.get(
    "http://api.booli.se/listings?q=" + q + "&" + auth(),
    onCallback(callback)
  ).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

function getAreas(q, callback) {
  http.get(
    "http://api.booli.se/areas?q=" + q + "&" + auth(),
    onCallback(callback)
  ).on('error', function(e) {
    console.log("Got error: ");
  });
}

function getSolds(q, callback) {
  http.get(
    "http://api.booli.se/sold?q=" + q + "&" + auth(),
    onCallback(callback)
  ).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}


module.exports = {
  getListing : getListing,
  getListings : getListings,
  getAreas : getAreas,
  getSolds : getSolds
};
