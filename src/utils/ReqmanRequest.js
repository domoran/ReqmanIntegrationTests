var Request = require("./Request");

/*
  automatically convert JSON responses to JSON
*/
var wrap_response = function (callback) {
    return function (status, headers, data) {
        if (headers["content-type"] && headers["content-type"].indexOf("/json") >= 1) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.log("Warning request returned invalid json data: ###" + data + "###");
            }
        }

        return callback(status, headers, data);
    };
};

module.exports = function (reqmanConfig) {

    var request = Request(reqmanConfig.apiURL);

    return {
        get: function (uri, callback) {
            var headers = {
                authorization : "Bearer " + reqmanConfig.token,
                accept: "application/json",
            };

            return request.get(uri, headers, wrap_response(callback) );
        },

        download: function(uri, callback) {
            var headers = {
                authorization : "Bearer " + reqmanConfig.token,
                accept: "application/json",
            };

            return request.download(uri, headers, callback);
        },

        post: function (uri, data, callback) {
            var headers = {
                authorization : "Bearer " + reqmanConfig.token,
                "content-type": "application/json",
                accept: "application/json",
            };

            return request.post(uri, headers, JSON.stringify(data), wrap_response(callback) );
        },
        
        put: function (uri, data, callback) {
            var headers = {
                authorization : "Bearer " + reqmanConfig.token,
                "content-type": "application/json",
            };

            return request.put(uri, headers, JSON.stringify(data), callback );
        },
        
        del: function (uri, callback) {
            var headers = {
                authorization : "Bearer " + reqmanConfig.token,
            };

            return request.del(uri, headers, callback );
        },

    };
};

