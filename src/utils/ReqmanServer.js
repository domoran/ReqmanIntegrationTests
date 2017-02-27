var fs = require('fs'),
    path = require('path'),
    async = require('async');

var checkFile = function (item, callback) {
  console.log(item);
    fs.stat(item, function (err, stat) {
      if (err || !stat.isFile())
        callback("Reqman file '" + item + "' was not found!", null);
      else
        callback(null, stat);
    });
}

var createServer = function (exec) {
}

var getReqmanServer = function (reqmanpath, connectionString, port, callback) {
  var exec     = path.join(reqmanpath, "reqman.exe");
  var settings = path.join(reqmanpath, "appsettings.json");
  var license  = path.join(reqmanpath, "wwwroot", "license.lic");
  var hosting  = path.join(reqmanpath, "hosting.json");

  async.each( [exec, settings, license, hosting] , checkFile, function(err, stat) {
    var server = null;
    if (!err) server = createServer(exec, settings, license, hosting)
    callback(err, server);
  });
}


exports.server = {
   get : function(reqmanpath, connectionString, port, callback) {
      prepareServer(reqmanpath, connectionString, port);
   }
};
