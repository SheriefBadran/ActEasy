#!/bin/env node


var application_root = __dirname,
    express         = require('express'), //Web framework
    morgan          = require('morgan'), // (since Express 4.0.0)
    bodyParser      = require('body-parser'), // (since Express 4.0.0)
    methodOverride  = require('method-override'), // (since Express 4.0.0)
    errorHandler    = require('errorhandler'), // (since Express 4.0.0)
    path            = require( 'path' ), // Utilities for dealing with file paths
    mongoose        = require( 'mongoose' ), // MongoDB integration
    app             = express();



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


var io = require('socket.io').listen(server);

// Connect to the database
mongoose.connect('mongodb://db_user:frasklas@ds029630.mongolab.com:29630/portfoliodb');

// Verify connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('yay!!');
});

// Schemas
var Message = new mongoose.Schema({sender: String, text: String, serverId: String, _id: Object, date: Date});
var ContactMessage = new mongoose.Schema({firstname: String, surname: String, email: String, webpage: String, comment: String, date: Date});

var Activity = new mongoose.Schema({
    "name": String,
    "indoors": Boolean,
    "activity-name": String,
    "category": String,
    "sub-category": String,
    "description": String,
    "contact": {
        "tel": String,
        "email": String,
        "website": String
    },
    "price": Number,
    "booking": Boolean,
    "booking-link": String,
    "limitations": String,
    "images": [],
    "thumbs": [],
    "reviews": [],
    "address": {
        "street": String,
        "postal-code": String,
        "city": String
    },
    "loc": []
});

Activity.index({loc: '2dsphere'});

// Models
var MessageModel = mongoose.model('Message', Message);
var ContactMessageModel = mongoose.model('ContactMessage', ContactMessage);
var ActivityModel = mongoose.model('Activity', Activity);

