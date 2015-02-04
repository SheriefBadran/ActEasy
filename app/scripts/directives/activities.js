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

        // Logic is going in here for future refactoring.
      }
    };
  });
