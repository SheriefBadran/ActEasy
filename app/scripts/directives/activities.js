'use strict';

/**
 * @ngdoc directive
 * @name scaffoldTestApp.directive:activities
 * @description
 * # activities
 */
angular.module('scaffoldTestApp')

  .directive('activity', function() {
    return {
      templateUrl: "../../partials/activity-section.html",
      restrict: 'E',
      scope: {
        item: "="
      },
      controller: function ($scope) {


      }
    };
  });
