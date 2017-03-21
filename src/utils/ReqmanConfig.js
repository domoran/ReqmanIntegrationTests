var fs = require("fs"),
    path = require("path");

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

    if (!env) 
    	env = process.env;

    if (!env.REQMANURL)
        throw "Missing REQMANURL configuration!";
    
    //if (!env.REQMANADMINUSER)
    //    throw "Missing REQMANADMINUSER configuration!";
    
    if (!env.REQMANADMINPASS)
        throw "Missing REQMANADMINPASS configuration!";

    var REQMANURL = env.REQMANURL;
    var REQMANTOKEN = env.REQMANTOKEN || "";
    var REQMANADMINUSER = env.REQMANADMINUSER;
    var REQMANADMINPASS = env.REQMANADMINPASS;
    var REQMANTESTUSERID = env.REQMANTESTUSERID || "";

    var result = {
        baseURL: REQMANURL,
        apiURL : REQMANURL + "/api/v1",
        token  : REQMANTOKEN,
        adminUser  : REQMANADMINUSER,
        adminPass  : REQMANADMINPASS,
        testUserId : REQMANTESTUSERID,
        

        write  : function () {
            var data = {
                REQMANURL : this["baseURL"],
                REQMANTOKEN: this["token"],
                REQMANADMINUSER: this["adminUser"],
                REQMANADMINPASS: this["adminPass"],
                REQMANTESTUSERID: this["testUserId"],
            };

            return fs.writeFileSync(configFile, JSON.stringify(data, null, 4));
        }
    };

    return result;

};
