'use strict';

describe('Service: activityService', function () {

  // load the service's module
  beforeEach(module('scaffoldTestApp'));

  // instantiate service
  var activityService;
  beforeEach(inject(function (_activityService_) {
    activityService = _activityService_;
  }));

  it('should do something', function () {
    expect(!!activityService).toBe(true);
  });

});
