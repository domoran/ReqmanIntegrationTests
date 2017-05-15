// Constants
var WEBSERVER_PORT = 6778;
var DEFAULTTIMEOUT = 20000;

// Variables
var createServer = require("../utils/webserver"),
	PageLogin = require("../pages/PageLogin"),
	PageDocumentDetails = require("../pages/PageDocumentDetails"),
	PageExportDocument = require("../pages/PageExportDocument"),
	ReqmanConfig =  require("../utils/ReqmanConfig"),
	ReqmanAPI = require("../utils/ReqmanAPI"),
	TestUtils = require("../utils/TestUtils"),
	fs = require("fs"),
	path = require("path"),
	
	EC = protractor.ExpectedConditions,
	data_directory = path.normalize(path.join(__dirname, "..", "..", "data/TEST002"));

var config;
var api;
var server = null;

describe("TEST002: Excel Template Export:", function() {
	var projectID = null;    
    var documentID = null;
    var documentLink = null;
    var documentExportLink = null;
    var documentScanned = false;
    var userToken = null;
    var downloadLink = null;
    
    // Test constants
	var TESTFILENAME = "TEST002.reqifz";
	var EXCELEXPORTNAME = "TEST002.zip";
	var EXCELEXPORTTEMPLATENAME = "RequirementReportTemplate";
    var FILEWASEXPORTED_MESSAGE = "File was sent to MyDocumentSystem";
    var FILEEXPORT_CALLBACK = "/filecallback";

//    beforeEach(function () {
//        server = createServer().listen(WEBSERVER_PORT);
//    });
//
//    afterEach(function () {
//        if (server != null) server.close();
//    });
    
    beforeAll(function(){
    	console.log("\nStart TEST002");
    	
    	browser.manage().timeouts().setScriptTimeout(DEFAULTTIMEOUT);
    	jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULTTIMEOUT;
    	
    	config = ReqmanConfig();
    	api = ReqmanAPI(config);
    	projectID = config.get("PROJECTID"); 
    	server = createServer().listen(WEBSERVER_PORT);
    });
    
    afterAll(function (done) {
        if (server != null) 
        	server.close(done);
        else
        	done();
    });
    
	//Prepare environment   
    it("PREPARATION: Should be able to get User Login Token", function (done) {
    	browser.ignoreSynchronization = true;
    	
    	api.getUserLoginToken(config.testUserId, function(error, data){
    		expect(error).toEqual(null);
            expect(data).not.toEqual(null);

            if (data)
            	userToken = data;
            
            done();            
    		browser.ignoreSynchronization = false;
    	})
    });
    
	it("PREPARATION: Should be able to login user with token", function () {
		
		PageLogin(config).loginByToken(userToken);
		
		expect(browser.getCurrentUrl()).toEqual(config.baseURL + "/dashboard");
		
	}, 30000);
    
    // Start test actions
    it("Should be possible to validate ReqIF file", function (done) {
        var url = "http://localhost:" + WEBSERVER_PORT + "/data/TEST002/" + TESTFILENAME;

        browser.ignoreSynchronization = true;
        api.checkFile(url, function (error, data) {
            expect(error).toEqual(null);
            expect(data).not.toEqual(null);
            expect(data.valid).toBe(true);
            expect(data.contentType).not.toEqual(null);
            if (data.contentType)
            	expect(data.contentType.toLowerCase()).toEqual("reqif");
            done();
            browser.ignoreSynchronization = false;
        });
    });
    
    it("Should be possible to upload a ReqIf document via API", function (done) {

        var url = "http://localhost:" + WEBSERVER_PORT + "/data/TEST002/" + TESTFILENAME,
		callbackUrl = "http://localhost:" + WEBSERVER_PORT + "/callback",
		projectId = projectID,
		createJob = true;

	    browser.ignoreSynchronization = true;
	    
	    api.uploadDocument(url, callbackUrl, projectId, null, createJob, function (error, data) {
	        expect(error).toEqual(null);
	        documentID = data;
	        browser.ignoreSynchronization = false;
	        done();
	    });
	}, 25000);
        
    it("Should be possible to wait for the document to be scanned", function (done) {
        if (!documentID || !userToken) { pending(); return; }
        
        function checkDocumentState() {
        	api.getContainer(documentID, function (error, data) {
                if (data != null && data.state === "Finished"){
                	expect(data.link).not.toBe(null);
                	expect(data.exportLink).not.toBe(null);
                	documentScanned = true;
                	
                	documentLink = data.link;
                    documentExportLink = data.exportLink;
                	done();
                }
                else {
                	checkDocumentState();
                }
                	
            });
        }
        
        checkDocumentState();
    }, 20000);
        
    it("Should be possible to visit the export page", function (done) {
        if (!documentID || !userToken || !documentScanned || !documentExportLink) { pending(); return; }
        
        server.onURI(FILEEXPORT_CALLBACK, function (headers, data) {
        	expect(data).not.toBe(null);
        	expect(data.Id).not.toBe(null);
        	expect(data.Url).not.toBe(null);
            
        	downloadLink = data.Url;
        	
            done();
        });
        
        PageExportDocument(documentExportLink).exportExcelCommentSheet(EXCELEXPORTNAME, EXCELEXPORTTEMPLATENAME);
        
        var exportFinishedPopup = element(by.cssContainingText('p', FILEWASEXPORTED_MESSAGE));
        browser.wait(EC.presenceOf(exportFinishedPopup), 35000);
        expect(exportFinishedPopup.isPresent()).toBe(true);
    }, 35000);
    
    it("Should be possible to download the excel file", function (done) {
        if (!downloadLink) { pending(); return; }

        api.downloadFile(downloadLink, function (error, datastream) {
            expect(error).toEqual(null);
            
        	var absolutePath = path.join(data_directory + "/../Download", EXCELEXPORTNAME);

            TestUtils().downloadFile(datastream, absolutePath, function(){
            	// Check if excel file exists
            	fs.exists(absolutePath, function(exists) {
            		expect(exists).toBe(true);
            		done();
            	});
            });
        });
    }, 35000);
});

describe("Logout", function () {
	
	beforeAll(function(){
    	browser.manage().timeouts().setScriptTimeout(60000);
    });
	
	it("Logout", function () {
		PageLogin(config).logout();
	});
});
