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
  $scope.showLogout();
  var defer = $q.defer();
  var store = this;
  store.activities = [];
  store.activitiesError = "";
  store.offlineMessage = "";
  store.apiDownMessage = "";
  store.geoLocationDenied = "";
  store.serverErrorMessage = "";
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

  var defaultPosition = {
    coords: {
      latitude: 16.3577567,
      longitude: 56.6775846
    }
  };

  function activitiesCallback (pos) {

    console.log(pos);
    store.pos = pos.coords;
    activityService.getActivities(store.pos)
      .success(function (data) {
        console.log($scope);
        try {

          store.activities = JSON.parse(JSON.stringify(data));
          localStorage.setItem('activities', JSON.stringify(data));
        }
        catch (e) {

          store.activitiesError = "Ett fel inträffade när aktiviteterna skulle hämtas, var vänlig försök igen om en stund.";
        }
      })
      .error(function(data, status) {

        if (status === 500) {

          var cachedActivities = JSON.parse(localStorage.getItem('activities'));
          if (cachedActivities) {

            store.activities = cachedActivities;
            store.apiDownMessage = 'Easyact har för tillfället ingen tillgång till väderdata. Akvititeterna prioriteras efter senaste hämtade väderdatat.';
          }
          else if (data.length) {

            store.activities = data;
            store.apiDownMessage = 'Easyact har för tillfället ingen tillgång till väderdata. Aktiviteterna är därför inte prioriterade efter väder.';
          }
          else {
            console.log('server error!');
            store.serverErrorMessage = 'Ett serverfel har inträffat! Försök igen genom att ladda om sidan.';
          }
        }
      });
  }

  // Runs if geolocation is denied.
  function errorCallback (err) {

    if (err.code === 1) {

      activitiesCallback(defaultPosition);
      store.geoLocationDenied = "Easyact ser dig! Du sitter i kalmar nyckel.";

      // render cached activities if they exist.
      //TODO: If trouble, remove this if statement.
      if (localStorage.getItem('activities')) {

        store.activities = JSON.parse(localStorage.getItem('activities'));
      }
    }
  }


  defer.promise
    // First retrieve user position.
    .then(function () {
      if (navigator.onLine) {

        if (navigator.geolocation) {

          navigator.geolocation.getCurrentPosition(activitiesCallback, errorCallback);
        }
      }
      else {

        store.offlineMessage = localStorage.getItem('offlineMessage');
        store.activities = JSON.parse(localStorage.getItem('activities'));
      }
    });

  defer.resolve();

}]);

var ActivityDetailCtrl = activities.controller('ActivityDetailCtrl', ['$scope', '$routeParams', '$http', 'googleApiService',
  function($scope, $routeParams, $http, googleApiService) {

  var googleMapsDirectionsObject = googleApiService.getDirectionsLogicObject();
  if (navigator.onLine) {

    $http.get('http://localhost:8000/activity-details?name=' + $routeParams.activityId)
    //$http.get('http://easyact-portfolio80.rhcloud.com/activity-details?name=' + $routeParams.activityId)
      .success(function (activity) {

        $scope.activity = JSON.parse(JSON.stringify(activity));
        localStorage.setItem('activity', JSON.stringify(activity));
        $scope.userObj = {
          username: "name"
        };

      })
      .then(function () {

        var options = {
          enableHighAccuracy: true
        };

        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition(function(pos){

            // First parameter is a geoLocation position.coords and second parameter is an address object
            googleMapsDirectionsObject.init(pos, $scope.activity.address);
          }, function(e){

            console.log("Geolocation error " + e.code + ": " + e.message);
          }, options);
        }
      });
  }
  else {

    $scope.activity = JSON.parse(localStorage.getItem('activity'));
  }
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