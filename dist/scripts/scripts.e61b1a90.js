"use strict";angular.module("activities",[]),angular.module("services",[]),angular.module("actEasy",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch","activities","services"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html"}).when("/about",{templateUrl:"partials/tabMenu.html"}).otherwise({redirectTo:"/"})}]),angular.module("actEasy").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("actEasy").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("activities").controller("ActivityCtrl",["activityService","weatherService",function(a,b){var c=this;c.activities=[],c.weather=[],c.showOutdoors=!1,a.getActivities().success(function(a){c.activities=a}).then(function(){b.getWeather().success(function(a){c.weather=a,console.log(c.activities),console.log(a),console.log(a.timeseries[3].t),a.timeseries[3].t<10&&(c.showOutdoors=!0)})})}]),angular.module("activities").directive("activity",function(){return{templateUrl:"../../partials/activity-section.html",restrict:"E",scope:{item:"="},controller:["$scope",function(){}]}}),angular.module("services").service("weatherService",["$http",function(a){this.getWeather=function(){return a.get("http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/56.68/lon/16.36/data.json")}}]),angular.module("services").service("activityService",["$http",function(a){this.getActivities=function(){return a.get("http://localhost:8000/near-activities")}}]);