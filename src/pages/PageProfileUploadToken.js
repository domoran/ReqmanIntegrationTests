var TestUtils = require("../utils/TestUtils");

var utils = TestUtils();

module.exports = function () {
    var name = $$("input[name='name']");
    var file = $$("input[name='File']");
    var button = $$("button[type=submit]");

    return {
        upload: function (projectID, filePath, title, userToken) {
//        	console.log(utils.getTokenLink(userToken, "/profiles/create/" + projectID));
        	browser.get(utils.getTokenLink(userToken, "/profiles/create/" + projectID));
            name.sendKeys(title);
            file.sendKeys(filePath);
            button.click();
        },
    };
}();
