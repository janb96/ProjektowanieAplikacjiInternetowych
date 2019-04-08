var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');

app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false,
  cookie: {maxAge: 1000}
}));

var Sequelize = require('sequelize');
var sequelize = new Sequelize('my_db', 'my_user', 'password', {
  host: 'localhost',
  port: 3306,
  dialect: `mysql`
});

var Project = sequelize.define('Project', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  data: Sequelize.DATE
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new FacebookStrategy({
  clientID: "0000000000000",
  clientService: "d22f40f7b4698c49",
  callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function (accessToken, refreshToken, profile, cb) {
    cb(null, "hello-user");
  }
));

app.get('/auth/facebook/', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/',
      failureRedirect: '/login' }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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