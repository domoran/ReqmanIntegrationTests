var PageLogin = require("../pages/PageLogin"),
    PageToken = require("../pages/PageToken"),
    PageCreateProjectRole = require("../pages/PageCreateProjectRole"),
    PageEditUser = require("../pages/PageEditUser"),
    PageManageReportTemplates = require("../pages/PageManageReportTemplates"),
    ReqmanConfig =  require("../utils/ReqmanConfig"),
    guid = require("../utils/guid"),
    path = require("path"),
	ReqmanAPI = require("../utils/ReqmanAPI");

var config = ReqmanConfig();

var api = ReqmanAPI(config);

var EC = protractor.ExpectedConditions;

var data_directory = path.normalize(path.join(__dirname, "..", "..", "data"));

describe("Configure the Reqman API Token", function () {
    var tokenName = null;
    
    beforeAll(function(){
    	console.log("\nStart CONFIGURE");
    	
    	browser.manage().timeouts().setScriptTimeout(60000);
    	jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });

    it("Should be able to login as admin", function () {
        PageLogin(config).login(config.adminUser, config.adminPass);
    });

    it("Should be possible to store an API Token", function () {
        tokenName = guid();
        PageToken(config).createToken(tokenName);
    });

    it("Should be possible to read the API Tokens", function () {
        if (!tokenName) { pending(); return; }

        PageToken(config).getTokens(function (tokens) {
            expect(tokens[tokenName]).toBeDefined();
            config.token = tokens[tokenName];
            config.write();
            
        });
    });
});

describe("Configure the Test User", function () {
	beforeAll(function(){
    	browser.manage().timeouts().setScriptTimeout(60000);
    });
	
	
	guID = guid();
	
    it("Should be possible to create a test user", function(done){
    	if (!config.token) { pending(); return; }
    	
    	browser.ignoreSynchronization = true;

    	api.createUser("TestUser_" + guID.substring(1, 5) , null, null, null, null, null, function (error, data) {
            expect(error).toEqual(null);
            expect(data).not.toEqual(null);
            if (data) {
            	config.testUserId = data;
            	config.write();
            }
            
            done();
            browser.ignoreSynchronization = false;
        });
    });
    
    it("Should be able to add a new role", function () {
    	if (!config.testUserId){ pending(); return; }
		
		var rights = ["CreateDocument", "CreateDocumentVersion", "CreateFolder", 
			// Version 2.1.1 Anpassung
//			"DeleteDocument", 
//			"DeleteDocumentVersion", 
			"DeleteFolder", "DeleteProject", "EditFolder", "EditProject", "ExportExcel", "ExportReqIf", "ExtractDocument", "ImportExcel", "ManageProfiles",  "ViewCompare", "ViewExchangeVersion", "ViewProject"];
		
		PageCreateProjectRole(config).createRole("Tester_" + guID.substring(1, 5), rights);
		
		browser.wait(EC.presenceOf(element(by.cssContainingText('h2', "Projektrollenverwaltung"))), 15000);
		
		
	});
    
    var roleId = null;
    it("Should be able find roleId", function (done) {
    	if (!config.testUserId){ pending(); return;}
    	
    	browser.ignoreSynchronization = true;
    	
    	api.getRoles(function(error, data){
    		expect(error).toEqual(null);
            expect(data).not.toEqual(null);
            
            var testerRole = data.filter(function(role) {
                return role.name == "Tester_" + guID.substring(1, 5);
            })[0];
                        
            expect(testerRole).not.toEqual(null);
            
            roleId = testerRole.id;
            
            if (testerRole.id) {
            	config.testRoleId = testerRole.id;
            	config.write();
            }
            
            done();
    		browser.ignoreSynchronization = false;
    	});	
	});    
});

describe("Configure export templates", function () {
	
	beforeAll(function(){
    	browser.manage().timeouts().setScriptTimeout(60000);
    });
	
	it("Should be able to add a requirement export template", function () {
		browser.ignoreSynchronization = false;
		
		var templateName = "RequirementReportTemplate";
		var templateFileName = "RequirementReportTemplate.xlsx";
        var absolutePath = path.join(data_directory + "/Templates", templateFileName);
	
		PageManageReportTemplates(config).addTemplate(templateName, absolutePath);
		
		browser.wait(EC.presenceOf(element(by.cssContainingText('h2', "Reportvorlagenverwaltung"))), 15000);
		
		nameColumn = element(By.xpath("//td[text()='" + templateName + "']"))
		expect(nameColumn.isPresent()).toBe(true);
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
