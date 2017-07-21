module.exports = function (userId, config) {
    var button = $$("button[type=submit]");

    return {
    	selectRole: function (roleId) {
            browser.get(config.baseURL + "/admin/user/edit/" + userId);
            
            var roleOption = element(by.css("option[value*='" + roleId + "']"));
            
            roleOption.click();
            
            button.click();
        },
    };
};
