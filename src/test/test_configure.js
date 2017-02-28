var PageLogin = require("../pages/PageLogin"),
    PageToken = require("../pages/PageToken"),
    ReqmanConfig =  require("../utils/ReqmanConfig"),
    guid = require("../utils/guid");

var config = ReqmanConfig();

var EC = protractor.ExpectedConditions;

describe("Configure the Reqman API Token", function () {
    var tokenName = null;

    it("Should be able to login as admin", function () {
        PageLogin.login("admin", "ReqMan_V2");
        browser.wait(EC.presenceOf(element(by.linkText("Logout"))), 5000);
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
});
