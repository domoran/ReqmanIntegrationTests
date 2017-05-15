var ReqmanConfig =  require("../utils/ReqmanConfig"),
    ReqmanAPI = require("../utils/ReqmanAPI"),
    PageLogin = require("../pages/PageLogin"),
    PageProjects = require("../pages/PageProjects"),
    PageCompanyManagement = require("../pages/PageCompanyManagement");

// Constants
var DEFAULTTIMEOUT = 20000;

// Variables
var config;
var projectID;
var companyID = null;
var projectID = null; 

describe("TEARDOWN:", function() {

    beforeAll(function(){
    	console.log("\nStart TEARDOWN");
    	jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULTTIMEOUT;
    	browser.manage().timeouts().setScriptTimeout(DEFAULTTIMEOUT);
    	
    	config = ReqmanConfig();
    	api = ReqmanAPI(config);
    });
    
    // Prepare environment
    it("Should be able to login as admin", function () {
        PageLogin(config).login(config.adminUser, config.adminPass);
    });
    
    // Start Teardown
//    it("Should be possible to delete test project", function (done) {
//    	browser.ignoreSynchronization = true;
//        PageProjects(config).deleteProject(config.get("COMPANYID"), config.get("PROJECTID"), function(){
//        	browser.ignoreSynchronization = false;
//        	done();
//        });
//    });

    it("Should be possible to delete test company", function () {
    	PageCompanyManagement(config).deleteCompany(config.get("COMPANYID"));
    }); 
});

describe("Logout", function () {
	
	beforeAll(function(){
    	browser.manage().timeouts().setScriptTimeout(60000);
    });
	
	it("Logout", function () {
		PageLogin(config).logout();
	});
});