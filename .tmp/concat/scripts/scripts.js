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
        templateUrl: 'views/main.html'
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
        templateUrl: 'views/main.html'
        //resolve: {
        //  view: function ($q, $http) {
        //
        //    var defer = $q.defer();
        //
        //    $http.get('http://easyact-portfolio80.rhcloud.com/authenticate').success(function(response) {
        //    //$http.get('http://localhost:8000/authenticate').success(function(response) {
        //
        //        console.log(response);
        //        defer.resolve();
        //        return defer.promise;
        //    });
        //
        //    defer.reject();
        //    //defer.resolve();
        //  }
        //}
      })
      .when('/activities/:activityId', {
        templateUrl: 'views/activity-detail.html',
        controller: 'ActivityDetailCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // Executed for statuscodes >= 300
    $httpProvider.interceptors.push(["$q", "$location", function ($q, $location) {
      return {
        responseError: function (rejection) {
          if (rejection.status === 401) {
            console.log('NOT AUTHORIZED!');
            $location.path('/');
          }
          return $q.reject(rejection);
        }
      }
    }])
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
angular.module('activities')
  .controller('ActivityListCtrl', ['activityService', '$q', '$scope', function (activityService, $q, $scope) {

    // bind the data to be accessed from directives.
    var defer = $q.defer();
    var store = this;
    store.activities = [];
    store.showOutdoors = true;
    store.showIndoors = true;
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
          activityService.getActivities(store.pos)
            .success(function (data) {

              store.activities = data;
              console.log(data);
            });
        });
      });

    defer.resolve();

    // TODO: 7. $http.get('http://localhost:8000/activities') to get all activities and save all to local storage categorized indoors/outdoors.
  }])

  .controller('ActivityDetailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

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

'use strict';

/**
 * @ngdoc directive
 * @name ActEasy.directive:directionsMap
 * @description
 * # directionsMap
 */
angular.module('activities')
  .directive('directionsMap', ['googleApiService', function (google) {
    return {
      //templateUrl: "../../partials/activity-section.html",
      template: "<div></div>",
      restrict: 'E',
      scope: {
        activity: "="
      },
      link: function (scope) {

        console.log(scope);
        console.log(scope.activity);
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name scaffoldTestApp.googleApiService
 * @description
 * # googleApiService
 * Service in the scaffoldTestApp.
 */
angular.module('services')
  .service('googleApiService', function () {

    return google;
  });
