var express = require('express');
var router = express.Router();
var cors = require('cors'); // enable cross site url//
var config = require('../config/config');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

 router.get('/map', function(req, res, next) {
      // res.send('data');
       res.render('map')
});

router.get('/admin-map', function(req, res, next) {
       res.render('admin-map')
});

router.get('/fire', function(req, res, next) {
         //req.io.sockets.emit('update', foo);
          req.io.sockets.emit("chat_message", {username : 'Binod', message : 'Hello Test'});
          res.send('fire');
});


module.exports = router;
