'use strict';

/**
 * @ngdoc overview
 * @name scaffoldTestApp
 * @description
 * # scaffoldTestApp
 *
 * Main module of the application.
 */
angular
  .module('products', []);
angular
  .module('scaffoldTestApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'products'
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
