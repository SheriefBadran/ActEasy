'use strict';

/**
 * @ngdoc function
 * @name scaffoldTestApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scaffoldTestApp
 */
angular.module('scaffoldTestApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
