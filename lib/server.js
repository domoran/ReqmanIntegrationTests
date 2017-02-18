var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "pdf": "application/pdf",
    "js": "text/javascript",
    "css": "text/css"};

module.exports = function () {
	  var server = http.createServer(function(req, res) {
      var uri = url.parse(req.url).pathname;

      // If no URI is passed or the root is queried return a hello world html page
      if (!uri || uri == "/") {
        res.writeHead(200, {"Content-Type" : "text/html"});
        res.end("<HTML><head><title>Hello World!</title></head><body><p>Hi!</p></body></HTML>");
        return;
      }
      var requestData = "";

      req.on('data', function(chunk) {
          requestData += chunk;
      });

      req.on('end', function () {
          if (server.urlCallbacks[uri]) {
            if (req.headers["content-type"] && req.headers["content-type"].indexOf("/json") >= 0) {
              requestData = JSON.parse(requestData);
            }

            server.urlCallbacks[uri](req.headers, requestData);
          }
      });

      // return the file from the query
      var filename = path.join(process.cwd(), uri);

      fs.stat(filename, function(error, stat) {
          if(error || !stat.isFile) {
              res.writeHead(404, {'Content-Type': 'text/plain'});
              res.write('404 Not Found\n');
              res.end();
              return;
          }

          var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
          res.writeHead(200,  {'Content-Type': mimeType} );

          var fileStream = fs.createReadStream(filename);
          fileStream.pipe(res);
      }); //end path.exists
    });

    server.urlCallbacks = {};
    server.onURI        = function (uri, callback) { server.urlCallbacks[uri] = callback; }
    return server;
};
