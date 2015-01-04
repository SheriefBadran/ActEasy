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
      console.log(pos);
      // http://localhost:8000/near-activities
      // http://easyact-portfolio80.rhcloud.com
      //return $http.get('http://localhost:8000/near-activities');
      return $http({
        url: 'http://localhost:8000/near-activities',
        method: "GET",
        params: {lng: 1, lat: 2}
      });
    };
  }]);
