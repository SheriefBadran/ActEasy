/**
 * Created by sheriefbadran on 1/3/15.
 */
var request = require('request');
var mongoose = require('mongoose');
var activitySchema = require('./../models/activity');
var Activity = mongoose.model('Activity', activitySchema);
var userSchema = require('./../models/user');
var User = mongoose.model('User', userSchema);
var evaluateActivities = require('./../priorityAlgorithm.js');
var options = {};
module.exports = function(app) {

  app.use(function (req, res, next) {

    if (req.param('lat') && req.param('lon')) {

      var lat = +(Math.round(parseFloat(req.param('lat')) + "e+2") + "e-2");
      var lon = +(Math.round(parseFloat(req.param('lon')) + "e+2") + "e-2");

      options.url = 'http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/'+lat+'/lon/'+lon+'/data.json';
      console.log(options.url);
      options.headers = {
        'User-Agent': 'Sherief Badran - student linneus university'
      };

      User.findOne({'google.name': 'Sherief Badran'}, function (err, user) {

        if (user.nextupdate < +new Date()) {

          request.get(options, function (error, response, body) {

            // Maybe cache to file here.
            var weather = JSON.parse(body);

            user.weather = {
              lat: weather.lat,
              lon: weather.lon,
              t: weather.timeseries[3].t,
              ws: weather.timeseries[3].ws,
              pit: weather.timeseries[3].pit,
              pis: weather.timeseries[3].pis
            };

            user.nextupdate = +new Date() + 3600000;

            user.save();
            console.log('Im done and also one hour has passed since last call to weather API.');

            next();
          });
        }

        console.log('Using cached weather data.');
        // Retrieve weather from database and assign to the request object
        req.weather = user.weather;
        next();
      });
    }
    else {

      next();
    }
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
      res.send(evaluatedActivities);
    });
  });

  app.get('/activity-details', function (req, res) {

    Activity.findOne({'urlextensionid': req.param('name')}, function (err, activity) {

      res.send(activity);
    });
  });


};