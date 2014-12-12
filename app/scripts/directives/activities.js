'use strict';

/**
 * @ngdoc directive
 * @name scaffoldTestApp.directive:activities
 * @description
 * # activities
 */
angular.module('scaffoldTestApp')
  .directive('activities', ['weatherService', function (weather) {
    return {
      template: '<div></div>',
      restrict: 'E',
      controller: function () {
        console.log(weather);
      }
    };
  }]);
