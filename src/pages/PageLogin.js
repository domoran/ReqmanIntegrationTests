var ReqmanConfig = require("../utils/ReqmanConfig");

var config = ReqmanConfig();

module.exports = function () {
    var name = $$("input[type=text]");
    var pass = $$("input[type=password]");
    var button = $$("button");

    return {
        login: function (user, password) {
            browser.get(config.baseURL + "/login");
            name.sendKeys(user);
            pass.sendKeys(password);
            button.click();
        },
    };
}();
