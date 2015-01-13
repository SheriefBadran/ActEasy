'use strict';

/**
 * @ngdoc function
 * @name ActEasy.controller:ActivityListCtrl
 * @description
 * # ActivityListCtrl
 * Controller of the ActEasy App
 */
var activities = angular.module('activities');

var ActivityListCtrl = activities.controller('ActivityListCtrl', ['activityService', '$q', '$scope', function (activityService, $q, $scope) {

  // bind the data to be accessed from directives.
  var defer = $q.defer();
  var store = this;
  store.activities = [];
  store.showOutdoors = true;
  store.showIndoors = true;
  store.user = JSON.parse(localStorage.getItem('user'));

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

      console.log('you are at the geolocation!');

      if (navigator.onLine) {
        console.log("geolocation is sets of");
        navigator.geolocation.getCurrentPosition(function (pos) {

          store.pos = pos.coords;

          activityService.getActivities(store.pos)
            .success(function (data) {

              store.activities = data;
              //$scope.activities = data;
              localStorage.setItem('activities', JSON.stringify(data));
              console.log(JSON.parse(localStorage.getItem('activities')));
              console.log(data);
            });
        });
      }
      else {

        console.log("do the offline work!");
        console.log(JSON.parse(localStorage.getItem('activities')));
        store.activities = JSON.parse(localStorage.getItem('activities'));
      }
    });

  defer.resolve();

}]);

var ActivityDetailCtrl = activities.controller('ActivityDetailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

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

// This would not run on openshift!! Spent 5 hours to find that out!!
//ActivityListCtrl.loadData = function ($q, $http) {
//
//  console.log('in load data');
//  var defer = $q.defer();
//
//  $http.get('http://easyact-portfolio80.rhcloud.com/authenticate')
//    //$http.get('http://localhost:8000/authenticate')
//    .success(function(response, status) {
//
//      defer.resolve();
//    })
//    .error(function(response) {
//
//      // if response is null, server is down.
//      if (response === null) {
//
//        defer.resolve();
//      }
//      else {
//
//        defer.reject();
//      }
//    });
//
//
//  return defer.promise;
//};