var BrowserNavigator = require("../utils/BrowserNavigator"),
	EC = protractor.ExpectedConditions;

module.exports = function (config) {
    var name = $$("input[type=text]");
    var pass = $$("input[type=password]");
    var button = $$("button");

    return {
        login: function (user, password) {
        	BrowserNavigator(config).getBrowserPage("/login");
            name.sendKeys(user);
            pass.sendKeys(password);
            button.click();
            browser.wait(EC.presenceOf(element(by.linkText("Logout"))));
            expect(EC.presenceOf(element(by.linkText("Logout"))));
        },
        loginByToken: function (token) {
        	browser.get(BrowserNavigator(config).getTokenLink("/dashboard", token));
//        	console.log(BrowserNavigator(config).getTokenLink("/dashboard", token));
        	browser.wait(EC.presenceOf(element(by.linkText("Logout"))));
        	expect(EC.presenceOf(element(by.linkText("Logout"))));
        },
        logout: function () {
        	var logout_button = element(by.linkText("Logout"));
//        	if (logout_button.isPresent())
//        		logout_button.click();
//        	else {
	        	BrowserNavigator(config).getBrowserPage("/dashboard");
	    		logout_button.click();
//        	}
        },
        
    };
};
