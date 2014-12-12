'use strict';

/**
 * @ngdoc function
 * @name scaffoldTestApp.controller:StoreCtrl
 * @description
 * # StoreCtrl
 * Controller of the scaffoldTestApp
 */
angular.module('scaffoldTestApp')

  .controller('ActivitiesCtrl', function ($scope) {
    this.activities = activities;
  })

  .controller('ReviewController', function ($scope) {

    this.review = {};
    this.addReview = function (activity) {

      console.log(activity);
      this.review.createdOn = Date.now();
      activities.reviews.push(activity.review);

      // Clear out the review, reset form!
      this.review = {};
    };
  })

  .controller('AppController', ['$http', function ($http) {
    var store = this;
    store.weather = [];

      var config = {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      };

    //$http.get('http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/58.59/lon/16.18/data.json')
    //    .success(function (data) {
    //
    //      store.weather = data;
    //    });

    $http.get('http://localhost:8000/messages')
        .success(function (data) {

          store.weather = data;
        });
  }]);

var activities = [
  {
    name: 'Gokart',
    description: "HYR GOKART. Med hela 13 hästkrafter i motorn kan du ta dig upp mot 90 km/h. När man sitter bara ett par centimeter över backen känns det ännu häftigare än du kan föreställa dig.",
    tel: '031-757 49 00',
    price: 140.50,
    images: [ ],
    reviews: [
      {
        stars: 5,
        body: "Det var skitkul",
        author: "a@b.gmail.com"
      },
      {
        stars: 4,
        body: "Sådär faktiskt",
        author: "c@d.gamail.com"
      }
    ]
  },
  {
    name: 'DiscoBowling',
    description: "Festa till ditt besök hos oss med att spela discobowling! Vid bowlingbanorna släcker vi dem vanliga lamporna och sätter istället på UV-ljus och discobelysning med rökeffekter och pumpar upp blandad partymusik med gamla och nya hits!",
    tel: '031-123456',
    price: 300,
    images: [
      "images/image1.jpg",
      "images/image2.jpeg",
      "images/image3.jpeg"
    ],
    reviews: [
      {
        stars: 1,
        body: "Tråkigaste discobowling jag varit på!",
        author: "bowlare@gmail.com"
      },
      {
        stars: 2,
        body: "Grymt bra bowling, mycket brett ölutbud i baren!",
        author: "bers@gmail.com"
      }
    ]
  },
  {
    name: 'PainBall Göteborg',
    description: "Vi erbjuder er den bästa paintballupplevelsen i Göteborg. Ring oss och boka.",
    tel: '0766-585 000',
    price: 500,
    images: [
      "images/thumb1.jpg",
      "images/thumb2.jpg",
      "images/thumb3.jpg"
    ],
    reviews: [
      {
        stars: 3,
        body: "Inte kul, höll på att dö!",
        author: "klenis.grinig@gmail.com"
      },
      {
        stars: 4,
        body: "WOW!! Vilken kick!!",
        author: "kicken@gmail.com"
      }
    ]
  }
];
