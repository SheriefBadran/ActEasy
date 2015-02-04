'use strict';

/**
 * @ngdoc service
 * @name scaffoldTestApp.authenticationService
 * @description
 * # authenticationService
 * Service in the scaffoldTestApp.
 */
//TODO: This module is currently not used. Dependency inject it into app.js
angular.module('services')
  .service('authenticationService', ['$http', function ($http) {

    this.authenticate = function(){

      //return $http.get('http://localhost:8000/authenticate');
      return $http.get('http://easyact-portfolio80.rhcloud.com/authenticate');
    };
  }]);
