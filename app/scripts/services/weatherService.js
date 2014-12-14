'use strict';

/**
 * @ngdoc service
 * @name scaffoldTestApp.activityService
 * @description
 * # activityService
 * Service in the scaffoldTestApp.
 */
angular.module('scaffoldTestApp')
  .service('weatherService', ['$http', function ($http) {

     // AngularJS will instantiate a singleton by calling "new" on this function
    var store = this;
    store.weather = [];

    //$http.get('http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/58.59/lon/16.18/data.json')
    //  .success(function (data) {
    //
    //    store.weather = data;
    //  });

  }]);
