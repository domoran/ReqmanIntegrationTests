var ReqmanConfig = require("../utils/ReqmanConfig");

var config = ReqmanConfig();

module.exports = function () {
    var name = $$("input[name='name']");
    var file = $$("input[name='File']");
    var button = $$("button[type=submit]");

    return {
        upload: function (projectID, filePath, title) {
            browser.get(config.baseURL + "/profiles/create/" + projectID);
            name.sendKeys(title);
            file.sendKeys(filePath);
            button.click();
        },
    };
}();
