/**
 * Created by sheriefbadran on 1/3/15.
 */
var request = require('request');
var mongoose = require('mongoose');
var Activity = require('./../models/activity');
var userSchema = require('./../models/user');
var User = mongoose.model('User', userSchema);
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
    console.log(req.param('lon'));
    console.log(req.weather);

    Activity.find({
      loc: {
        $geoWithin: {
          $centerSphere: [
            [16.3577567, 56.6775846], 500/6371]
        }
      }
    }, function(err, activities) {

      for (var i = 0, max = activities.length; i < max; i++) {

        //console.log(activities[i].priorityref);
        //console.log(activities[i].name);
        //console.log(typeof activities[i]);
        activities[i].score = 0;
        // TODO: The algorithm has many repeating chunks of code. Refactor!
        // TODO: The algorithm should be encapsulated into a node module.
        if (!activities[i].indoors) {

          // ================================
          // TEMPERATURE ====================
          // ================================
          // If outdoor temperature is within the optimal open-domain, assign high score value (8) to the activity.
          if ((activities[i].priorityref.t.optmin <= req.weather.t &&
               activities[i].priorityref.t.optmax >= req.weather.t) ||
              (activities[i].priorityref.t.optmin === 0 &&
               activities[i].priorityref.t.optmax === 0 &&
               req.weather.t === 0)) {

            activities[i].score += 8;
          }

          // If the outdoor temperature is within the open-domain between optimal max and absolute max or optimal min and absolute min,
          // assign intermediate score (3) to the activity.
          else if (activities[i].priorityref.t.min <= req.weather.t &&
                   activities[i].priorityref.t.max >= req.weather.t) {

            activities[i].score += 3;
          }

          // ================================
          // WIND VELOCITY ==================
          // ================================
          if ((activities[i].priorityref.ws.optmin <= req.weather.ws &&
            activities[i].priorityref.ws.optmax >= req.weather.ws) ||
            (activities[i].priorityref.ws.optmin === 0 &&
            activities[i].priorityref.ws.optmax === 0 &&
            req.weather.ws === 0)) {

            activities[i].score += 8;
          }

          else if (activities[i].priorityref.ws.min <= req.weather.ws &&
                   activities[i].priorityref.ws.max >= req.weather.ws) {

            activities[i].score += 3;
          }

          // ================================
          // PRECIPITATION - TOTAL ==========
          // ================================
          if ((activities[i].priorityref.pit.optmin <= req.weather.pit &&
            activities[i].priorityref.pit.optmax >= req.weather.pit) ||
            (activities[i].priorityref.pit.optmin === 0 &&
            activities[i].priorityref.pit.optmax === 0 &&
            req.weather.pit === 0)) {

            activities[i].score += 8;
          }

          else if (activities[i].priorityref.pit.min <= req.weather.pit &&
            activities[i].priorityref.pit.max >= req.weather.pit) {

            activities[i].score += 3;
          }

          // ================================
          // PRECIPITATION - SNOW ===========
          // ================================
          if ((activities[i].priorityref.pis.optmin <= req.weather.pis &&
            activities[i].priorityref.pis.optmax >= req.weather.pis) ||
            (activities[i].priorityref.pis.optmin === 0 &&
            activities[i].priorityref.pis.optmax === 0 &&
            req.weather.pis === 0)) {

            activities[i].score += 8;
          }

          else if (activities[i].priorityref.pis.min <= req.weather.pis &&
            activities[i].priorityref.pis.max >= req.weather.pis) {

            activities[i].score += 3;
          }
        }

        if (activities[i].indoors) {

          if (activities[i].priorityref.always) {

            activities[i].score += 1;
          }

          if (activities[i].priorityref.extremealways) {

            activities[i].score += 3;
          }

          if (activities[i].priorityref.t.optmax >= req.weather.t) {

            activities[i].score += 8;
          }

          if (activities[i].priorityref.ws.optmax >= req.weather.ws) {

            activities[i].score += 8;
          }

          if (req.weather.pit > 0) {

            activities[i].score += 1;
          }

          if (req.weather.pis > 0) {

            activities[i].score += 2;
          }
        }

        console.log(activities[i].score);

      }
      res.send(activities);
    });
  });
};