module.exports = function (config) {
    var name = $$("input[name=Description]");
    var button = $$("button[type=submit");

    // Assumption: Table header contains no <td> elements only <th>!
    var tokenList =  element.all(by.xpath("//table//tr[count(td)>0]"));

    var tokenName  =  by.xpath(".//td[2]");
    var tokenValue =  by.xpath(".//td[3]");


    return {
        createToken: function (tokenName) {
            browser.get(config.baseURL + "/admin/apiToken/create");
            name.sendKeys(tokenName);
            button.click();
        },

        getTokens: function (callback) {
            browser.get(config.baseURL + "/admin/apiToken");

            var tokens = {};

            tokenList.each(function (row) {
            // iterate the rows
                row.element(tokenValue).getText().then( function(tv) {
                    row.element(tokenName).getText().then( function(tn) {
                        tokens[tn] = tv;
                    });
                });
            }).then(function () {
                callback(tokens);
            });

        },

    };
};
