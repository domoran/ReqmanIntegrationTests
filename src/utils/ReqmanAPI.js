var ReqmanRequest = require("./ReqmanRequest"),
    guid = require("./guid");


var logRequests = false;


module.exports = function (config) {
    var requests = ReqmanRequest(config);

    var postData = function (url, postdata, callback) {
        if (logRequests) console.log("POST(" + url + "):", postdata);

        requests.post(url, postdata, function (statusCode, headers, data) {
            if (logRequests) console.log("ANSWER (" + statusCode + "): ", data);

            if (statusCode < 300) {
                callback(null, data);
            } else {
                callback(data, null);
            }
        });
    };

    var getData = function(url, callback) {
        if (logRequests) console.log("GET(" + url + ")");

        requests.get(url, function(statusCode, headers, data) {
            if (logRequests) console.log("ANSWER (" + statusCode + "): ", data);
            if (statusCode < 300) {
                callback(null, data);
            } else {
                callback(data, null);
            }
        });

    };
    
    var putData = function(url, postdata, callback) {
        if (logRequests) console.log("PUT(" + url + ")");

        requests.put(url, postdata, function(statusCode, headers, data) {
            if (logRequests) console.log("ANSWER (" + statusCode + "): ", data);
            if (statusCode < 300) {
                callback(null, data);
            } else {
                callback(data, null);
            }
        });

    };
    
    var deleteData = function(url, callback) {
        if (logRequests) console.log("PUT(" + url + ")");

        requests.del(url, function(statusCode, headers, data) {
            if (logRequests) console.log("ANSWER (" + statusCode + "): ", data);
            if (statusCode < 300) {
                callback(null, data);
            } else {
                callback(data, null);
            }
        });

    };

    return {
    	// CheckFile
    	checkFile: function (url, callback){
    		var postdata = {
    			"url" : url
    		};
    		
    		postData("/CheckFile", postdata, callback);
    	},
    	
    	// Company
    	getCompanies: function(callback){
    		getData("/Company", callback);
    	},
    	
        createCompany: function (callback) {
            return postData("/Company", { name: guid() }, callback);
        },
        
        getCompanyByProject: function (projectId, callback){
        	getData("/Company/ByProject/" + projectId, callback);
        },
        
        getCompany: function (companyId, callback){
        	getData("/Company/" + companyId, callback);
        },
        
        // Document
        getDocuments: function (callback){
        	getData("/Document", callback);
        },
        
        uploadDocument: function (data, callback) {
            var postdata = {
                "url": data["url"],
                "project": data["project"],
                "previousId": data["previousId"] || 0,
                "createJob": false,
            };

            if (data["callbackUrl"]) postdata["callbackUrl"] = data["callbackUrl"];

            return postData("/Document", postdata, callback);
        },
        
        getDocumentsByProject: function (projectId, callback){
        	getData("/Document/ByProject/" + projectId, callback);
        },
        
        getDocument: function (documentId, callback){
        	getData("/Document/" + documentId, callback);
        },
        
//        getDocumentStatus: function (docId, callback) {
//            return getData("/Document/" + docId,callback);
//        },
        
        getExchangeDocument: function (exchangeDocumentId, callback){
        	getData("/Document/ExchangeVersion/" + exchangeDocumentId, callback);
        },
        
        getContainer: function(containerId, callback){
        	getData("/Document/Container/" + containerId,callback);
        },
        
        getAllAttributesOfDocument: function(documentVersionId, callback){
        	getData("/Document/Attributes/" + documentVersionId, callback);
        },
        
        getAllUserDefAttributesOfDocument: function(documentVersionId, callback){
        	getData("/Document/UserDefinedAttributes/" + documentVersionId, callback);
        },
        
        getSystemAttributes: function(callback){
        	getData("/Document/SystemAttributes", callback);
        },
        
        // Exchange Version File
        downloadExchangeVersion: function(exchangeVersionId, callback){
        	requests.download("/Exchange/Download/" + exchangeVersionId, callback);
        },
        
        // Login
        getUserLoginToken: function (userId, callback){
        	return getData("/Login/" + userId, callback);
        },
        
        // Project
        getProjects: function (callback){
        	getData("/Project", callback);
        },
        
        createProject: function (customerId, callback) {
            var data = { "customerId": customerId , "description": "Created by Interface Tests", "name": guid() };
            return postData("/Project", data, callback);
        },
        
        getProjectsByCustomer: function(customerId, callback){
        	getData("/Project/ByCustomer/" + customerId, callback);
        },
        
        getProject: function(projectId, callback){
        	getData("/Project/" + projectId, callback);
        },
        
        // Roles
        getRoles: function(callback){
        	getData("/Project/role", callback);
        },
        
        getUserRolesInProject: function(projectId, userId, callback){
        	getData("/Project/role/" + projectId + "/" + userId, callback);
        },
        
        removeUserRole: function(roleId, callback){
        	deleteData("/Project/role/user/" + roleId, callback);
        },
        
        addUserRoleInProject: function(projectId, userId, roleId, callback){
        	var postdata = {
                    "userId": userId,
                    "roleId": roleId
                };
        	
        	postData("/Project/role/user/" + projectId, postdata, callback);
        },
        
        // ReqIF
        createReqIFDownload: function (documentId, callback) {
            var parameters = {
                "replaceNullDate": true,
                "ensureDoorsCompatibility": true,
                "exportAllAdditionalAttributes": true,
            };

            return postData("/ReqIf/ExportToFile/" + documentId, parameters, callback);
        },

        downloadReqIF: function (exchangeVersionId, callback) {
            requests.download("/ReqIf/Download/" + exchangeVersionId, callback);
        },
        
        // User
        getUsers: function (callback){
        	return getData("/User", callback);
        },
        
        createUser: function (username, password, firstName, lastName, email, isActiveDirectoryUser, callback){
        	
        	var testPassword = "1234Ab5678!";
        	var testFirstName = "Max";
        	var testLastName = "Mustermann";
        	var testEmail = "test@test.com!";
        	var testIsActiveDirectoryUser = false;
                		
        	var postData = {
        			  "firstName": firstName,
        			  "lastName": lastName,
        			  "userName": username,
        			  "password": password,
        			  "email": email,
        			  "isActiveDirectoryUser": false
        		};
        	
        	if (!password) postData["password"] = testPassword;
        	if (!firstName)	postData["firstName"] = testFirstName;
        	if (!lastName) postData["lastName"] = testLastName;
        	if (!email)	postData["email"] = testEmail;
        	if (isActiveDirectoryUser == null) postData["isActiveDirectoryUser"] = testIsActiveDirectoryUser;
        	
        	return postData("/User", postData, callback);
        },
        
        updateUser: function(userId, userName, isDeactivated, firstName, lastName, email, isActiveDirectoryUser, callback){
        	var putData = {
      			  "firstName": firstName,
      			  "lastName": lastName,
      			  "userName": username,
      			  "isDeactivated": isDeactivated,
      			  "email": email,
      			  "isActiveDirectoryUser": false
        		};
        	
        	putData("/User/" + userId, putData, callback);
        },
        
    };
};
