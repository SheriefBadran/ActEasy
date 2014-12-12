'use strict';

describe('Directive: tabgroup', function () {

  // load the directive's module
  beforeEach(module('products'));

  var element,
    scope,
    controller;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  function click (e) {

    var event = document.createEvent('MouseEvent');
    //event.initMouseEvent(
    //  "click",
    //  true /* bubble */, true /* cancelable */,
    //  window, null,
    //  0, 0, 0, 0, /* coordinates */
    //  false, false, false, false, /* modifier keys */
    //  0 /*left*/, null
    //);


    e.dispatchEvent(event);
  };

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tabgroup><tab></tab><tab></tab></tabgroup>');

    element = $compile(element)(scope);
    scope.$digest();

    //console.log(element.querySelector('tab'));
    console.log(element);
    console.log(scope.tabs.length);
    expect(scope.tabs.length).toEqual(2);


    //expect(element.content);
    //var tab = element.querySelector('tab');
    //expect(tab.title.text()).toBe('Beskrivning');
    //click(tab);
    //expect(element.text()).toBe('this is the tabgroup directive');
  }));
});
