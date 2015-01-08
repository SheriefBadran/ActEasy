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
        templateUrl: 'views/main.html'
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
        resolve: {
          view: function ($q, $http) {

            var defer = $q.defer();
            // http://easyact-portfolio80.rhcloud.com
            // http://localhost:8000
            $http.get('http://localhost:8000/authenticate').success(function(response) {

                console.log(response);
                defer.resolve();
                return defer.promise;
            });

            defer.reject();
            //defer.resolve();
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
    $httpProvider.interceptors.push(function ($q, $location) {
      return {
        responseError: function (rejection) {
          if (rejection.status === 401) {
            console.log('NOT AUTHORIZED!');
            $location.path('/');
          }
          return $q.reject(rejection);
        }
      }
    })
  });
