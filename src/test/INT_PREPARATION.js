var ReqmanConfig =  require("../utils/ReqmanConfig"),
    ReqmanAPI = require("../utils/ReqmanAPI"),
    fs = require("fs"),
	path = require("path");

// Constants
var DEFAULTTIMEOUT = 20000;

// Variables
var config;
var projectID;
var companyID = null;
var projectID = null; 

describe("PREPARATION: Prepare test execution:", function() {

    beforeAll(function(){
    	console.log("\nStart PREPARATION");
    	jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULTTIMEOUT;
    	
    	config = ReqmanConfig();
    	api = ReqmanAPI(config);
    });
       
    // Prepare environment
    it("PREPARATION: Should be possible to create a company via API", function (done) {
        browser.ignoreSynchronization = true;

        api.createCompany(function (error, data) {
            expect(error).toEqual(null);
            expect(data).not.toEqual(null);
            companyID = data;
            
            config.set("COMPANYID", companyID);
            config.write();
            done();
            browser.ignoreSynchronization = false;
        });
    });

    it("PREPARATION: Should be possible to create a project via API", function (done) {
        if (!companyID) { pending(); return; }

        browser.ignoreSynchronization = true;

        api.createProject(companyID, function (error, data) {
            expect(error).toEqual(null);
            projectID = data;
            
            config.set("PROJECTID", projectID);
            config.write();
            done();
            browser.ignoreSynchronization = false;
        });
    });
    
    it("PREPARATION: Should be possible to add project role for test user", function (done) {
        if (!projectID || !config.testUserId || !config.testRoleId) { pending(); return; }

        browser.ignoreSynchronization = true;

        api.addUserRoleInProject(projectID, config.testUserId, config.testRoleId, function (error, data) {
            expect(error).toEqual(null);
            done();
            browser.ignoreSynchronization = false;
        });
    });
    
//    it("Should be possible to clear the downloaded files folder", function () {
//    	
//    });
    
});