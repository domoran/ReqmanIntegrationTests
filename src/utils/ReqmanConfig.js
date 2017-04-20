var fs = require("fs"),
    path = require("path");

var configFile = path.normalize(path.join(__dirname, "..", "..", "reqman_config.json"));

module.exports = function (configData) {
    if (!configData) {
        try {
            var stat = fs.statSync(configFile);
            if (stat.isFile()) {
            	configData = JSON.parse(fs.readFileSync(configFile));
            }
        } catch (e) {
      // no config file
        }
    }

    if (!configData) {
    	env = process.env;
    	configData = {
    			REQMANURL : env.REQMANURL,
    		    REQMANADMINUSER : env.REQMANADMINUSER,
    		    REQMANADMINPASS : env.REQMANADMINPASS
    	}
    }

    if (!configData.REQMANURL)
        throw "Missing REQMANURL configuration!";
    
    if (!configData.REQMANADMINUSER)
        throw "Missing REQMANADMINUSER configuration!";
    
    if (!configData.REQMANADMINPASS)
        throw "Missing REQMANADMINPASS configuration!";

//    var REQMANURL = configData.REQMANURL;
//    var REQMANTOKEN = configData.REQMANTOKEN || "";
//    var REQMANADMINUSER = env.REQMANADMINUSER;
//    var REQMANADMINPASS = env.REQMANADMINPASS;
//    var REQMANTESTUSERID = env.REQMANTESTUSERID || "";
//    var REQMANTESTROLEID = env.REQMANTESTROLEID || "";
    
    var result = {
        baseURL: configData["REQMANURL"],
        apiURL : configData["REQMANURL"] + "/api/v1",
        token  : configData["REQMANTOKEN"],
        adminUser  : configData["REQMANADMINUSER"],
        adminPass  : configData["REQMANADMINPASS"],
        testUserId : configData["REQMANTESTUSERID"],
        testRoleId : configData["REQMANTESTROLEID"],
        
        write  : function () {
//            var data = {
//                configData["REQMANURL"] : this["baseURL"],
//                REQMANTOKEN: this["token"],
//                REQMANADMINUSER: this["adminUser"],
//                REQMANADMINPASS: this["adminPass"],
//                REQMANTESTUSERID: this["testUserId"],
//                REQMANTESTROLEID: this["testRoleId"]
//            };
        	        	
        	configData["REQMANURL"] = this["baseURL"];
	        configData["REQMANTOKEN"] = this["token"];
	        configData["REQMANADMINUSER"] = this["adminUser"];
	        configData["REQMANADMINPASS"] = this["adminPass"];
	        configData["REQMANTESTUSERID"] = this["testUserId"];
	        configData["REQMANTESTROLEID"] = this["testRoleId"];
	        
	        try {
	        	return fs.writeFileSync(configFile, JSON.stringify(configData, null, 4));
	        } catch (e) {
	      // no config file
	        	console.log(e);
	        }
	        
            
        },
    
    	get : function(key){
    		return configData[key];
    	},
    	
    	set : function(key, value){
    		configData[key] = value;
    	}
    };

    return result;

};
