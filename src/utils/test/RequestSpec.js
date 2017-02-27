var Request = require('../Request'),
    nock = require('nock');

describe('Requests', function () {
  it('Should support get requests', function (done) {
    var request = nock('http://baseurl')
    .get('/get')
    .matchHeader('header', 'test')
    .reply(200, 'response', { response_header: 'test' } );

    var r = Request('http://baseurl');

    r.get('/get', { header: 'test' }, function (status, headers, data) {
      expect(data).toEqual("response");
      expect(headers).toEqual({ response_header: 'test' });
      done();
    });
  }, 500);

  it('Should support post requests', function (done) {
    var request = nock('http://baseurl')
    .post('/post', 'request-body')
    .matchHeader('request-header', 'x')
    .reply(200, 'response-body', { response_header: 'test' } );

    var r = Request('http://baseurl');

    r.post('/post', { "request-header": "x" }, "request-body", function (status, headers, data) {
      expect(data).toEqual("response-body");
      expect(headers).toEqual({ response_header: 'test' });
      done();
    });
  }, 500);
});
