var fs = require("fs");

module.exports = function () {
    return {    
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
        downloadFile: function(dataStream, filePath, callback){

            var strmOut = fs.createWriteStream(filePath);
            
            dataStream.on('data', function(data) {
            	strmOut.write(data);
            }).on('end', function() {
            	strmOut.end();
            	if (callback){
            		callback();
            	}
            });
        }
    };
};
