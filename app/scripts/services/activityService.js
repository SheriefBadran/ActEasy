'use strict';

/**
 * @ngdoc service
 * @name scaffoldTestApp.activityService
 * @description
 * # locationService
 * Service in the scaffoldTestApp.
 */
angular.module('scaffoldTestApp')
  .service('activityService', ['$http', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.getActivities = function(){

      return $http.get('http://localhost:8000/near-activities');
    };
  }]);
