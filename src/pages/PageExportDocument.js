module.exports = function (exportLink) {

    return {
    	exportExcelCommentSheet: function (exportName, exportTemplateName, documentNames, additionalAttributes) {

    		// First Page
    		browser.get(exportLink)
    		
    		if (documentNames){
    			for (i = 0; i < documentNames.length; i++) {
                    var docCheckbox = element(by.xpath("//td[text()='" + documentNames[i] + "']")).element(by.xpath("..")).element(by.css("input[type='checkbox']")); 
                    
                    if (docCheckbox.isSelected() != true)
                    	docCheckbox.click();
                }
    		}
       		
       		var continueButton = $$("div.box-footer a");
       		expect(continueButton.isPresent()).toBe(true);
       		continueButton.click();
       		
       		var name_input = $$("input[name='fileName']");
//    		var name_input = $$("input[name='filename']");
       		var template_select = element(by.css("select[name='templateVersionId']"));
//    		var template_select = element(by.css("select[name='TemplateVersion']"))
       		expect(name_input.isPresent()).toBe(true);
       		expect(template_select.isPresent()).toBe(true);
       		var templateOption = template_select.element(by.cssContainingText('option', exportTemplateName));
       		expect(templateOption.isPresent()).toBe(true);
       		
       		name_input.clear().sendKeys(exportName);
       		templateOption.click();
       		
       		//TODO: select the given additional attributes
       		
       		// Version 2.1.1 Anpassung
//       		var button_submit = $$("div.box-footer a");
       		var button_submit = $$("button[type=submit]");
       		expect(button_submit.isPresent()).toBe(true);
       		button_submit.click();
        },        
    };
};


