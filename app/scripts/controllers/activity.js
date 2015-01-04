'use strict';

/**
 * @ngdoc function
 * @name scaffoldTestApp.controller:ActivityCtrl
 * @description
 * # ActivityCtrl
 * Controller of the scaffoldTestApp
 */
angular.module('activities')
  .controller('ActivityCtrl', ['activityService', 'weatherService', '$q', function (activityService, weatherService, $q) {

    // bind the data to be accessed from directives.
    var defer = $q.defer();
    var store = this;
    store.activities = [];
    store.weather = [];
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
            });
            //.then(function () {
            //  weatherService.getWeather(store.pos)
            //    .success(function (data) {
            //
            //      store.weather = data;
            //      console.log(store.activities);
            //      console.log(data);
            //      console.log(data.timeseries[3].t);
            //
            //      if (data.timeseries[3].t > 10.0) {
            //
            //        store.showOutdoors = true;
            //      }
            //    });
            //});

        });
      })

      // Then retrieve activities data.
      //.then(function () {
      //
      //  activityService.getActivities(store.pos)
      //    .success(function (data) {
      //
      //      store.activities = data;
      //    });
      //})

      // Then retrieve weather data.
      .then(function () {

        //weatherService.getWeather()
        //  .success(function (data) {
        //
        //    store.weather = data;
        //    console.log(store.activities);
        //    console.log(data);
        //    console.log(data.timeseries[3].t);
        //
        //    if (data.timeseries[3].t < 10.0) {
        //
        //      store.showOutdoors = true;
        //    }
        //  })
      });

      defer.resolve();

    // TODO: 7. $http.get('http://localhost:8000/activities') to get all activities and save all to local storage categorized indoors/outdoors.
  }]);
