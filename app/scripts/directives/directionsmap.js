'use strict';

/**
 * @ngdoc directive
 * @name ActEasy.directive:directionsMap
 * @description
 * # directionsMap
 */
angular.module('activities')
  .directive('directionsMap', ['googleApiService', function (google) {
    return {
      //templateUrl: "../../partials/activity-section.html",
      template: "<div></div>",
      restrict: 'E',
      scope: {
        activity: "="
      },
      link: function (scope) {

        console.log(scope);
        console.log(scope.activity);
      }
    };
  }]);
