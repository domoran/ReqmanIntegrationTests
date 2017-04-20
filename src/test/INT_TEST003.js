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
	var TESTFILENAME = "TEST003.xlsx";
	var EXCELEXPORTNAME = "TEST004.zip";
	var EXCELEXPORTTEMPLATENAME = "RequirementReportTemplate";
    var FILEWASEXPORTED_MESSAGE = "File was sent to MyDocumentSystem";
    var FILEEXPORT_CALLBACK = "/filecallback";

    beforeEach(function () {
        server = createServer().listen(WEBSERVER_PORT);
    });

    afterEach(function () {
        if (server != null) server.close();
    });
    
    beforeAll(function(){
    	console.log("\nStart TEST003");
    	
    	browser.manage().timeouts().setScriptTimeout(DEFAULTTIMEOUT);
    	jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULTTIMEOUT;
    	
    	config = ReqmanConfig();
    	api = ReqmanAPI(config);
    	projectID = config.get("PROJECTID"); 
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
	
	//TODO: Anpassung der DocumentId im TEST003.xlsx-File
    
    // Start test actions
    it("Should be possible to validate Excel comment file", function (done) {
        var url = "http://localhost:" + WEBSERVER_PORT + "/data/TEST003/" + TESTFILENAME;

        browser.ignoreSynchronization = true;
        api.checkFile(url, function (error, data) {
            expect(error).toEqual(null);
            expect(data).not.toEqual(null);
            expect(data.valid).toBe(true);
            expect(data.contentType.toLowerCase()).toEqual("excelreport");
            done();
            browser.ignoreSynchronization = false;
        });
    });
    
    it("Should be possible to upload a Excel comment document via API", function (done) {

        var url = "http://localhost:" + WEBSERVER_PORT + "/data/TEST003/" + TESTFILENAME,
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
           
//    it("Should be possible to visit the export page", function (done) {
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
    
    it("Should be possible to visit the export page", function (done) {
        if (!documentID || !userToken || !documentScanned || !documentExportLink) { pending(); return; }
        
        server.onURI("/filecallback", function (headers, data) {
        	expect(data).not.toBe(null);
        	expect(data.Id).not.toBe(null);
        	expect(data.Url).not.toBe(null);
            
        	downloadLink = data.Url;
        	console.log(downloadLink);
        	
            done();
        });
        
        excelExportName = "ReqMan-Test.zip";
        PageExportDocument(documentExportLink).exportExcelCommentSheet(excelExportName, "RequirementReportTemplate");
        
        var exportFinishedHeading = element(by.cssContainingText('h3',"Exportieren der Kommentare nach Excel ist beendet."));
        browser.wait(EC.presenceOf(exportFinishedHeading), 20000);
        expect(exportFinishedHeading.isPresent()).toBe(true);
    }, 35000);
    
    it("Should be possible to download the excel file", function (done) {
        if (!downloadLink) { pending(); return; }

        api.downloadFile(downloadLink, function (error, datastream) {
            expect(error).toEqual(null);

            var absolutePath = path.join(data_directory + "/../Download", excelExportName);
            var strmOut = fs.createWriteStream(absolutePath);
            datastream.on("data", function (chunk) { strmOut.write(chunk);  });
            datastream.on("end", function () { 
            	strmOut.close();
            	// Check if excel file exists
            	fs.exists(absolutePath, function(exists) {
            		expect(exists).toBe(true);
            		done();
            	});
            });
        });
    }, 35000);
    
    
    
//    it("Should be possible export an excel file from the document", function (done) {
//        if (!documentID || !userToken || !documentScanned) { pending(); return; }
//        
//        browser.ignoreSynchronization = true;
//        api.getDocument(documentID, function (error, data) {
//            expect(error).toEqual(null);
//            expect(data.state).toBe("Finished");
//            expect(data.link).toContain("http");
//            
//            documentDetailPage = PageDocumentDetails(data.link);
//            
//            documentDetailPage.visitScannedDocument(function(){
//            	
//            	var heading = element(by.xpath("//div[normalize-space(text())='Ich bin ein Heading']"));
//            	expect(heading.isPresent()).toBe(true);
//    			
//    			done();
//    			browser.ignoreSynchronization = false;
//            });
//        });
//    });
});

describe("Logout", function () {
	
	beforeAll(function(){
    	browser.manage().timeouts().setScriptTimeout(60000);
    });
	
	it("Logout", function () {
		PageLogin(config).logout();
	});
});
