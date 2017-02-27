var createServer = require("../Webserver.js");
var http = require('http');

describe('Webserver', function () {
  var server = null;

  beforeEach(function () {
  	server = createServer().listen(6778);
  });

  afterEach(function () {
		if (server != null) server.close();
  });

  it('should serve a root page with hello world', function(done) {
    http.get('http://localhost:6778', function (response) {
      expect(response.statusCode).toBe(200);
      response.on('data', function (chunk) {
        expect(chunk).toContain('Hello World!');
        done();
      });
    });
  });

  it('should be able to serve files from the data directory', function (done) {
		http.get("http://localhost:6778/data/little.pdf", function(res) {
					expect(res.statusCode).toEqual(200);
					done();
		});
  })

  it('should return a 404 for missing files', function (done) {
		http.get("http://localhost:6778/nosuchfile.what", function(res) {
					expect(res.statusCode).toEqual(404);
					done();
		});
  });

  it('should be able to register callback URLs', function (done) {
    server.onURI('/muuh', function (headers, data) {
      expect(headers["test-header"]).toBe( "oh yeah");
      expect(headers["content-type"]).toBe("text-plain");
      expect(data).toBe("What a feeling!");
      done();
    });

    var req = http.request( {method: "POST",  port: 6778, path: "/muuh", headers: { "test-header" : "oh yeah", "content-type": "text-plain" }} );
    req.write("What a feeling!");
    req.end();
  }, 1000);


});
