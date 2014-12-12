'use strict';

/**
 * @ngdoc directive
 * @name scaffoldTestApp.directive:tabgroup
 * @description
 * # tabgroup
 */
angular.module('products')

  .directive('tabgroup', function () {
    return {
      restrict: 'E',
      transclude: true,
      template: "<div ng-repeat='tab in tabs' ng-click='select(tab)' class='btn btn-default' ng-class='{active: tab.selected}'>{{ tab.title }}</div>"
      + "<div ng-transclude=''></div>",
      controller: function ($scope) {

        $scope.tabs = [];
        this.addTab = function (tab) {

          if ($scope.tabs.length === 0) {
            tab.selected = true;
          }
          $scope.tabs.push(tab);
        };

        $scope.select = function (tab) {

          angular.forEach($scope.tabs, function (eachTab) {

            // angular.equals(tab, eachTab) returns either true or false. It will return true if eachTab equals the clicked tab.
            eachTab.selected = angular.equals(tab, eachTab);
          });
        };
      }
    };
  })

  .directive('tab', function () {
    return {
      restrict: 'E',
      scope: {
        title: '@'
      },
      transclude: true,
      template: "<div ng-show='selected' ng-transclude=''></div>",
      require: "^tabgroup",
      link: function (scope, element, attrs, ctrl) {

        ctrl.addTab(scope);
      }
    };
  })

  .directive('productDescription', function () {
    return {
      restrict: 'E',
      scope: {
        item: '='
      },
      templateUrl: '../../partials/product-description.html'
    }
  })

  .directive('productSpecs', function () {
    return {
      restrict: 'A',
      scope: {
        item: '='
      },
      templateUrl: '../../partials/product-specs.html'
    }
  })

  .directive('productReviews', function () {
    return {
      restrict: 'E',
      scope: {
        reviewedProduct: '='
      },
      templateUrl: '../../partials/product-reviews.html'
    }
  });