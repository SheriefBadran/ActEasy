'use strict';

/**
 * @ngdoc function
 * @name scaffoldTestApp.controller:ActivityCtrl
 * @description
 * # ActivityCtrl
 * Controller of the scaffoldTestApp
 */
angular.module('scaffoldTestApp')
  .controller('ActivityCtrl', ['$http', function ($http) {

    var store = this;
    store.activities = [];

    $http.get('http://localhost:8000/activities')
      .success(function (data) {

        store.activities = data;
      });
  }]);
