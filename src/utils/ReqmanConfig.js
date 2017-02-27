var fs = require('fs'),
    path = require('path');

var configFile = path.normalize(path.join(__dirname, "..", "..", "reqman_config.json"));

module.exports = function (env) {
  if (!env) {
    try {
      var stat = fs.statSync(configFile);
      if (stat.isFile()) {
        env = JSON.parse(fs.readFileSync(configFile));
      }
    } catch (e) {
      // no config file
    }
  }

  if (!env) env = process.env;

  if (!env.REQMANURL)
    throw "Missing REQMANURL configuration!";

  var REQMANURL = env.REQMANURL;
  var REQMANTOKEN = env.REQMANTOKEN || "";

  var result = {
    baseURL: REQMANURL,
    apiURL : REQMANURL + "/api/v1",
    token  : REQMANTOKEN,

    write  : function () {
      var data = {
        REQMANURL : this["baseURL"],
        REQMANTOKEN: this["token"],
      };

      return fs.writeFileSync(configFile, JSON.stringify(data, null, 4));
    }
  };

  return result;

};
