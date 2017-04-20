// Constants
var WEBSERVER_PORT = 6778;
var DEFAULTTIMEOUT = 20000;

// Variables
var createServer = require("../utils/webserver"),
	PageLogin = require("../pages/PageLogin"),
	PageDocumentDetails = require("../pages/PageDocumentDetails"),
	ReqmanConfig =  require("../utils/ReqmanConfig"),
	ReqmanAPI = require("../utils/ReqmanAPI"),
	TestUtils = require("../utils/TestUtils"),
	fs = require("fs"),
	path = require("path"),
	EC = protractor.ExpectedConditions,
	data_directory = path.normalize(path.join(__dirname, "..", "..", "data/TEST001"));

var config;
var api;
var server = null;

describe("TEST004: Reimport changed PDF:", function() {

	var projectID = null,  
 	documentID = null,
    documentLink = null,
    documentDetailPage = null,
    documentScanned = false,
    exchangeVersion = null,
    userToken = null;
	
	// Test constants
	var TESTFILENAME = "TEST004.pdf";
	var OUTPUTFILENAME = "TEST004.reqifz";
	var PROFILEFILENAME = "TEST004.ric";
	var PROFILENAME = "TEST004 Profil";
	var TESTDOCUMENTID_CONFIGNAME = "TEST001DOCID";
	
    beforeEach(function () {
        server = createServer().listen(WEBSERVER_PORT);
    });

    afterEach(function () {
        if (server != null) server.close();
    });
    
    beforeAll(function(){
    	console.log("\nStart TEST004");
    	browser.manage().timeouts().setScriptTimeout(DEFAULTTIMEOUT);
    	jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULTTIMEOUT;
    	
    	config = ReqmanConfig();
    	api = ReqmanAPI(config);
    	projectID = config.get("PROJECTID");    	
    });

    // Prepare environment
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
    it("Should be possible to validate PDF file", function (done) {
        var url = "http://localhost:" + WEBSERVER_PORT + "/data/TEST004/" + TESTFILENAME;
        
        browser.ignoreSynchronization = true;
        api.checkFile(url, function (error, data) {
            expect(error).toEqual(null);
            expect(data).not.toEqual(null);
            expect(data.valid).toBe(true);
            expect(data.contentType.toLowerCase()).toEqual("pdf");
            done();
            browser.ignoreSynchronization = false;
        });
    });
    
    it("Should be possible to upload a document via API", function (done) {
        
        var url = "http://localhost:" + WEBSERVER_PORT + "/data/TEST004/" + TESTFILENAME,
        	callbackUrl = "http://localhost:" + WEBSERVER_PORT + "/callback",
        	projectId = projectID,
        	createJob = false;
        	prevousID = config.get(TESTDOCUMENTID_CONFIGNAME);
        	
        browser.ignoreSynchronization = true;
        api.uploadDocument(url, callbackUrl, projectId, prevousID, createJob, function (error, data) {
            expect(error).toEqual(null);
            documentID = data;
            done();
            browser.ignoreSynchronization = false;
        });
    });
    
    it("Should be possible to get the document info", function (done) {
    	if (!documentID) { pending(); return; }
    	
    	browser.ignoreSynchronization = true;
    	api.getDocument(documentID, function (error, data) {
            expect(error).toEqual(null);
            expect(data).not.toEqual(null);
            expect(data.state).toBe("Uploaded");
            expect(data.link).not.toEqual(null);
            
            documentLink = data.link;
            documentDetailPage = PageDocumentDetails(data.link, config);
           
            done();
            browser.ignoreSynchronization = false;
        });
    });
    
    it("Should be possible to upload a profile via GUI", function (done) {
        if (!projectID) { pending(); return; }
        
        var absolutePath = path.join(data_directory, PROFILEFILENAME);

        documentDetailPage.upload(absolutePath, PROFILENAME, done);
    });

    it("Should be possible to scan a document with the profile and receive a callback from Reqman.", function (done) {
        if (!documentID || !userToken) { pending(); return; }
        
        // Wait for Reqman callback after activating scan, to assure that document is finished
        server.onURI("/callback", function (headers, data) {
        	expect(data.State).toBe("Finished");
            
            documentScanned = true;
            done();
        });
        
        documentDetailPage.scanWithProjectProfile(PROFILENAME);  
    }, 25000);

    it("Should be possible to view the scanned document in Reqman", function (done) {
        if (!documentID || !userToken || !documentScanned) { pending(); return; }

        api.getDocument(documentID, function (error, data) {
            expect(error).toEqual(null);
            expect(data).not.toEqual(null);
            expect(data.state).toBe("Finished");
            
        	browser.ignoreSynchronization = true;
            documentDetailPage.visitScannedDocument(function(){
            	
            	// TODO: Überprüfe Dokumentinhalte
            	var heading = element(by.xpath("//div[normalize-space(text())='Ich bin ein Heading']"));
            	expect(heading.isPresent()).toBe(true);
    			
    			done();
    			browser.ignoreSynchronization = false;
            });
        });
    });

    it("Should be possible to trigger ReqIF Creation for the scanned document", function (done) {
        if (!documentScanned) { pending(); return; }

        api.createReqIFDownload(documentID, function (error, data) {
            expect(error).toEqual(null);
            exchangeVersion = data;
            done();
        });
    });

    it("Should be possible to download the created ReqIF file", function (done) {
        if (!exchangeVersion) { pending(); return; }
        api.downloadReqIF(exchangeVersion, function (error, datastream) {
            expect(error).toEqual(null);
            var reqIfFileName = OUTPUTFILENAME;
            var absolutePath = path.join(data_directory + "/../Download", reqIfFileName);
            TestUtils().downloadFile(datastream, absolutePath, function(){
            	// Check if ReqIf file exists
            	fs.exists(absolutePath, function(exists) {
            		expect(exists).toBe(true);
            		done();
            	});
            });
        });
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