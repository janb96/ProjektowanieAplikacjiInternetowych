var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

passport.use(new Strategy({
      clientID: '2151775708272166',
      clientSecret: '96870eb4bd942d2bcee0402ca4606d24',
      callbackURL: '/return'
    },
    function(accessToken, refreshToken, profile, cb) {
      // In this example, the user's Facebook profile is supplied as the user
      // record.  In a production-quality application, the Facebook profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      return cb(null, profile);
    }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var carsRouter = require('./routes/cars');
var adminRouter = require('./routes/admin');
var reservationsRouter = require('./routes/reservations.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/main', indexRouter);
app.use('/users', usersRouter);
app.use('/cars', carsRouter);
app.use('/admin', adminRouter);
app.use('/reservations', reservationsRouter);

// Define routes.
app.get('/', function(req, res) {
        if(req.user != undefined){
            res.redirect('main');
        }
        res.render('home', { user: req.user });
    });

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/login/facebook',
    passport.authenticate('facebook'));

app.get('/return',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/users/add/'+req.user.id+'/'+req.user.displayName);
    });

// app.get('/profile', require('connect-ensure-login').ensureLoggedIn(),
//     function(req, res){
//         if(req.user == undefined){
//             res.redirect('/');
//         }
//         // console.log("Test + " + req.isAuthenticated());
//         res.render('profile', { user: req.user });
//     });

app.get('/profile',
    function(req, res){
        if(!req.isAuthenticated()){
            res.redirect('/');
        }
        res.render('profile', { user: req.user });
    });

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
