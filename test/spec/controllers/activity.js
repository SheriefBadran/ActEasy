'use strict';

describe('Controller: ActivityCtrl', function () {

  // load the controller's module
  beforeEach(module('scaffoldTestApp'));

  var ActivityCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivityCtrl = $controller('ActivityCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
