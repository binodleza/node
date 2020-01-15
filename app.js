var createError = require('http-errors');
var express = require('express');
var path = require('path');
const url = require('url');

var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var lawyerRouter = require('./routes/lawyer');
var uploadRouter = require('./routes/upload');
 //var chatRouter = require('./routes/chat');
 var mapRouter = require('./routes/map');

var app = express();
app.use(express.static(__dirname+'/app'));

/***************************** Socket Code start ****************/
 var server = app.listen(8810);
 var io = require('socket.io').listen(server);
 

io.on("connection", function(socket) {

console.log('Client connected successfully...');

socket.on('error', function (err) {
  console.log("Socket.IO Error");
  console.log(err.stack);
});

   socket.on("new_user_join", function(user_name) {
      socket.broadcast.emit("new_user_join", {user_name : user_name, id: socket.id});
    });

    socket.on("say_to_one_user", function(data) {
         console.log(data);
          data.username = socket.id; // sender id //
          data.message = data.message; // sender message //
          rec_socket_id = data.socket_id; // receiver socket id //
          //socket.broadcast.emit("chat_message", data); // send to all except sender //
          socket.broadcast.to(rec_socket_id).emit('chat_message', data); // send to perticulat socket_id sender //
         //socket.broadcast.emit("new_user_join", {user_name : user_name, id: socket.id});
      });


      socket.on("notify_user_typing", function(socket_id) {
          //data.socket_id = socket.id; // sender id //
          var message = 'Admin is typing';
          socket.broadcast.to(socket_id).emit('notify_user_typing', {socket_id : socket.id, message : message});
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
        console.log(socket.id);
        console.log('Discunnected above users');
        socket.broadcast.emit("user_leave", this.username);
  });
});
/****************** If u want only emmit socket**************/

app.use(function(req,res,next){
    req.io = io;
    next();
});

/***************************** Socket Code End ****************/

/*********   Helpers        *******/
app.locals.siteTitle = "The Lawyer App";
app.locals.siteUrl = 'http://localhost:3000/';
app.locals.someHelper = function(name) {
  return ("hello " + name);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(__dirname));
//app.use('/public',express.static('public'));

//app.use('/', indexRouter);
 //app.use('/', chatRouter);
app.use('/', mapRouter);
app.use('/users', usersRouter);
app.use('/lawyer', lawyerRouter);
app.use('/upload', uploadRouter);
//app.use('/chat', chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
