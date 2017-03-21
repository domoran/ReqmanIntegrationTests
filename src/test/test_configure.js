var PageLogin = require("../pages/PageLogin"),
    PageToken = require("../pages/PageToken"),
    ReqmanConfig =  require("../utils/ReqmanConfig"),
    guid = require("../utils/guid"),
	ReqmanAPI = require("../utils/ReqmanAPI");

var config = ReqmanConfig();

var api = ReqmanAPI(config);

var EC = protractor.ExpectedConditions;

describe("Configure the Reqman API Token", function () {
    var tokenName = null;
    
    beforeAll(function(){
    	browser.manage().timeouts().setScriptTimeout(60000);
    });

    it("Should be able to login as admin", function () {
        PageLogin.login(config.adminUser, config.adminPass);
        browser.wait(EC.presenceOf(element(by.linkText("Logout"))), 15000);
    });

    it("Should be possible to store an API Token", function () {
        tokenName = guid();
        PageToken.createToken (tokenName);
    });

    it("Should be possible to read the API Tokens", function () {
        if (!tokenName) { pending(); return; }

        PageToken.getTokens(function (tokens) {
            expect(tokens[tokenName]).toBeDefined();
            config.token = tokens[tokenName];
            config.write();
        });
    });
    
    it("Should be possible to create a test user", function(done){
    	browser.ignoreSynchronization = true;
    	if (!config.token) { pending(); return; }
    	
    	api.createUser("TestUser_" + tokenName.substring(1, 4) , null, null, null, null, null, function (error, data) {
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
});
