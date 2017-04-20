var BrowserNavigator = require("../utils/BrowserNavigator"),
	EC = protractor.ExpectedConditions;

var PROJECT_PROFILES = 1;
var ALL_PROFILES = 2;
var NEW_PROFILE = 3;
var UPLOAD_PROFILE = 4;

var getTab = function(tabName){

	switch(tabName) {
	    case PROJECT_PROFILES:
	        return $$("a[href='#projectProfiles']");
	    case ALL_PROFILES:
	        return $$("a[href='#allProfiles']");
	    case NEW_PROFILE:
	        return $$("a[href='#generateProfile']");
	    case UPLOAD_PROFILE:
	        return $$("a[href='#uploadProfile']");
	    default:
	        return null;
	} 

}

module.exports = function (documentLink, config) {

    return {
    	scanWithProjectProfile: function (profileName) {
    		browser.ignoreSynchronization = true;
        	
        	browser.get(BrowserNavigator(config).getTokenLink(documentLink)).then(function(){
        		browser.driver.wait(EC.presenceOf(getTab(PROJECT_PROFILES)), 20000).then(function(){
        			expect(getTab(PROJECT_PROFILES).isPresent()).toBe(true);
        			getTab(PROJECT_PROFILES).click().then(function(){
        				var profile = element(By.xpath("//div[text()='" + profileName + "']"));
        	        	browser.driver.wait(EC.presenceOf(profile), 15000).then(function(){
        	        		var scan_link = browser.driver.findElement(By.xpath("//div[text()='" + profileName + "']/../div//a[@data-click='scann']"));
        	                scan_link.click().then(function(){
        	                	var save_Button = element(by.css("button span.glyphicon-floppy-disk")).element(by.xpath(".."));
        	                	var grid = element(by.css(".aggrid "));
        	                	browser.driver.wait(EC.and(EC.presenceOf(grid),EC.and(EC.presenceOf(save_Button),EC.elementToBeClickable(save_Button))), 10000).then(function(){
        	                		save_Button.click().then(function(){
        	                			browser.ignoreSynchronization = false;
        	                		});
        	                	});
        	                });
        	        	}); 
        			});
        		});
        	});
    		
    		
    		
//    		console.log("DOC__LINK: " + documentLink);
//    		BrowserNavigator.getBrowserPage(documentLink);
//    		
//    		expect(EC.presenceOf(getTab(PROJECT_PROFILES)));
//        	getTab(PROJECT_PROFILES).click();
//        	
//        	var profile = element(By.xpath("//div[text()='" + profileName + "']"));
//        	browser.driver.wait(EC.presenceOf(profile), 12000).then(function(){
//        		var scan_link = browser.driver.findElement(By.xpath("//div[text()='" + profileName + "']/../div//a[@data-click='scann']"));
//                scan_link.click() 
//        	}); 
    		
        },
        upload: function (filePath, title, done) {
        	browser.ignoreSynchronization = true;
        	browser.get(BrowserNavigator(config).getTokenLink(documentLink)).then(function(){
        		browser.driver.wait(EC.presenceOf(getTab(UPLOAD_PROFILE)), 20000).then(function(){
        			getTab(UPLOAD_PROFILE).click().then(function(){
        				var name_input = $$("profileupload input[name='name']");
        	    		var file_input = $$("profileupload input[name='File']");
        	    		var button_submit = $$("profileupload input[type=submit]");
        	    		browser.driver.wait(EC.presenceOf(name_input), 12000).then(function(){
        	    			expect(name_input.isPresent()).toBe(true);
        	        		expect(file_input.isPresent()).toBe(true);
        	            	
        	                name_input.sendKeys(title);
        	                file_input.sendKeys(filePath);
        	                
        	                browser.driver.wait(EC.presenceOf(button_submit), 12000).then(function(){
        	                	expect(button_submit.isPresent()).toBe(true);
        	                	button_submit.click().then(function(){
        	                		browser.ignoreSynchronization = false;
        	                		done();
        	                	});
        	                });
        	    		});
                	});
        		});
        	});
        	
//        	BrowserNavigator.getBrowserPage(documentLink);
//
//    		expect(EC.presenceOf(getTab(UPLOAD_PROFILE)));
//        	getTab(UPLOAD_PROFILE).click().then(function(){
//        		console.log("Click");
//        	});
//        	
//        	var name_input = $$("profileupload input[name='name']");
//    		var file_input = $$("profileupload input[name='File']");
//    		var button_submit = $$("profileupload input[type=submit]");
//    		
//    		expect(EC.presenceOf(name_input));
//    		expect(EC.presenceOf(file_input));
//        	
//            name_input.sendKeys(title);
//            file_input.sendKeys(filePath);
//            
//            expect(EC.presenceOf(button_submit));
//            button_submit.click();
//            
//            browser.wait(EC.presenceOf(element(by.xpath("//div[text()='" + title + "']"))), 12000);


        },
        visitScannedDocument: function (callback) {
        	browser.get(documentLink).then(function(){
        		var docVersionDetails = $$("documentversion-details");
        		browser.driver.wait(EC.presenceOf(docVersionDetails), 12000).then(function(){
        			expect(docVersionDetails.isPresent()).toBe(true);
            		
            		BrowserNavigator(config).waitForGridToBeLoaded("aggrid", callback);
        		});
        	});
        }
        
    };
};


