'use strict';

/**
 * @ngdoc function
 * @name scaffoldTestApp.controller:ActivityCtrl
 * @description
 * # ActivityCtrl
 * Controller of the scaffoldTestApp
 */
angular.module('scaffoldTestApp')
  .controller('ActivityCtrl', ['activityService', 'weatherService', function (activityService, weatherService) {

    // bind the data to be accessed from directives.
    var store = this;
    store.activities = [];
    store.weather = [];
    store.showOutdoors = false;

    activityService.getActivities()
      .success(function (data) {

        store.activities = data;
      })
      .then(function () {

        weatherService.getWeather()
          .success(function (data) {

            store.weather = data;
            console.log(store.activities);
            console.log(data);
            console.log(data.timeseries[3].t);
            if (data.timeseries[3].t < 10.0) {

              store.showOutdoors = true;
            }
          });
      });

    //weatherService.getWeather()
    //  .success(function (data) {
    //
    //    store.weather = data;
    //    console.log(data);
    //    console.log(data.timeseries[3].t);
    //    if (data.timeseries[3].t < 10.0) {
    //
    //      store.showOutdoors = true;
    //    }
    //  });

    // TODO: 7. $http.get('http://localhost:8000/activities') to get all activities and save all to local storage categorized indoors/outdoors.
  }]);
