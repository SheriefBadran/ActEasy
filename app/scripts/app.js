'use strict';

/**
 * @ngdoc overview
 * @name actEasy
 * @description
 * # actEasy
 *
 * Main module of the application.
 */
angular
  .module('activities', []);

angular
  .module('services', []);

angular
  .module('actEasy', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'activities',
    'services',
    'uiGmapgoogle-maps'
  ])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'ViewCtrl',
        resolve: {
          view: function ($q) {
            var defer = $q.defer();
            defer.resolve();

            return defer.promise;
          }
        }
      })
      .when('/auth', {
        controller: function () {
          console.log('hej');
        }
      })
      .when('/activities', {
        templateUrl: 'views/main.html',
        controller: 'ActivityListCtrl',
        resolve: {
          loadData: function ($q, $http) {

            console.log('in load data');
            var defer = $q.defer();


            console.log(navigator.onLine);
            if (navigator.onLine) {

              //$http.get('http://easyact-portfolio80.rhcloud.com/authenticate')
              $http.get('http://localhost:8000/authenticate')
                .success(function(response, status) {

                  localStorage.setItem('user', JSON.stringify(response.google));
                  defer.resolve();
                })
                .error(function(response) {

                    defer.reject("Du måste vara inloggad för att se aktivitetslistan");
                });
            }
            else {

              console.log("server down");
              //$rootScope.offline = true;

              //defer.resolve();
              defer.reject("offline");
            }

            return defer.promise;
          }
        }
      })
      .when('/activities/:activityId', {
        templateUrl: 'views/activity-detail.html',
        controller: 'ActivityDetailCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // Executed for statuscodes >= 300
    //$httpProvider.interceptors.push(function ($q, $location) {
    //  return {
    //    responseError: function (rejection) {
    //      if (rejection.status === 401) {
    //        console.log('NOT AUTHORIZED!');
    //        $location.path('/');
    //      }
    //      return $q.reject(rejection);
    //    }
    //  }
    //})
  })
  .controller('AppCtrl', function ($scope, $rootScope, $location) {

    $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {

      if (rejection === "offline") {

        console.log("YES!!");
        $scope.activities = JSON.parse(localStorage.getItem('activities'));
        $scope.offline = true;
      }
      else {

        $scope.showResponse = true;
        $scope.loginResponse = rejection;
        $location.path('/');
      }

    })
  });
