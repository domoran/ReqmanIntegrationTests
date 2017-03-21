var ReqmanConfig = require("../utils/ReqmanConfig");

var config = ReqmanConfig();

module.exports = function () {
    return {
        getTokenLink: function (token, pagePath) {  	
        	return config.baseURL + "/apilogin/" + token + ";returnurl=" + encodeURIComponent(pagePath);
        },
        
        getUserIDByName: function (userData, userName){
    		var userID = null;
    		if (userData){
    			userData.some(function (user) {
    	            // iterate the users
    				if (user.userName == userName){
    					userID = user.id;
    					return true;
    				}
    			});
    		}
    
    		return userID;
        },
    };
};
