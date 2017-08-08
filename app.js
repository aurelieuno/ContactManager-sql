/**
*Module dependencies
*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var assert = require('assert');
var knex = require('./database.js');//We want our db.js file to be run every time our server starts up. To ensure this, we simply require it.
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var session = require('express-session');
//==============================================================================
/**
*Create app instance
*/
var app = express();
//==============================================================================
/**
*Module Variables
*/
//These modules/files contain code for handling particular sets of related "routes" (URL paths)
var index = require('./routes/index');



//==============================================================================
/**
*Module Settings and Config
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));//PUG files html
app.set('view engine', 'pug');
//app.set('port', (process.env.PORT || 3000));
//var port = app.get('port');




//==============================================================================
/**
*Middleware
*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));//route
//app.use(require('stylus').middleware(__dirname));

app.use(session({ secret: 'secretyou', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./config/passport')(passport);
//==============================================================================
/**
*Routes
*/
app.use('/', index);

//==============================================================================
/**
*Error handling
*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
//==============================================================================
/**
*Export Module
*/
module.exports = app;
//==============================================================================
////////////////////////////////////////////////////////////
// app.listen(port, function() {
//   console.log(`Listening on port` ${port});
// });
//NODE_ENV in express-we are in dev
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}