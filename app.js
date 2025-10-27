require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
require("./app_api/model/db")
var indexRouter = require('./app_server/routes/index');

var usersRouter = require('./app_server/routes/users');

var indexApi =require("./app_api/routes/index")

var app = express();

// view engine setup
app.set('views', path.join(__dirname,'app_server','views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: process.env.SESSION_SECRET || 'loc8r_secret_key',
	resave: false,
	saveUninitialized: false
}));

// Make user info available to all views
app.use(function(req, res, next) {
	res.locals.username = req.session.username || null;
	res.locals.email = req.session.email || null;
	res.locals.loggedIn = !!req.session.username;
	next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public', 'build')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api',indexApi)

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
res.render('error', {
	title: 'Error',
	message: err.message,
	error: req.app.get('env') === 'development' ? err : {}
});
});

module.exports = app;