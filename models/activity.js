/**
 * Created by sheriefbadran on 1/3/15.
 */
mongoose = require('mongoose');

var Activity = mongoose.Schema({
  "name": String,
  "indoors": Boolean,
  "priorityref": {
    "t": {
      "optmin": Number,
      "optmax": Number,
      "min": Number,
      "max": Number
    },
    "ws": {
      "optmin": Number,
      "optmax": Number,
      "min": Number,
      "max": Number
    },
    "pit": {
      "optmin": Number,
      "optmax": Number,
      "min": Number,
      "max": Number
    },
    "pis": {
      "optmin": Number,
      "optmax": Number,
      "min": Number,
      "max": Number
    },
    "always": Boolean,
    "extremealways": Boolean
  },
  "activityname": String,
  "category": String,
  "subcategory": String,
  "description": String,
  "contact": {
    "tel": String,
    "email": String,
    "website": String
  },
  "price": Number,
  "booking": Boolean,
  "bookinglink": String,
  "limitations": String,
  "images": [],
  "thumbs": [],
  "reviews": [],
  "address": {
    "street": String,
    "postalcode": String,
    "city": String
  },
  "loc": []
});

Activity.index({loc: '2dsphere'});

module.exports = mongoose.model('Activity', Activity);