var createServer = require("./lib/server.js");
var http = require('http');

describe('Test Framework', function () {
  var server = null;

  beforeEach(function () {
  	server = createServer().listen(6778);
  });

  afterEach(function () {
		if (server != null) server.close();
  });

  it('should have a working web server', function() {
    browser.ignoreSynchronization = true;
    browser.get('http://localhost:6778');
    expect(browser.getTitle()).toEqual('Hello World!');
    browser.ignoreSynchronization = false;
  });

  it('should be able to serve files to reqman', function (done) {
		http.get("http://localhost:6778/data/little.pdf", function(res) {
					expect(res.statusCode).toEqual(200);
					done();
		});
  });

  it('should return a 404 for missing files', function (done) {
		http.get("http://localhost:6778/nosuchfile.what", function(res) {
					expect(res.statusCode).toEqual(404);
					done();
		});
  });


});