var sanitize = function (string) {

    return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// Socket.io
io.sockets.on('connection', function(client){
    console.log('new client');

    client.on('message:join', function (name) {
        
        // broadcast joining person to the chat.
        client.broadcast.emit('joined', sanitize(name));
    });
    
    // Emit the 'messages' event on the client.
    
    // Listen for messages events form client.
    client.on('message:create', function (data) {
        // received message from client

        var serverid = mongoose.Types.ObjectId();
        console.log(serverid);
        var message = new MessageModel({
            sender: sanitize(data.sender),
            text: sanitize(data.text),
            serverId: serverid,
            _id: serverid,
            date: sanitize(data.date)
        });

        message.save( function( err ) {
            if( !err ) {
                return console.log( 'created' );
            } else {
                return console.log( err );
            }
        });

        data.serverId = serverid;
        data._id = serverid;
        
        console.log('data with new id');
        console.log(data);
        // broadcast back to client.
        client.emit('clientcreate', data);
        client.broadcast.emit('create', data);
    });

    client.on('message:delete', function (data) {

        console.log('inside delete callback func');
        console.log(data);

        return MessageModel.findOne( {serverId: data}, function( err, message ) {
            return message.remove( function( err ) {
                if( !err ) {
                    console.log( 'Message removed' );
                    client.broadcast.emit('delete', data);
                } else {
                    console.log( err );
                }
            });
        });

        // broadcast back to client.
        // client.broadcast.emit('delete', data);
    });
});

// ROUTES

app.get('/chat', function (request, response) {

	response.sendfile(__dirname+'/app/index.html');
});

app.get('/Contact-Me', function (request, response) {

    response.sendfile(__dirname+'/app/index.html');
});

app.get('/My-Work', function (request, response) {

    response.sendfile(__dirname+'/app/index.html');
});

app.get('/Education', function (request, response) {
    
    response.sendfile(__dirname+'/app/index.html');
});

// Get a list of all messages
app.get( '/messages', function( request, response ) {

    return MessageModel.find( function( err, messages ) {
        // if( !err ) {
        //     return response.send( messages );
        // } else {
        //     return console.log( err );
        // }
        // var mess = JSON.parse(messages);
        return response.send(messages);
    });
});

app.get('/near-activities', function (request, response) {

    return ActivityModel.find({
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

// Insert a new message
// app.post( '/messages', function( request, response ) {
//     var message = new MessageModel({
//         text: request.body.text,
//         date: request.body.date
//     });
//     message.save( function( err ) {
//         if( !err ) {
//             return console.log( 'created' );
//         } else {
//             return console.log( err );
//         }
//     });
//     return response.send( message );
// });

app.post('/form', function (request, response) {
   
   var contactMessage = new ContactMessageModel({

        firstname: sanitize(request.body.firstname),
        surname: sanitize(request.body.surname),
        email: sanitize(request.body.email),
        webpage: sanitize(request.body.webpage),
        comment: sanitize(request.body.comment),
        date: sanitize(request.body.date)
   });

   contactMessage.save(function (err) {
       
       if (!err) {

            return console.log('created');
       } else {
            return console.log(err);
       }
   });
   return response.send(contactMessage);
});

// GET, PUT AND DELETE ROUTES for a single chat message. This works since Express 4.0.0
// Call out HTTP verbs on the route() method. route() method provides an instance of Route.
app.route('/messages/:id')

	// Get a single message by id
	.get(function(request, response) {
		
	    return MessageModel.findById( request.params.id, function( err, message ) {
	        if( !err ) {
	            return response.send( message );
	        } else {
	            return console.log( err );
	        }
	    });
	})
	
	// Update a message
	.put(function(request, response) {

	    return MessageModel.findById( request.params.id, function( err, message ) {
	        message.text = request.body.text;
	        message.date = request.body.date;

	        return message.save( function( err ) {
	            if( !err ) {
	                console.log( 'message updated' );
	            } else {
	                console.log( err );
	            }
	            return response.send( message );
	        });
	    });
	})
	
	.delete(function(request, response) {
	   
	    return MessageModel.findById( request.params.id, function( err, message ) {
	        return message.remove( function( err ) {
	            if( !err ) {
	                console.log( 'Message removed' );
	                return response.send( '' );
	            } else {
	                console.log( err );
	            }
	        });
	    });
	});

// Get a single message by id
// app.get( '/messages/:id', function( request, response ) {
//     return MessageModel.findById( request.params.id, function( err, message ) {
//         if( !err ) {
//             return response.send( message );
//         } else {
//             return console.log( err );
//         }
//     });
// });
// 
// // Update a message
// app.put( '/messages/:id', function( request, response ) {
//     console.log( 'Updating message ' + request.body.text );
//     return MessageModel.findById( request.params.id, function( err, message ) {
//         message.text = request.body.text;
//         message.date = request.body.date;
// 
//         return message.save( function( err ) {
//             if( !err ) {
//                 console.log( 'message updated' );
//             } else {
//                 console.log( err );
//             }
//             return response.send( message );
//         });
//     });
// });
// 
// app.delete( '/messages/:id', function( request, response ) {
//     console.log( 'Deleting message with id: ' + request.params.id );
//     return MessageModel.findById( request.params.id, function( err, message ) {
//         return message.remove( function( err ) {
//             if( !err ) {
//                 console.log( 'Message removed' );
//                 return response.send( '' );
//             } else {
//                 console.log( err );
//             }
//         });
//     });
// });


// DB TEST CALLS FROM BROWSER CONSOLE

// POST A MESSAGE
// jQuery.post( '/messages', {
//     'text': 'Sherief Loves Backbone',
//     'date': new Date( 2014, 4, 25 ).getTime()
// }, function(data, textStatus, jqXHR) {
//     console.log( 'Post response:' );
//     console.dir( data );
//     console.log( textStatus );
//     console.dir( jqXHR );
// });
// 
// GET ALL MESSAGES (THE COLLECTION)
// jQuery.get( '/messages', function( data, textStatus, jqXHR ) {
//     console.log( 'Get response:' );
//     console.dir( data );
//     console.log( textStatus );
//     console.dir( jqXHR );
// });

// GET A SINGEL MESSAGE
// jQuery.get( '/messages/535a7d8b0258df5db7000008', 
//   function( data, textStatus, jqXHR ) {
//     console.log( 'Get response:' );
//     console.dir( data );
//     console.log( textStatus );
//     console.dir( jqXHR );
// });

// UPDATE A SINGEL MESSAGE
// jQuery.ajax({
//     url: '/messages/535a7d8b0258df5db7000008',
//     type: 'PUT',
//     data: {
//         'text': 'Sherief Loves Backbone with Require.js',
//         'date': new Date( 2014, 4, 25 ).getTime()
//     },
//     success: function( data, textStatus, jqXHR ) {
//         console.log( 'Post response:' );
//         console.dir( data );
//         console.log( textStatus );
//         console.dir( jqXHR );
//     }
// });