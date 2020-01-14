/*  https://medium.com/@valentinog/going-real-time-with-socket-io-node-js-and-react-3e0f02d3d447
    https://github.com/socketio/socket.io/blob/master/docs/README.md
*/
var express = require('express');
var router = express.Router();
var cors = require('cors'); // enable cross site url//
var config = require('../config/config');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

var app = express();
var server = app.listen(8810);
var io = require('socket.io').listen(server);

const getApiAndEmit = "TODO";

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

io.on("connection", socket => {
  console.log("New client connected"), setInterval(
    () => getApiAndEmit(socket),
    10000
  );
  socket.on("disconnect", () => console.log("Client disconnected"));
});



module.exports = router;
