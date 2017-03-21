
var createServer = require("../utils/webserver"),
    PageLogin = require("../pages/PageLogin"),
    PageProfileUpload = require("../pages/PageProfileUploadToken"),
    PageSelectProfile = require("../pages/PageSelectProfile"),
    ReqmanConfig =  require("../utils/ReqmanConfig"),
    ReqmanAPI = require("../utils/ReqmanAPI"),
    fs = require("fs");

var path = require("path");

var config = ReqmanConfig();
var api = ReqmanAPI(config);
var EC = protractor.ExpectedConditions;

var data_directory = path.normalize(path.join(__dirname, "..", "..", "data"));


describe("Reqman Server Test", function() {
    var server = null;

    beforeEach(function () {
        server = createServer().listen(6778);
    });

    afterEach(function () {
        if (server != null) server.close();
    });
    
    beforeAll(function(){
    	browser.manage().timeouts().setScriptTimeout(60000);
    });

    var projectID = null;
    var companyID = null;
    var documentID = null;
    var documentScanned = false;
    var exchangeVersion = null;

    it("Should be possible to create a company via API", function (done) {
        browser.ignoreSynchronization = true;

        api.createCompany(function (error, data) {
            expect(error).toEqual(null);
            expect(data).not.toEqual(null);
            companyID = data;
            done();
            browser.ignoreSynchronization = false;
        });
    });

    it("Should be possible to create a project via API", function (done) {
        if (!companyID) { pending(); return; }

        browser.ignoreSynchronization = true;

        api.createProject(companyID, function (error, data) {
            expect(error).toEqual(null);
            projectID = data;
            done();
            browser.ignoreSynchronization = false;
        });
    });


    it("Should be possible to upload a document via API", function (done) {
        var data = {
            "url": "http://localhost:6778/data/little.pdf",
            "project": projectID,
            "previousId": 0,
            "createJob": false,
            "callbackUrl": "http://localhost:6778/callback",
        };

        browser.ignoreSynchronization = true;
        api.uploadDocument(data, function (error, data) {
            expect(error).toEqual(null);
            documentID = data;
            done();
            browser.ignoreSynchronization = false;
        });
    });
//
//    it("Should be able to login as admin", function () {
//        PageLogin.login(config.adminUser, config.adminPass);
//        browser.wait(EC.presenceOf(element(by.linkText("Logout"))), 5000);
//    });
    
    var userToken = null;
    it("Should be able to get User Login Token", function (done) {
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

    it("Should be possible to upload a profile via GUI", function () {
        if (!projectID || !userToken) { pending(); return; }

        var absolutePath = path.join(data_directory, "little.ric");
        PageProfileUpload.upload(projectID, absolutePath, "Little Profile", userToken);

        browser.wait(EC.presenceOf(element(by.xpath("//div[text()='Little Profile']"))), 12000);
    });

//    it("Should be possible to scan a the document with the profile and receive a callback from Reqman.", function (done) {
//        if (!documentID) { pending(); return; }
//
//        PageSelectProfile.scanWithProjectProfile(documentID, "Little Profile");
//
//    // Wait for Reqman callback, to assure that document is finished
//        server.onURI("/callback", function (headers, data) {
//            expect(data.State).toBe("Finished");
//
//            documentScanned = true;
//            done();
//        });
//    });
//
//    it("Should be possible to view the scanned document in Reqman", function (done) {
//        if (!documentID) { pending(); return; }
//
//        api.getDocumentStatus(documentID, function (error, data) {
//            expect(error).toEqual(null);
//            expect(data.state).toBe("Finished");
//
//            // goto forward page
//            // $escaped = urlencode(data.link)
//            browser.get(data.link); //    in RMDX: /apilogin/$token;returnURL=$escaped
//
//            // assert: Browser redirect - URL ist nun data.link 
//
//        // Visual checks in Reqman GUI
//            var el1 = element(by.xpath("//*[contains(text(), 'Ich bin ein Heading')]"));
//
//        // check for elements in document view
//            browser.ignoreSynchronization = true; // document is loading asynchronously?
//            browser.wait(el1.isPresent(), 10000); // wait for the heading to be visible
//            browser.ignoreSynchronization = false;
//
//            done();
//        });
//    });
//
//    it("Should be possible to trigger ReqIF Creation for the scanned document", function (done) {
//        // documentID = 16; documentScanned = true;
//        if (!documentScanned) { pending(); return; }
//
//        api.createReqIFDownload(documentID, function (error, eVer) {
//            expect(error).toEqual(null);
//            exchangeVersion = eVer;
//            done();
//        });
//    });
//
//    it("Should be possible to download the created ReqIF file", function (done) {
//        if (!exchangeVersion) { pending(); return; }
//        api.downloadReqIF(exchangeVersion, function (error, strm) {
//            expect(error).toEqual(null);
//            var absolutePath = path.join(data_directory, "litte.out.reqifz");
//            var strmOut = fs.createWriteStream(absolutePath);
//            strm.on("data", function (chunk) { strmOut.write(chunk);  });
//            strm.on("end", function () { strmOut.close(); done(); });
//        });
//    });

});
