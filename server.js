#!/bin/env node


var application_root = __dirname,
    express         = require('express'), //Web framework
    morgan          = require('morgan'), // (since Express 4.0.0)
    bodyParser      = require('body-parser'), // (since Express 4.0.0)
    methodOverride  = require('method-override'), // (since Express 4.0.0)
    errorHandler    = require('errorhandler'), // (since Express 4.0.0)
    path            = require('path'), // Utilities for dealing with file paths
    mongoose        = require('mongoose'), // MongoDB integration
    app             = express();

var Activity        = require('./models/activity');

// Configure server (since Express 4.0.0)
var env = process.env.NODE_ENV || 'development';

if ('development' == env) {

    app.use('/', express.static(path.join(application_root, 'app')));
    app.use(morgan('dev'));
    app.use(bodyParser());
    app.use(methodOverride());
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));

    // Enable CORS.. not recomended to do here, better to enable via Gruntfile.
    app.all('/*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
        next();
    });

} else {

    app.use('/', express.static(path.join(application_root, 'dist')));
    app.use(morgan('dev'));
    app.use(bodyParser());
    app.use(methodOverride());
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}


//Start server
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8000;

app.set('ipaddr', ipaddr);
app.set('port', port);

var server = app.listen( port, ipaddr, function() {
    console.log( 'Express server listening on port %d in %s mode', 
    port, app.settings.env );
});

// Connect to the database
mongoose.connect('mongodb://db_user:frasklas@ds029630.mongolab.com:29630/portfoliodb');

// Verify connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('yay!!');
});

// REGISTER GET, PUT AND DELETE ROUTES for a activities below. This works since Express 4.0.0
// Call out HTTP verbs on the route() method. route() method provides an instance of Route.
app.route('/near-activities')

	// Get a single message by id
	.get(function(request, response) {

      return Activity.find({
          loc: {
              $geoWithin: {
                  $centerSphere: [
                      [16.3577567, 56.6775846], 2/6371]
              }
          }
      }, function(err, activities) {

          return response.send(activities);
      });
	});








