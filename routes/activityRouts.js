/**
 * Created by sheriefbadran on 1/3/15.
 */
var request = require('request');
var mongoose = require('mongoose');
var Activity = require('./../models/activity');
var userSchema = require('./../models/user');
var User = mongoose.model('User', userSchema);
var evaluateActivities = require('./../priorityAlgorithm.js');
var options = {};
module.exports = function(app) {

  app.use(function (req, res, next) {

    // http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/56.6863052/lon/16.351642599999998/data.json
    // http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/56.689/lon/16.351/data.json
    if (!req.param('lat')) {

      console.log('ignore undefined');
      next();
    }

    var lat = +(Math.round(parseFloat(req.param('lat')) + "e+2") + "e-2");
    var lon = +(Math.round(parseFloat(req.param('lon')) + "e+2") + "e-2");

    options.url = 'http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/'+lat+'/lon/'+lon+'/data.json';
    console.log(options.url);
    options.headers = {
      'User-Agent': 'Sherief Badran - student linneus university'
    };

    //User.findOne({'google.name': 'Sherief Badran'}, function (err, user) {
    //  user.weather = {
    //    wind: '1.2',
    //    temp: '15'
    //  };
    //  user.save();
    //});


    //request.get(options, function (error, response, body) {
    //
    //  // Maybe cache to file here.
    //  var weather = JSON.parse(body);
    //  User.findOne({'google.name': 'Sherief Badran'}, function (err, user) {
    //    user.weather = {
    //      lat: weather.lat,
    //      lon: weather.lon,
    //      t: weather.timeseries[3].t,
    //      ws: weather.timeseries[3].ws,
    //      pit: weather.timeseries[3].pit,
    //      pis: weather.timeseries[3].pis
    //    };
    //    user.save();
    //  });
    //
    //  console.log(typeof weather.lat);
    //  console.log(typeof weather.lon);
    //  console.log(typeof weather.timeseries[3].t);
    //  console.log(typeof weather.timeseries[3].ws);
    //  console.log(typeof weather.timeseries[3].pit);
    //  console.log(typeof weather.timeseries[3].pis);
    //
    //  console.log('Im done');
    //
    //  next();
    //});

    User.findOne({'google.name': 'Sherief Badran'}, function (err, user) {

      // Retrieve weather from database and assign to the request object
      req.weather = user.weather;
      next();
    });

    //request.get({uri: options.url}, function (error, response, body) {
    //
    //  console.log(body);
    //  console.log('Im done');
    //  next();
    //});
    //next();
  });

  // =====================================
  // ACTIVITIES ROUTE ====================
  // =====================================
  // MONGO DB geospatial query
  app.get('/near-activities', function (req, res) {
    //console.log(req.param('lon'));
    //console.log(req.weather);

    Activity.find({
      loc: {
        $geoWithin: {
          $centerSphere: [
            [16.3577567, 56.6775846], 500/6371]
        }
      }
    }, function(err, activities) {

      var evaluatedActivities = evaluateActivities(activities, req.weather);

      for (var i = 0, max = evaluatedActivities.length; i < max; i++) {

        console.log(evaluatedActivities[i].name);
        console.log(evaluatedActivities[i].score);
      };
      res.send(activities);
    });
  });
};