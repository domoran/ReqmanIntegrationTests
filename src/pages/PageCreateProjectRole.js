module.exports = function (config) {
    var name = $$("input[name='name']");
    var button = $$("button[type=submit]");

    return {
    	createRole: function (roleName, rights) {
            browser.get(config.baseURL + "/admin/projectRoles/create/");
            name.sendKeys(roleName);
            
            for (i = 0; i < rights.length; i++) {
                right = rights[i];
                
                var rightCheckbox = element(by.xpath("//td[text()='" + right + "']")).element(by.xpath("..")).element(by.css("input[type='checkbox']")); 
                
                rightCheckbox.click();
            }
            button.click();
        },
    };
};
