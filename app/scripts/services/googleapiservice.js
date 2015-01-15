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
