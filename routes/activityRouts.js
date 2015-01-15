/**
 * Created by sheriefbadran on 1/3/15.
 */
var request = require('request');
var async = require('async');
var mongoose = require('mongoose');
var activitySchema = require('./../models/activity');
var Activity = mongoose.model('Activity', activitySchema);
var userSchema = require('./../models/user');
var User = mongoose.model('User', userSchema);
var evaluateActivities = require('./../priorityAlgorithm.js');
var options = {};
module.exports = function(app) {

  // =====================================
  // ACTIVITIES ROUTE ====================
  // =====================================
  // MONGO DB geospatial query
  app.get('/near-activities', function (req, res) {

    var options = {};
    var lat = +(Math.round(parseFloat(req.param('lat')) + "e+2") + "e-2");
    var lon = +(Math.round(parseFloat(req.param('lon')) + "e+2") + "e-2");

    // TODO: Consider making async.parallel a module.
    async.parallel({
      /*
       * Request to weather API and connect weather to user.
       */
      weather: function(callback)
      {

        options.url = 'http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/' + lat + '/lon/' + lon + '/data.json';
        options.headers = {
          'User-Agent': 'Sherief Badran - student linneus university'
        };

        User.findOne({'google.name': 'Sherief Badran'}, function (err, user) {

          if (user && user.nextupdate < +new Date()) {

            request.get(options, function (error, response, body) {

              if (response.statusCode === 200) {

                console.log('200 OK');
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
                callback(false, user.weather);
              }

              if (err || response.statusCode > 300) {

                callback("errormessage", response);
              }
            });
          }
          else {
            // Retrieve weather from database and assign to the request object
            callback(false, user.weather);
          }
        });
      },
      /*
       * Fetch activities from server. GeoSpatial query
       */
      activities: function (callback) {

        Activity.find({
          loc: {
            $geoWithin: {
              $centerSphere: [
                [req.param('lon'), req.param('lat')], 500 / 6371]
            }
          }
        }, function (err, activities) {

          if (!err) {

            callback(false, activities);
          }
          else {

            callback("errormessage", err);
          }

        });
      }
    },
    /*
     * Combine results in ascyn.parallel callback (async.parallel([function(callback){}, function(callback){}], combineCallback(err, result){}))
     */
    function(err, result) {

      if(err) {
        var response = "Internal Server Error";
        // If err, try send the activities to client any way.
        if (result.activities) {

          response = result.activities;
        }
        res.send(500, response);
        return;
      }

      var evaluatedActivities = evaluateActivities(result.activities, result.weather);
      res.send(evaluatedActivities);
    });
  });

  app.get('/activity-details', function (req, res) {

    Activity.findOne({'urlextensionid': req.param('name')}, function (err, activity) {

      res.send(activity);
    });
  });
};