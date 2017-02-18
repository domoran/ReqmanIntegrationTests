var http = require("http");

var doThrow = false;
if (!process.env.REQMANSERVER) { console.log("You need to specify the REQMANSERVER environment variable to run these tests!"); doThrow = true; }
if (!process.env.REQMANAPIKEY) { console.log("You need to specify the REQMANAPIKEY environment variable to run these tests!"); doThrow = true; }

var REQMANURL = "http://" + process.env.REQMANSERVER;
var REQMANTOKEN = "Bearer " + process.env.REQMANAPIKEY;

if (doThrow) throw "Tests cannot start!";


var requestOptions = function () {
  var options = {
    hostname: 'localhost',
    port: 90,

    headers: {
      'Authorization': REQMANTOKEN,
    }
  };
  return options;
};

var ReqmanRequest = function () {

  var requests = {
    baseURL : REQMANURL,

    baseOptions: function (url) {
      var options = {
        hostname: 'localhost',
        port: 90,
        headers: {
          'Authorization': REQMANTOKEN
        }
      };

      if (url) options.path = url;
      return options;
    },

    getOptions: function (url) {
      var options = this.baseOptions(url);
      options.method = "GET";
      return options;
    },

    postOptions: function (url) {
      var options = this.baseOptions(url);
      options.method = "POST";
      options.headers["Content-Type"] = "application/json";
      return options;
    },


    call: function (options, data, callback) {
      var responseData = "";
      // console.log("Sending Request");
      // console.log(options);
      // if (data) console.log(data);

	    var req = http.request(options, (res) => {
        res.on('data', (chunk) => {
          if (chunk) responseData += chunk;
        });

        res.on('end', () => {
          var ct = res.headers["content-type"];
          if (ct && (ct.indexOf("application/json") >= 0 || ct.indexOf("text/json") >= 0)) responseData = JSON.parse(responseData);
          callback(res.statusCode, res.headers, responseData);
        });
      });

      if (data) req.write(data);
      req.end();
      return req;
    },

    get: function (url, callback) {
      options = this.getOptions(url);
      return this.call(options, null, callback);
    },

    post: function (url, data, callback) {
      options = this.postOptions(url);

      return this.call(options, JSON.stringify(data), callback);
    },




  };

  return requests;

};


module.exports = ReqmanRequest();
