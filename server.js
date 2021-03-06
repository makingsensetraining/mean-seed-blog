'use strict';

// Module dependencies.
var express = require('express'),
  modulepath = require('app-module-path'),
  uuid = require('uuid');

modulepath.addPath(__dirname + '/api/'); //Add's path of api to require

var simpleDI = require('config/simpleDI');

// Bootstrap dependencies and API modules
simpleDI.define('app/bootstrap', 'config/bootstrap');
simpleDI.resolve('app/bootstrap');

// Connect to db
simpleDI.resolve('app/mongoDbConn');

// Get app config
var appConfig = simpleDI.resolve('app/config');
var appFolder = appConfig.env === 'production' ? '/public/dist' : '/public';

// Load the .env data
var dotenv = simpleDI.resolve('dotenv');
dotenv.config();

var app = express();

// Environments configuration
app.configure(function () {
  app.use(express.errorHandler());
  app.use(express.static(__dirname + appFolder)); //This will serve AngularJSApp -> getting index.html
});

app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());

// Bootstrap routes
app.use(app.router);

// Add base routes to app
simpleDI.resolve('base/baseRoutes')(app);

// Add blog routes to app
simpleDI.resolve('blog/blogRoutes')(app);

// Start server
var port = appConfig.port;
app.listen(port, function () {
  console.log('listening on port %d in %s mode', port, app.get('env'));
});
