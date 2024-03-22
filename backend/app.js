require("./config/passport-config");

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('config');
var cors = require('cors');
const passport = require('passport');



var mongoose = require('mongoose');
mongoose.connect(config.get('development.MONGODB_URI'), function (err, res) {
  if (err) {
    console.log('Error in connecting to db');
    return;
  } else {
    console.log('Connected to db');
  }
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var commentsRouter = require('./routes/comments');
var likesRouter = require('./routes/likes');

var app = express();
app.use(express.json({ limit: '50mb', extended: true }));
//app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use(cors({ origin: true, credentials: true }));
app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/post', postsRouter);
app.use('/comment', commentsRouter);
app.use('/like', likesRouter);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
