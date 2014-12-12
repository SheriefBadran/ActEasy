'use strict';

/**
 * @ngdoc function
 * @name actEasy.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the actEasy
 */
angular.module('actEasy')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
