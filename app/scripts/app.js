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
    'services'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .when('/about', {
        templateUrl: 'partials/tabMenu.html'
        //controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
