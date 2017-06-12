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
	CommentarySheetHandler = require("../utils/CommentarySheetHandler"),
	fs = require("fs"),
	path = require("path"),
	EC = protractor.ExpectedConditions,
	data_directory = path.normalize(path.join(__dirname, "..", "..", "data/TEST003"));

var config;
var api;
var server = null;

describe("TEST003: Excel Template Reimport:", function() {
	var userToken = null;
	var projectID = null;    
    var documentID = null;
    var documentScanned = false;
    var documentLink = null;
    var documentExportLink = null;
    var exchangeVersion = null;
    var downloadLink = null;
    var excelExportName = null;
    
    // Test constants
	var TESTFILENAME = null;
	var OUTPUTFILENAME = "TEST003.reqifz";
	var EXCELZIPFILENAME = "TEST002.zip";
	var MANIPULATEDEXCELFILENAME = "TEST003_MODIFIED.xlsx"


//    beforeEach(function () {
//        server = createServer().listen(WEBSERVER_PORT);
//    });
//
//    afterEach(function () {
//        if (server != null) server.close();
//    });
    
    beforeAll(function(){
    	console.log("\nStart TEST003");
    	
    	browser.manage().timeouts().setScriptTimeout(DEFAULTTIMEOUT);
    	jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULTTIMEOUT;
    	
    	config = ReqmanConfig();
    	api = ReqmanAPI(config);
    	projectID = config.get("PROJECTID"); 
    	server = createServer().listen(WEBSERVER_PORT);
    });
    
    afterAll(function (done) {
        if (server != null) 
        	server.closeNow(done);
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
	
//	it("PREPARATION: Should be able to extract the TEST002 output in the TEST003 folder", function (done) {
//		
//		var zipFilePath = path.join(data_directory + "/../Download", EXCELZIPFILENAME);
//		var extractionPath = data_directory;
//		
//		fs.exists(zipFilePath, function(exists) {
//    		expect(exists).toBe(true);
//    		
//    		if (exists){
//    			TestUtils().unzipFile(zipFilePath, extractionPath, function(){
//        			var counter = 0;
//        			fs.readdir(extractionPath, function(err, files){
//        				expect(err).toBe(null);
//        				files.forEach(function(file){
//        					if (TestUtils().endsWith(file, "xlsx")){
//        						counter++;
//        						TESTFILENAME = file;
//        					}
//        				});
//        				expect(counter).toBe(1);
//        				done();
//        			});
//        		});	
//    		}		
//    	});
//		
//		
//	}, 30000);
	
	it("PREPARATION: Should be able to find extracted excel file in the TEST003 folder", function (done) {
		
		var counter = 0;
		fs.readdir(data_directory, function(err, files){
			expect(err).toBe(null);
			files.forEach(function(file){
				if (TestUtils().endsWith(file, "xlsx")){
					counter++;
					TESTFILENAME = file;
				}
			});
			expect(counter).toBe(1);
			done();
		});
	}, 30000);
	
	it("PREPARATION: Should be able to manipulate the excel file", function (done) {
		if (!TESTFILENAME) { pending(); return; }
		
		var excelFilePath = path.join(data_directory, TESTFILENAME);
		
		var comSheet = CommentarySheetHandler(excelFilePath);
    	
    	browser.wait(comSheet.isWorkbookReady).then(function () {	
        	
    		// Change Text of Heading
    		comSheet.changeValueOfEntityByGivenValue("Ich bin ein neues Heading", "Ich bin ein Heading");
    		
    		// Add new Heading
    		comSheet.addHeading("2", "Added Heading", 7);
    		
    		// Add new Requirement
    		comSheet.addRequirement("2", "Added Requirement", 8);
    		
    		// Save in new Excel File
    		var newExcelFilePath = path.join(data_directory, MANIPULATEDEXCELFILENAME);
        	comSheet.saveFile(newExcelFilePath, done);
        });		
	}, 30000);
		    
    // Start test actions
    it("Should be possible to validate Excel comment file", function (done) {
    	if (!TESTFILENAME) { pending(); return; }
    	
        var url = "http://localhost:" + WEBSERVER_PORT + "/data/TEST003/" + MANIPULATEDEXCELFILENAME;

        browser.ignoreSynchronization = true;
        api.checkFile(url, function (error, data) {
            expect(error).toEqual(null);
            expect(data).not.toEqual(null);
            expect(data.valid).toBe(true);
            expect(data.contentType).not.toEqual(null);
            if (data.contentType)
            	expect(data.contentType.toLowerCase()).toEqual("excelreport");
            done();
            browser.ignoreSynchronization = false;
        });
    });
    
    it("Should be possible to upload a Excel comment document via API", function (done) {
    	if (!TESTFILENAME) { pending(); return; }

        var url = "http://localhost:" + WEBSERVER_PORT + "/data/TEST003/" + MANIPULATEDEXCELFILENAME,
		callbackUrl = "http://localhost:" + WEBSERVER_PORT + "/callback",
		projectId = projectID,
		createJob = true;

	    browser.ignoreSynchronization = true;
	    
	    server.onURI("/callback", function (headers, data) {
	    	expect(data).not.toBe(null);
        	expect(data.State).toBe("Finished");
            
            documentScanned = true;
            browser.ignoreSynchronization = false;
	        done();
        });
	    
	    
	    api.uploadDocument(url, callbackUrl, projectId, null, createJob, function (error, data) {
	        expect(error).toEqual(null);
	        expect(data).not.toBe(null);
	        documentID = data;
	    });
	}, 25000);
           
    //TODO: Check if changes appear in GUI
//    it("Should be possible to visit the document page", function (done) {
//        if (!documentID || !userToken || !documentScanned || !documentExportLink) { pending(); return; }
//        
//        var documentDetailPage = PageDocumentDetails(documentLink, config);
//        browser.ignoreSynchronization = true;
//        documentDetailPage.visitScannedDocument(function(){
//        	
//        	var heading = element(by.xpath("//div[normalize-space(text())='Ich bin ein Heading']"));
//        	expect(heading.isPresent()).toBe(true);
//			
//			done();
//			browser.ignoreSynchronization = false;
//        });
//    });
    
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
            var absolutePath = path.join(data_directory + "/../Download", OUTPUTFILENAME);
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
