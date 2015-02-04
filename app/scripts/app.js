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
  .module('activities', ['ngSanitize']);

angular
  .module('services', ['ngSanitize']);

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
      .when('/activities', {
        templateUrl: 'views/main.html',
        controller: 'ActivityListCtrl',
        resolve: {
          loadData: function ($q, $http) {

            var defer = $q.defer();

            if (navigator.onLine) {

              //$http.get('http://easyact-portfolio80.rhcloud.com/authenticate')
              $http.get('http://localhost:8000/authenticate')
                .success(function(response) {

                  localStorage.setItem('user', JSON.stringify(response.google));
                  localStorage.setItem('login', 'login');
                  defer.resolve();
                })
                .error(function(response) {

                    defer.reject("Du måste vara inloggad för att se aktivitetslistan");
                });
            }
            else {

              localStorage.setItem('offlineMessage', "Du är inte ansluten till internet. Easyact är nu i offline-läge vilket innebär att du kan" +
              " se de aktiviteter som senast laddades online.");
              defer.resolve();
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
  })
  .controller('AppCtrl', function ($scope, $rootScope, $location) {

    $scope.login = false;
    $scope.offlineMessage = localStorage.getItem('offlineMessage');

    this.hideLogout = function () {

      $scope.login = false;
    };

    $scope.showLogout = function () {

      if ($scope.login === false) {

        $scope.login = true;
      }
    };

    $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {

      $scope.showResponse = true;
      $scope.loginResponse = rejection;
      $location.path('/')
    });
  });
