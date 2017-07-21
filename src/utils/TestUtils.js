var fs = require("fs"),
	unzip = require("unzip");

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
            	if (callback)
            		strmOut.end(callback);
            	else
            		strmOut.end();
            });
        },
        unzipFile: function(zipFilePath, extractionPath, callback){

        	fs.createReadStream(zipFilePath).pipe(unzip.Extract({ path: extractionPath })).on('close', callback);
        },
        endsWith: function (str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }
        
    };
};
