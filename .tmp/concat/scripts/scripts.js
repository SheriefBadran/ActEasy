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
  .config(["$routeProvider", "$httpProvider", function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'ViewCtrl',
        resolve: {
          view: ["$q", function ($q) {
            var defer = $q.defer();
            defer.resolve();

            return defer.promise;
          }]
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
          loadData: ["$q", "$http", function ($q, $http) {

            console.log('in load data');
            var defer = $q.defer();


            console.log(navigator.onLine);
            if (navigator.onLine) {

              $http.get('http://easyact-portfolio80.rhcloud.com/authenticate')
              //$http.get('http://localhost:8000/authenticate')
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
          }]
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
  }])
  .controller('AppCtrl', ["$scope", "$rootScope", "$location", function ($scope, $rootScope, $location) {

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
  }]);

'use strict';

/**
 * @ngdoc function
 * @name actEasy.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the actEasy
 */
angular.module('actEasy')
  .controller('MainCtrl', ["$scope", function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
'use strict';

/**
 * @ngdoc function
 * @name actEasy.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the actEasy
 */
angular.module('actEasy')
  .controller('AboutCtrl', ["$scope", function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);

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

      navigator.geolocation.getCurrentPosition(function (pos) {

        store.pos = pos.coords;
        console.log(navigator.onLine);
        if (navigator.onLine) {

          activityService.getActivities(store.pos)
            .success(function (data) {

              store.activities = data;
              //$scope.activities = data;
              localStorage.setItem('activities', JSON.stringify(data));
              console.log(JSON.parse(localStorage.getItem('activities')));
              console.log(data);
            });
        }
        else {
          console.log("do the offline work!");
          console.log(JSON.parse(localStorage.getItem('activities')));
          store.activities = JSON.parse(localStorage.getItem('activities'));
        }
      });
    });

  defer.resolve();

}]);

var ActivityDetailCtrl = activities.controller('ActivityDetailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

  var map;
  var directionsDisplay;
  var currentPosition;
  var directionsService = new google.maps.DirectionsService();
  var mapOptions = {};


  //$http.get('http://localhost:8000/activity-details?name=' + $routeParams.activityId)
  $http.get('http://easyact-portfolio80.rhcloud.com/activity-details?name=' + $routeParams.activityId)
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
'use strict';

/**
 * @ngdoc directive
 * @name scaffoldTestApp.directive:activities
 * @description
 * # activities
 */
angular.module('activities')

  .directive('activity', function() {
    return {
      templateUrl: "../../partials/activity-section.html",
      restrict: 'E',
      scope: {
        item: "="
      },
      controller: ["$scope", function ($scope) {

      }]
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name scaffoldTestApp.activityService
 * @description
 * # activityService
 * Service in the scaffoldTestApp.
 */
angular.module('services')
  .service('weatherService', ['$http', function ($http) {

     // AngularJS will instantiate a singleton by calling "new" on this function
    this.getWeather = function () {

      return $http.get('http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/56.68/lon/16.36/data.json');
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name scaffoldTestApp.activityService
 * @description
 * # locationService
 * Service in the scaffoldTestApp.
 */
angular.module('services')
  .service('activityService', ['$http', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.getActivities = function(pos){
      console.log('lat: ' + pos.latitude);
      console.log('lon: ' + pos.longitude);

      //return $http.get('http://localhost:8000/near-activities');
      return $http({
        //url: 'http://localhost:8000/near-activities',
        url: 'http://easyact-portfolio80.rhcloud.com/near-activities',
        method: "GET",
        params: {lat: pos.latitude, lon: pos.longitude}
      });
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name scaffoldTestApp.controller:ViewCtrl
 * @description
 * # ViewCtrl
 * Controller of the scaffoldTestApp
 */
angular.module('actEasy')
  .controller('ViewCtrl', ["$scope", function ($scope) {


    $scope.model = {
      message: "This is my app."
    }
  }]);

'use strict';

/**
 * @ngdoc service
 * @name scaffoldTestApp.authenticationService
 * @description
 * # authenticationService
 * Service in the scaffoldTestApp.
 */
angular.module('services')
  .service('authenticationService', ['$http', function ($http) {

    this.authenticate = function(){

      //return $http.get('http://localhost:8000/authenticate');
      return $http.get('http://easyact-portfolio80.rhcloud.com/authenticate');
    };
  }]);
