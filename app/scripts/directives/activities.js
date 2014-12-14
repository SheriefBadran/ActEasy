'use strict';

/**
 * @ngdoc directive
 * @name scaffoldTestApp.directive:activities
 * @description
 * # activities
 */
angular.module('scaffoldTestApp')
  .directive('activities', ['activityService','weatherService', function (activityService, weatherService) {
    return {
      transclude: true,
      restrict: 'E',
      controller: function ($scope) {
        $scope.activities = [];

        //activityService.success(function (data) {
        //
        //  $scope.activities = data;
        //});

        this.addActivity = function (activity) {
        };
      }
    };
  }])

  .directive('activity', function() {
    return {
      template: '<div>test</div>',
      restrict: 'E',
      require: '^activities',
      link: function (scope, element, attrs, ctrl) {

        ctrl.addActivity(element);
      }
    };
  });
