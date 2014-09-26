'use strict';

var express = require('express');
var router = express.Router();
var booliModel = require('../model/booli');

router.get('/listing/:id', function(req, res) {
    booliModel.getListing(req.params.id, function(data) {
      res.send(data);
    });
});

router.get('/listings/:q', function(req, res) {
    booliModel.getListings(req.params.q, function(data) {
      res.send(data);
    });
});

router.get('/areas/:q', function(req, res) {
    booliModel.getAreas(req.params.q, function(data) {
      res.send(data);
    })
});

router.get('/sold/:q', function(req, res) {
    booliModel.getSolds(req.params.q, function(data) {
      res.send(data);
    });
});


module.exports = router;
