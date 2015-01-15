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
              t: weather.timeseries[6].t,
              ws: weather.timeseries[6].ws,
              pit: weather.timeseries[6].pit,
              pis: weather.timeseries[6].pis
            };

            user.nextupdate = +new Date() + 600000;

            user.save();

            next();
          });
        }
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

    // (lat, long) is given in opposite order to mongoDB geospatial query, hence (long, lat)
    Activity.find({
      loc: {
        $geoWithin: {
          $centerSphere: [
            [req.param('lon'), req.param('lat')], 500/6371]
        }
      }
    }, function(err, activities) {

      var evaluatedActivities = evaluateActivities(activities, req.weather);
      console.log(evaluatedActivities);
      res.send(evaluatedActivities);
    });
  });

  app.get('/activity-details', function (req, res) {

    Activity.findOne({'urlextensionid': req.param('name')}, function (err, activity) {

      res.send(activity);
    });
  });


};