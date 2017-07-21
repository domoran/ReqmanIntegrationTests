var EC = protractor.ExpectedConditions;

module.exports = function (config) {
    return {
    	deleteCompany: function (companyId) {
            browser.get(config.baseURL + "/admin/companies");
            
            var companyRow = element(by.xpath("//tr[td[1][. = '" + companyId + "']]"));
            expect(companyRow.isPresent()).toBe(true);
            
            var deleteButton = companyRow.element(by.css("a[data-target='#deleteModal']"));
            expect(deleteButton.isPresent()).toBe(true);
            
            deleteButton.click();
            
            var confirmButton = $$("a#deleteLink");
//            browser.wait(EC.presenceOf(confirmButton), 20000)
            expect(confirmButton.isPresent()).toBe(true);
           	confirmButton.click();
        },
    };
};
