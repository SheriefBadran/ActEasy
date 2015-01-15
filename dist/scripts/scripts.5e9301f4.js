"use strict";angular.module("activities",["ngSanitize"]),angular.module("services",["ngSanitize"]),angular.module("actEasy",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch","activities","services","uiGmapgoogle-maps"]).config(["$routeProvider","$httpProvider",function(a){a.when("/",{templateUrl:"views/login.html"}).when("/about",{templateUrl:"views/about.html",controller:"ViewCtrl",resolve:{view:["$q",function(a){var b=a.defer();return b.resolve(),b.promise}]}}).when("/activities",{templateUrl:"views/main.html",controller:"ActivityListCtrl",resolve:{loadData:["$q","$http",function(a,b){var c=a.defer();return navigator.onLine?b.get("http://easyact-portfolio80.rhcloud.com/authenticate").success(function(a){localStorage.setItem("user",JSON.stringify(a.google)),localStorage.setItem("login","login"),c.resolve()}).error(function(){c.reject("Du måste vara inloggad för att se aktivitetslistan")}):(localStorage.setItem("offlineMessage","Du är inte ansluten till internet. Easyact är nu i offline-läge vilket innebär att du kan se de aktiviteter som senast laddades online."),c.resolve()),c.promise}]}}).when("/activities/:activityId",{templateUrl:"views/activity-detail.html",controller:"ActivityDetailCtrl"}).otherwise({redirectTo:"/"})}]).controller("AppCtrl",["$scope","$rootScope","$location",function(a,b,c){console.log("motherCtrl"),a.offlineMessage=localStorage.getItem("offlineMessage"),b.$on("$routeChangeError",function(b,d,e,f){a.showResponse=!0,a.loginResponse=f,c.path("/")})}]),angular.module("actEasy").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("actEasy").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]);var activities=angular.module("activities"),ActivityListCtrl=activities.controller("ActivityListCtrl",["activityService","$q","$scope",function(a,b){function c(b){console.log(b),f.pos=b.coords,a.getActivities(f.pos).success(function(a){try{f.activities=JSON.parse(JSON.stringify(a)),localStorage.setItem("activities",JSON.stringify(a))}catch(b){f.activitiesError="Ett fel inträffade när aktiviteterna skulle hämtas, var vänlig försök igen om en stund."}})}function d(a){1===a.code&&(c(g),f.geoLocationDenied="Easyact ser dig! Du sitter i kalmar nyckel.")}var e=b.defer(),f=this;f.activities=[],f.activitiesError="",f.offlineMessage="",f.geoLocationDenied="",f.showOutdoors=!0,f.showIndoors=!0,f.user=JSON.parse(localStorage.getItem("user")),f.pos=[],f.showOutdoorsOnly=function(){f.showOutdoors=!0,f.showIndoors=!1},f.showIndoorsOnly=function(){f.showOutdoors=!1,f.showIndoors=!0},f.showAll=function(){f.showOutdoors=!0,f.showIndoors=!0};var g={coords:{latitude:16.3577567,longitude:56.6775846}};e.promise.then(function(){navigator.onLine?navigator.geolocation&&navigator.geolocation.getCurrentPosition(c,d):(f.offlineMessage=localStorage.getItem("offlineMessage"),f.activities=JSON.parse(localStorage.getItem("activities")))}),e.resolve()}]),ActivityDetailCtrl=activities.controller("ActivityDetailCtrl",["$scope","$routeParams","$http","googleApiService",function(a,b,c,d){var e=d.getDirectionsLogicObject();navigator.onLine?c.get("http://easyact-portfolio80.rhcloud.com/activity-details?name="+b.activityId).success(function(b){a.activity=JSON.parse(JSON.stringify(b)),localStorage.setItem("activity",JSON.stringify(b)),a.userObj={username:"name"}}).then(function(){var b={enableHighAccuracy:!0};navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(b){e.init(b,a.activity.address)},function(a){console.log("Geolocation error "+a.code+": "+a.message)},b)}):a.activity=JSON.parse(localStorage.getItem("activity"))}]);angular.module("activities").directive("activity",function(){return{templateUrl:"../../partials/activity-section.html",restrict:"E",scope:{item:"="},controller:["$scope",function(){}]}}),angular.module("services").service("weatherService",["$http",function(a){this.getWeather=function(){return a.get("http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/56.68/lon/16.36/data.json")}}]),angular.module("services").service("activityService",["$http",function(a){this.getActivities=function(b){return console.log("lat: "+b.latitude),console.log("lon: "+b.longitude),a({url:"http://easyact-portfolio80.rhcloud.com/near-activities",method:"GET",params:{lat:b.latitude,lon:b.longitude}})}}]),angular.module("services").service("googleApiService",function(){this.getDirectionsLogicObject=function(){var a,b={renders:[],markers:[],add:function(c){var d={directions:c,draggable:!1,map:a,preserveViewport:!0,markerOptions:{draggable:!1}};d.markerOptions.visible=!1;var e=new google.maps.DirectionsRenderer(d);console.log(c.routes[0]);b.addMarker(c.routes[0].legs[0].end_location,!1);b.renders.push(e),b.computeTotalDistance(b),google.maps.event.addListener(e,"directions_changed",b.computeTotalDistance)},addMarker:function(c){var d={map:a,draggable:!1,position:c,icon:"http://maps.gstatic.com/mapfiles/markers2/marker_green"+String.fromCharCode(65+b.markers.length)+".png"},e=new google.maps.Marker(d);return b.markers.push(e),e},legs:function(a){for(var c=0;c<b.renders.length;c++)for(var d=0;d<b.renders[c].directions.routes[0].legs.length;d++)a(b.renders[c].directions.routes[0].legs[d])},getDirection:function(a){var c=new google.maps.DirectionsService,d={avoidHighways:!0,avoidTolls:!0,origin:a.origin,destination:a.destination,waypoints:a.waypoints,provideRouteAlternatives:!1,travelMode:google.maps.DirectionsTravelMode.DRIVING};c.route(d,function(a,c){c==google.maps.DirectionsStatus.OK?b.add(a):console.log(c)})},error:function(a){console.log("Geolocation error "+a.code+": "+a.message)},computeTotalDistance:function(a){var b=0;a.legs(function(a){console.log(a),b+=a.distance.value}),b/=1e3}},c=function(c,d){var e=new google.maps.LatLng(c.coords.latitude,c.coords.longitude),f={zoom:10,center:e,mapTypeId:google.maps.MapTypeId.ROADMAP},g=document.getElementById("map");a=new google.maps.Map(g,f),b.addMarker(e),b.getDirection({origin:new google.maps.LatLng(c.coords.latitude,c.coords.longitude),destination:d.street+" "+d.postalcode+", "+d.city})};return{init:c}}}),angular.module("actEasy").controller("ViewCtrl",["$scope",function(a){a.model={message:"This is my app."}}]),angular.module("services").service("authenticationService",["$http",function(a){this.authenticate=function(){return a.get("http://localhost:8000/authenticate")}}]);