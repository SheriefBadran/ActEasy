/**
 * Created by sheriefbadran on 1/3/15.
 */

var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  weather: {
    lat: Number,
    lon: Number,
    t: Number,    // air temperature (celsius)
    ws: Number,   // wind velocity (m/s)
    pit: Number,  // precipitation - total
    pis: Number   // precipitation - snow
  },
  nextupdate: Number
});

// var UserModel = mongoose.model('User', userSchema);

// create the model for users and expose it to our app
module.exports = userSchema;