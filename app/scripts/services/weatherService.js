'use strict';

/**
 * @ngdoc service
 * @name scaffoldTestApp.activityService
 * @description
 * # activityService
 * Service in the scaffoldTestApp.
 */
angular.module('services')
  .service('weatherService', ['$http', function ($http) {

     // AngularJS will instantiate a singleton by calling "new" on this function
    this.getWeather = function () {

      return $http.get('http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/56.68/lon/16.36/data.json');
    };
  }]);
