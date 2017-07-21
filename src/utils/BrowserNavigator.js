var EC = protractor.ExpectedConditions;

module.exports = function(config) {
    return {
        getTokenLink: function (pagePath, token) { 
        	if ((pagePath.lastIndexOf(config.baseURL, 0) === 0))
        		pagePath = pagePath.substring(config.baseURL.length, pagePath.legth);
        	
        	if (token)
        		return config.baseURL + "/apilogin/" + token + ";returnurl=" + encodeURIComponent(pagePath);
        	else
        		return config.baseURL + pagePath;
        },
        getBrowserPage: function(url){
        	if (!(url.lastIndexOf(config.baseURL, 0) === 0)) // Check if url starts with baseURL
        		url = config.baseURL + url;
        	
        	browser.get(url);
        },
        waitForGridToBeLoaded: function(gridId, callback){
        	var invisibleGridOverlay = $$("#" + gridId + " .ag-bl-overlay[style*='display: none']");
    		
    		browser.wait(EC.presenceOf(invisibleGridOverlay), 20000).then(callback);
        },
        
    };
};
