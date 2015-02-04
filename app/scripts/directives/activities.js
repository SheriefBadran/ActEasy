'use strict';

/**
 * @ngdoc directive
 * @name scaffoldTestApp.directive:activities
 * @description
 * # activities
 */
angular.module('activities')

  .directive('activity', function() {
    return {
      templateUrl: "../../partials/activity-section.html",
      restrict: 'E',
      scope: {
        item: "="
      },
      controller: function ($scope) {

        console.log('directive controller is running!');
        console.log($scope);
      }
    };
  });
