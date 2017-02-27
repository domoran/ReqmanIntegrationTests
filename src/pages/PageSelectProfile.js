var ReqmanConfig = require("../utils/ReqmanConfig");

var config = ReqmanConfig();

module.exports = function () {

    // return the scan link for the profile with title 'title'
    var scanLink = function (title) {
      return element(by.xpath("//div[text()='" + title + "']/../div//a[@data-click='scann']"));
    };

    return {
      scanWithProjectProfile: function (documentID, profileName) {
        var link = scanLink(profileName);

        browser.get(config.baseURL + "/scanner/selectprofile/" + documentID + ";type=documentversion");
        link.click();
      },
    };
}();
