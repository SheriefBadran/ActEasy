'use strict';

/**
 * @ngdoc function
 * @name actEasy.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the actEasy
 */
angular.module('actEasy')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });