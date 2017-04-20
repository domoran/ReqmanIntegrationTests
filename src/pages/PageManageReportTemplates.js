module.exports = function (config) {
    return {
    	addTemplate: function (name, filePath) {           
            var name_input = $$("input[name='name']");
    		var file_input = $$("input[name='File']");
    		var button_submit = $$("button[type=submit]");
    		
    		browser.get(config.baseURL + "/admin/template/create/");
    		
    		name_input.sendKeys(name);
    		file_input.sendKeys(filePath);
            
    		button_submit.click();
        },
    };
};
