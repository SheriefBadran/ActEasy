'use strict';

/**
 * @ngdoc service
 * @name scaffoldTestApp.activityService
 * @description
 * # locationService
 * Service in the scaffoldTestApp.
 */
angular.module('services')
  .service('activityService', ['$http', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.getActivities = function(pos){
      console.log('lat: ' + pos.latitude);
      console.log('lon: ' + pos.longitude);

      //return $http.get('http://localhost:8000/near-activities');
      return $http({
        url: 'http://localhost:8000/near-activities',
        //url: 'http://easyact-portfolio80.rhcloud.com/near-activities',
        method: "GET",
        params: {lat: pos.latitude, lon: pos.longitude}
      });
    };
  }]);
