var EC = protractor.ExpectedConditions;

module.exports = function (config) {
    return {
    	deleteProject: function (companyID, projectID, callback) {
            browser.get(config.baseURL + "/projects/" + companyID + ";project=" + projectID);
            
//            var projectMenu = element(by.css("a[href='/projects/" + companyID + ";project=" + projectID + "']"));
//            browser.wait(EC.presenceOf(projectMenu), 20000);
//            expect(projectMenu.isPresent()).toBe(true);
//            
//            var dropdownMenu = projectMenu.element(by.xpath("..")).element(by.css("div button[data-toggle='dropdown']"));
//            browser.wait(EC.presenceOf(dropdownMenu), 20000);
//            expect(dropdownMenu.isPresent()).toBe(true);
//            dropdownMenu.click();
//            
//            var deleteButton = dropdownMenu.element(by.xpath("..")).element(by.css("ul li a"));
//            browser.wait(EC.presenceOf(deleteButton), 20000);
//            expect(deleteButton.isPresent()).toBe(true);
//            deleteButton.click();
            
            var projectMenu = element(by.css("a[href='/projects/" + companyID + ";project=" + projectID + "']"));
            browser.wait(EC.presenceOf(projectMenu), 20000).then(function(){
            	expect(projectMenu.isPresent()).toBe(true);
                
                var dropdownMenu = projectMenu.element(by.xpath("..")).element(by.css("div button[data-toggle='dropdown']"));
                browser.wait(EC.presenceOf(dropdownMenu), 20000).then(function(){
                	 expect(dropdownMenu.isPresent()).toBe(true);
                     dropdownMenu.click();
                     
                     var deleteButton = dropdownMenu.element(by.xpath("..")).element(by.css("ul li a"));
                     browser.wait(EC.presenceOf(deleteButton), 20000).then(function(){
                    	 expect(deleteButton.isPresent()).toBe(true);
                         deleteButton.click().then(function(){
                        	 var confirmButton = $$("button[type=submit]");
                        	 browser.wait(EC.presenceOf(confirmButton), 20000).then(function(){
                            	 expect(confirmButton.isPresent()).toBe(true);
                            	 confirmButton.click().then(function(){
                            		 callback();
                            	 });
                        	 });
                         });
                     }); 
                });      
            });   
        },
    };
};
