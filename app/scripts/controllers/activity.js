'use strict';

/**
 * @ngdoc function
 * @name ActEasy.controller:ActivityListCtrl
 * @description
 * # ActivityListCtrl
 * Controller of the ActEasy App
 */
angular.module('activities')
  .controller('ActivityListCtrl', ['activityService', '$q', function (activityService, $q) {

    // bind the data to be accessed from directives.
    var defer = $q.defer();
    var store = this;
    store.activities = [];
    store.showOutdoors = false;
    store.pos = [];

    defer.promise
      // First retrieve user position.
      .then(function () {

        navigator.geolocation.getCurrentPosition(function (pos) {

          store.pos = pos.coords;
          activityService.getActivities(store.pos)
            .success(function (data) {

              store.activities = data;
              console.log(data);
            });
        });
      });

    defer.resolve();

    // TODO: 7. $http.get('http://localhost:8000/activities') to get all activities and save all to local storage categorized indoors/outdoors.
  }])

  .controller('ActivityDetailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

    console.log($routeParams);


    $scope.activityId = $routeParams.activityId;

    $http.get('http://localhost:8000/activity-details?name=' + $routeParams.activityId)
      .success(function (activity) {

        $scope.activity = activity;
      });
  }]);
