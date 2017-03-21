var http = require("http"),
    url = require("url");

var LOGREQUESTS = false;

var makeOptions = function (method, uri, headers) {
    var urlConfig = url.parse(uri);

  // console.log(urlConfig);

    if (urlConfig.protocol != "http:" && urlConfig.protocol != "https:")
        throw "No protocol defined in URI: " + uri;

    var options = {
        method: method,
        path: urlConfig.path || "/",
        hostname: urlConfig.hostname || "localhost",
        port: urlConfig.port || 80,
        headers: headers || {},
    };

    return options;
};

var callhttp = function (options, callback) {
    if (LOGREQUESTS) { console.log("Issuing Request: "); console.log(options); }
    var req = http.request(options, function (response) {
        var data = "";

        response.on("data", function(chunk) { if (chunk) data += chunk; });

        response.on("end", function () {
            if (LOGREQUESTS) {
                console.log("GOT RESPONSE (" + response.statusCode + ")");
                console.log(response.headers);
                console.log(data);
            }
            callback(response.statusCode, response.headers, data);
        });
    });

    return req;
};

module.exports = function (baseURL) {
    return {
        get: function (uri, headers, callback) {
            var options = makeOptions("GET", baseURL + uri, headers);

            var req = callhttp(options, callback);
            req.end();
        },

        download: function(uri, headers, callback) {
            var options = makeOptions("GET", baseURL + uri, headers);

            var req = http.request(options, function (response) {
                if (response.statusCode >= 300) {
                    callback("Error downloading url " + baseURL + uri + "!", response);
                } else {
                    callback(null, response);
                }
            });
            req.end();
        },

        post: function (uri, headers, data, callback) {
            var options = makeOptions("POST", baseURL + uri, headers);

            var req = callhttp(options, callback);
            if (data) req.write(data);
            req.end();
        },
        
        put: function (uri, headers, data, callback) {
            var options = makeOptions("PUT", baseURL + uri, headers);

            var req = callhttp(options, callback);
            if (data) req.write(data);
            req.end();
        },
        
        del: function (uri, headers, callback) {
            var options = makeOptions("DELETE", baseURL + uri, headers);

            var req = callhttp(options, callback);
            req.end();
        },
    };
};
