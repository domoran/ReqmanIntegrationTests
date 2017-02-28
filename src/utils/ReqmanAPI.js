var ReqmanRequest = require("./ReqmanRequest"),
    guid = require("./guid");


var logRequests = false;


module.exports = function (config) {
    var requests = ReqmanRequest(config);

    var postData = function (url, postdata, callback) {
        if (logRequests) console.log("POST(" + url + "):", postdata);

        requests.post(url, postdata, function (statusCode, headers, data) {
            if (logRequests) console.log("ANSWER (" + statusCode + "): ", data);

            if (statusCode < 300) {
                callback(null, data);
            } else {
                callback(data, null);
            }
        });
    };

    var getData = function(url, callback) {
        if (logRequests) console.log("GET(" + url + ")");

        requests.get(url, function(statusCode, headers, data) {
            if (logRequests) console.log("ANSWER (" + statusCode + "): ", data);
            if (statusCode < 300) {
                callback(null, data);
            } else {
                callback(data, null);
            }
        });

    };

    return {
        createCompany: function (callback) {
            return postData("/Company", { name: guid() }, callback);
        },

        createProject: function (customerId, callback) {
            var data = { "customerId": customerId , "description": "Created by Interface Tests", "name": guid() };
            return postData("/Project", data, callback);
        },

        uploadDocument: function (data, callback) {
            var postdata = {
                "url": data["url"],
                "project": data["project"],
                "previousId": data["previousId"] || 0,
                "createJob": false,
            };

            if (data["callbackUrl"]) postdata["callbackUrl"] = data["callbackUrl"];

            return postData("/Document", postdata, callback);
        },

        getDocumentStatus: function (docId, callback) {
            return getData("/Document/" + docId,callback);
        },

        createReqIFDownload: function (docId, callback) {
            var parameters = {
                "replaceNullDate": true,
                "ensureDoorsCompatibility": true,
                "exportAllAdditionalAttributes": true,
            };

            return postData("/ReqIf/ExportToFile/" + docId, parameters, callback);
        },

        downloadReqIF: function (exchangeVersion, callback) {
            requests.download("/Exchange/Download/" + exchangeVersion, callback);
        },

    };
};
