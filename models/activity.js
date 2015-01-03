/**
 * Created by sheriefbadran on 1/3/15.
 */
mongoose        = require('mongoose');

var Activity = mongoose.Schema({
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

module.exports = mongoose.model('Activity', Activity);