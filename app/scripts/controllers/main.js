'use strict';

/**
 * @ngdoc function
 * @name scaffoldTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the scaffoldTestApp
 */
angular.module('scaffoldTestApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });