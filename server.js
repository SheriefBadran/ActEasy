#!/bin/env node


var application_root = __dirname,
    express         = require('express'), //Web framework
    morgan          = require('morgan'), // (since Express 4.0.0)
    bodyParser      = require('body-parser'), // (since Express 4.0.0)
    cookieParser    = require('cookie-parser'),
    methodOverride  = require('method-override'), // (since Express 4.0.0)
    errorHandler    = require('errorhandler'), // (since Express 4.0.0)
    path            = require('path'), // Utilities for dealing with file paths
    mongoose        = require('mongoose'), // MongoDB integration
    passport        = require('passport'),
    session         = require('express-session'),
    app             = express();

var configDB        = require('./config/database.js');

// Configure server (since Express 4.0.0)
var env = process.env.NODE_ENV || 'development';

if ('development' == env) {

    app.use('/', express.static(path.join(application_root, 'app')));
    app.use(morgan('dev'));
    //app.use(cookieParser()); // read cookies (needed for auth)
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
    //app.use(cookieParser()); // read cookies (needed for auth)
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
mongoose.connect(configDB.url);

// Verify connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('yay!!');
});

// pass in passport for configuration
require('./config/passport')(passport);

app.use(session({ secret: 'iloveacteasy' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./routes/activityRouts.js')(app); // load authentication routes and pass in our app and fully configured passport
require('./routes/authenticationRoutes.js')(app, passport); // load authentication routes and pass in our app and fully configured passport








