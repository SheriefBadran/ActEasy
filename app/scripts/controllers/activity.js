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
    store.showOutdoors = true;
    store.showIndoors = true;

    store.pos = [];

    store.showOutdoorsOnly = function () {

      store.showOutdoors = true;
      store.showIndoors = false;
    };

    store.showIndoorsOnly = function () {

      store.showOutdoors = false;
      store.showIndoors = true;
    };

    store.showAll = function () {

      store.showOutdoors = true;
      store.showIndoors = true;
    };



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

    var map;
    var directionsDisplay;
    var currentPosition;
    var directionsService = new google.maps.DirectionsService();
    var mapOptions = {};


    $http.get('http://localhost:8000/activity-details?name=' + $routeParams.activityId)
    //$http.get('http://easyact-portfolio80.rhcloud.com/activity-details?name=' + $routeParams.activityId)
      .success(function (activity) {

        $scope.activity = activity;
        $scope.userObj = {
          username: "name"
        };
      })
      .then(function () {

        navigator.geolocation.getCurrentPosition(function (pos) {

          directionsDisplay = new google.maps.DirectionsRenderer();
          currentPosition = new google.maps.LatLng(pos.latitude, pos.longitude);

          mapOptions.zoom = 7;
          mapOptions.center = currentPosition;

          map = new google.maps.Map(document.getElementById('map'), mapOptions);
          directionsDisplay.setMap(map);
          calculateRoute(pos);
        });
      });

    var calculateRoute = function (pos) {

      var start = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      var end = $scope.activity.address.street + " " + $scope.activity.address.postalcode + ", " + $scope.activity.address.city;
      var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function (response, status) {

        if (status === google.maps.DirectionsStatus.OK) {

          directionsDisplay.setDirections(response);
        }
      })
    };
  }]);
