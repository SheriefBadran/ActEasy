'use strict';

describe('Service: googleApiService', function () {

  // load the service's module
  beforeEach(module('scaffoldTestApp'));

  // instantiate service
  var googleApiService;
  beforeEach(inject(function (_googleApiService_) {
    googleApiService = _googleApiService_;
  }));

  it('should do something', function () {
    expect(!!googleApiService).toBe(true);
  });

});
