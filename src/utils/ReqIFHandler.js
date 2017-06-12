var fs = require("fs"),
	xml2js = require("xml2js");

var fileContent = null;
var isReady = false;

var isReqIFReady = function(){ 
	return isReady;
}

var readFile = function(path){
	isReady = false;
	fs.exists(path, function(exists) {
		if (exists){
			var parser = new xml2js.Parser();
			fs.readFile(reqifFile, function(err, data) {
			    parser.parseString(data, function (err, result) {
			    	if (!err && result){
			    		fileContent = result["REQ-IF"]["CORE-CONTENT"][0]["REQ-IF-CONTENT"][0];
			    		
			    		isReady = true;
			    	}
			    });
			});
		}
	});
}

var getJSONSpecObjects = function(){
	if (fileContent == null)
		return null;
	
	return fileContent["SPEC-OBJECTS"][0]["SPEC-OBJECT"];
}

var getJSONSpecAttributes = function(){
	if (fileContent == null)
		return null;
	
	return fileContent["SPEC-TYPES"][0]["SPEC-OBJECT-TYPE"][0]["SPEC-ATTRIBUTES"][0]["ATTRIBUTE-DEFINITION-XHTML"];
}

var getJSONSpecHierarchy = function(){
	if (fileContent == null)
		return null;
	
	return fileContent["SPECIFICATIONS"][0]["SPECIFICATION"][0];
}

function ReqIFType (jsonSpecType){
	this.id = jsonSpecAttribute["$"]["IDENTIFIER"];
	this.name = jsonSpecAttribute["$"]["LONG-NAME"];
}

function ReqIFAttribute (jsonSpecAttribute, reqIfDatatypes){
	this.id = jsonSpecAttribute["$"]["IDENTIFIER"];
	this.name = jsonSpecAttribute["$"]["LONG-NAME"];
	this.type = reqIfDatatypes[jsonSpecAttribute["TYPE"]["DATATYPE-DEFINITION-XHTML-REF"]];
	this.value = null;
	
	this.setValue = function(value) {
		this.value = value;
    };
}

function ReqIFObject (jsonSpecObject, reqIfAttributes){
	this.id = jsonSpecObject["$"]["IDENTIFIER"];
	this.attributes = [];
	
	var jsonValues = jsonSpecObject["VALUES"][0]["ATTRIBUTE-VALUE-XHTML"];
	jsonValues.forEach(function(value) {
		var attID = value[""]
	});
	
}

module.exports = function(path) {

	readFile(path);

    return {
    	isReqIFReady: isReqIFReady,
    	readFile: readFile,

    	saveFile: saveFile
    };
};
