var express = require('express');
var router = express.Router();
var cors = require('cors'); // enable cross site url//
var config = require('../config/config');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));



 router.get('/', function(req, res, next) {
    //  res.send('data');
      res.render('chat-index')
});


/*  io.on("connection", function(socket) {

  console.log('Client connected successfully...');

  // Error reporting
  socket.on('error', function (err) {
    console.log("Socket.IO Error");
    console.log(err.stack);
  });

      socket.on("user_join", function(data) {
        if(data != null && data != undefined && data != 'null'){
          this.username = data;
          socket.broadcast.emit("user_join", data);
        }
      });

      socket.on("chat_message", function(data) {
          data.username = this.username;
          socket.broadcast.emit("chat_message", data);
      });

      socket.on("disconnect", function(data) {
          socket.broadcast.emit("user_leave", this.username);
    });
  }); */


module.exports = router;
