'use strict';

describe('Directive: directionsMap', function () {

  // load the directive's module
  beforeEach(module('scaffoldTestApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<directions-map></directions-map>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the directionsMap directive');
  }));
});
