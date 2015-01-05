/**
 * Created by sheriefbadran on 1/3/15.
 */

var Activity        = require('./../models/activity');

module.exports = function(app) {

  // =====================================
  // ACTIVITIES ROUTE ====================
  // =====================================
  // MONGO DB geospatial query
  app.get('/near-activities', function (req, res) {
    console.log(req.param('lng'));
    return Activity.find({
      loc: {
        $geoWithin: {
          $centerSphere: [
            [16.3577567, 56.6775846], 2/6371]
        }
      }
    }, function(err, activities) {

      return res.send(activities);
    });
  });

};