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
      .when('/activities', {
        templateUrl: 'views/main.html',
        controller: 'ActivityListCtrl',
        resolve: {
          loadData: ["$q", "$http", function ($q, $http) {

            var defer = $q.defer();

            if (navigator.onLine) {

              $http.get('http://easyact-portfolio80.rhcloud.com/authenticate')
              //$http.get('http://localhost:8000/authenticate')
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
  }])
  .controller('AppCtrl', ["$scope", "$rootScope", "$location", function ($scope, $rootScope, $location) {
    console.log('motherCtrl');

    //var store = this;
    //if (localStorage.getItem('login') === 'login') {
    //
    //  store.login = true;
    //}
    //
    //store.logout = function () {
    //
    //  if (localStorage.getItem('login') === 'login') {
    //    console.log('mistake');
    //    localStorage.setItem('login', 'logout');
    //  }
    //};

    $scope.offlineMessage = localStorage.getItem('offlineMessage');

    $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {

      $scope.showResponse = true;
      $scope.loginResponse = rejection;
      $location.path('/')
    });
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
  store.activitiesError = "";
  store.offlineMessage = "";
  store.geoLocationDenied = "";
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

        try {

          store.activities = JSON.parse(JSON.stringify(data));
          localStorage.setItem('activities', JSON.stringify(data));
        }
        catch (e) {

          store.activitiesError = "Ett fel inträffade när aktiviteterna skulle hämtas, var vänlig försök igen om en stund.";
        }
      });
  }

  function errorCallback (err) {

    if (err.code === 1) {

      activitiesCallback(defaultPosition);
      store.geoLocationDenied = "Easyact ser dig! Du sitter i kalmar nyckel.";
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

    //$http.get('http://localhost:8000/activity-details?name=' + $routeParams.activityId)
      $http.get('http://easyact-portfolio80.rhcloud.com/activity-details?name=' + $routeParams.activityId)
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
 * @ngdoc service
 * @name scaffoldTestApp.googleApiService
 * @description
 * # googleApiService
 * Service in the scaffoldTestApp.
 */
angular.module('services')
  .service('googleApiService', function () {

    this.getDirectionsLogicObject = function () {


      var directionsObject = {
        renders: [],
        markers: [],

        add: function(directions){
          // draggable makes direction line adapt when markers are dragged
          var options = {
            directions: directions,
            draggable: false,
            map: map,
            preserveViewport: true,
            markerOptions: {
              draggable: false
            }
          };

          options.markerOptions.visible = false;


          // create directions renderer object
          var directionsRenderer = new google.maps.DirectionsRenderer(options);


          console.log(directions.routes[0]);
          var marker = directionsObject.addMarker(directions.routes[0].legs[0].end_location, false);

          directionsObject.renders.push(directionsRenderer);

          directionsObject.computeTotalDistance(directionsObject);

          google.maps.event.addListener(directionsRenderer, 'directions_changed', directionsObject.computeTotalDistance);
        },

        addMarker: function(position, dragBoolean){

          // draggable makes markers draggable
          var markerOptions = {
            map: map,
            draggable: false,
            position: position,
            // marker icon
            icon: 'http://maps.gstatic.com/mapfiles/markers2/marker_green' + String.fromCharCode(65 + directionsObject.markers.length) + '.png'
          };
          var marker = new google.maps.Marker(markerOptions);
          directionsObject.markers.push(marker);
          return marker;
        },

        legs: function(callback) {

          for (var i = 0; i < directionsObject.renders.length; i++) {
            for (var j = 0; j < directionsObject.renders[i].directions.routes[0].legs.length; j++) {
              callback(directionsObject.renders[i].directions.routes[0].legs[j])
            }
          }
        },
        getDirection: function(route) {

          var directionsService = new google.maps.DirectionsService();
          var request = {
            avoidHighways: true,
            avoidTolls: true,
            origin: route.origin,
            destination: route.destination,
            waypoints: route.waypoints,
            provideRouteAlternatives: false,
            travelMode: google.maps.DirectionsTravelMode.DRIVING // DRIVING
          };
          var response;
          directionsService.route(request, function(response, status) {

            if (status == google.maps.DirectionsStatus.OK) {
              directionsObject.add(response);
            }
            else{
              console.log(status);
            }
          });
        },
        error: function(e){

          console.log("Geolocation error " + e.code + ": " + e.message);
        },
        computeTotalDistance: function computeTotalDistance(directionObj) {
          var total = 0;

          directionObj.legs(function(leg){
            console.log(leg);
            total += leg.distance.value;
          });

          total = total / 1000;
        }
      };

      var map;
      var init = function(startPos, destAddress){

        // TODO: Validate input pos and address. Handle input in a dynamic way so that it is possible to use either address or pos.
        var latlng = new google.maps.LatLng(startPos.coords.latitude, startPos.coords.longitude);
        var mapOptions = {
          zoom: 10,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var mapHolder = document.getElementById('map');
        map = new google.maps.Map(mapHolder, mapOptions);
        directionsObject.addMarker(latlng);

        directionsObject.getDirection({
          origin: new google.maps.LatLng(startPos.coords.latitude, startPos.coords.longitude),
          destination: destAddress.street + " " + destAddress.postalcode + ", " + destAddress.city
        });
      };

      return {
        init: init
      };
    };
  });

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
//TODO: This module is currently not used. Dependency inject it into app.js
angular.module('services')
  .service('authenticationService', ['$http', function ($http) {

    this.authenticate = function(){

      return $http.get('http://localhost:8000/authenticate');
      //return $http.get('http://easyact-portfolio80.rhcloud.com/authenticate');
    };
  }]);
